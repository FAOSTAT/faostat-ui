/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'config/Config',
    'config/Events',
    'globals/Common',
    'text!templates/search/search.hbs',
    'text!templates/search/search_results.hbs',
    'i18n!nls/search',
    'underscore',
    'handlebars',
    'bootpag',
    'config/browse_by_domain/Config',
    'faostatapiclient',
    'amplify'
], function ($,
             log,
             View,
             C,
             E,
             Common,
             template,
             templateResults,
             i18nLabels,
             _,
             Handlebars,
             bootpag,
             BrowseByDomainConfig,
             FAOSTATClientAPI
){

    'use strict';

    var s = {

        SEARCH_RESULTS: "#search_results",
        PAGINATION: "#pagination",
        DOWNLOAD_BUTTON: "[data-role='download']"

    },
    SearchView = View.extend({

        autoRender: true,

        className: 'search',

        template: template,

        initialize: function (options) {
            this.o = $.extend(true, {}, options);

            // check if query parameter is set
            if (!this.o.hasOwnProperty('query')) {
                log.error('SearchView.initialize; missing query parameter:',  this.o);
            }

        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            /* Update State. */
            amplify.publish(E.STATE_CHANGE, {search: 'search'});

            this.initVariables();

            this.initComponents();

            this.configurePage();

            this.bindEventListeners();

        },

        initVariables: function () {

            // init variables
            this.o.lang = Common.getLocale();
            this.api = new FAOSTATClientAPI();
            this.cache = {};

            this.$SEARCH_RESULTS = this.$el.find(s.SEARCH_RESULTS);
            this.$PAGINATION = this.$el.find(s.PAGINATION);
            this.$DOWNLOAD = this.$el.find(s.PAGINATION);

        },

        parseSearchResults: function(results) {

            log.info(results);

            // cluster results
            var r = [],
                browseWhitelist = BrowseByDomainConfig.whitelist,
                self = this;

            _.each(results.data, function(v, index) {

                // index used to retrieve the obj in cached results
                v.index = index;

                // adding domain name
                log.info( self.getDomain(v.domainCode))
                v = $.extend(true, {}, v, self.getDomain(v.domainCode));

                r.push($.extend(true, {},
                    v,
                    {addBrowse: ($.inArray(v.domainCode, browseWhitelist) !== -1)}));

                log.info(v)
            });

            this.renderResults(r);

        },

        parseSearchResultsClustered: function(results) {

            log.info(results);

            // cluster results
            var cluster = [],
                values = results.data,
                relatedValues = [],
                browseWhitelist = BrowseByDomainConfig.whitelist;

            _.each(values, function(v) {

                if ( $.inArray( v, relatedValues ) === -1 ) {

                    log.info(v.label);

                    var domainCode = v.domainCode,
                        id = v.id,
                        relations = [];

                    // check if a relation exists
                    _.each(values, function(d) {

                        if (d.domainCode === domainCode && d.id !== id) {

                            relations.push(d);

                            relatedValues.push(d);

                        }

                    });

                    cluster.push($.extend(true, {}, v, {relations: relations}, {addBrowse: ($.inArray(domainCode, browseWhitelist) !== -1) }));

                }

            });

            this.renderResults(cluster);

        },

        renderResults: function (results) {

            var self = this,
                page = 1,
                pageSize = 10;

            log.info("Search.renderResults; length", results.length);
            log.info("Search.renderResults; pages", results.length / pageSize);

           this.$PAGINATION.bootpag({
               total: Math.round(results.length / pageSize),
               page: page,
               leaps: false,
               next: 'Next',
               prev: 'Previous',
               //wrapClass: 'pagination',
               activeClass: 'active',
               disabledClass: 'disabled'
            }).on("page", function(event, /* page number here */ num) {

                log.info(event, num);

                self.$SEARCH_RESULTS.html(self.getPage(results, num, pageSize));
                //self.$SEARCH_RESULTS.focus();
                //self.$SEARCH_RESULTS.animate({ scrollTop: 0 }, "fast");
                $('body, html').scrollTop(0);

               // bind export data selection
               self.bindExportDataSelection();

            });

            self.$SEARCH_RESULTS.html(self.getPage(results, page, pageSize));

            // bind export data selection
            self.bindExportDataSelection();

        },

        getPage: function(results, nextPage, pageSize) {

            // TODO: this could be cached
            var t = Handlebars.compile(templateResults),
                currentPage = (nextPage - 1),
                d = {
                    data: results.slice(currentPage * pageSize, nextPage * pageSize)
                };

            return t(d);

        },

        bindExportDataSelection: function() {

            var self = this;

            this.$el.find(s.DOWNLOAD_BUTTON).on('click', function(e) {

                e.preventDefault();

                var index = $(this).data('index');

                log.info($(this).data('index'));

                log.info(e);

                self.exportData(index);
            });
        },

        exportData: function(index) {

            log.info(this.results.data[index]);

            var obj = this.results.data[index],
                exportObj = {
                    datasource: C.DATASOURCE,
                    lang: Common.getLocale(),
                    domain_codes: [obj.domainCode],
                    filters: {}
            };

            exportObj.filters[obj.id] = [obj.code];

            log.info(exportObj);

            amplify.publish(E.EXPORT_DATA, exportObj, {
                requestType: 'databean',
                waitingText: 'Please wait<br> The download could require some time'
            });

        },

        getDomain: function(code) {

            var domains = this.cache.domains;

            for(var i=0; i < domains.length; i++) {
                if (domains[i].DomainCode === code) {
                    return {
                        domainCode: domains[i].DomainCode,
                        domainName: domains[i].DomainName,
                        groupCode: domains[i].GroupCode,
                        groupName: domains[i].GroupName
                    };
                }
            }

            return {};

        },

        initComponents: function () {

            var self = this,
                query = self.o.query;

            // TODO: use this API for caching the groups and domains? or the domainstree with 'search' parameter?
            this.api.domainstree({
                datasource: C.DATASOURCE,
                lang: this.o.lang
            }).then(function(d) {

                // cachind the domains
                self.cache.domains = d.data;

                $.ajax({
                    url: "http://fenixapps2.fao.org/api/v1.0/en/search/" + query,
                    //url: "http://localhost:8081/api/v1.0/en/search/" + query,
                    success: function(results) {

                        self.results = results;

                        //self.parseSearchResultsClustered(result);
                        self.parseSearchResults(results);

                    }
                });
            });

        },

        configurePage: function () {

        },

        bindEventListeners: function () {

        },

        unbindEventListeners: function () {

        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);

        }
    });

    return SearchView;

});
