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
             BrowseByDomainConfig
){

    'use strict';

    var s = {

        SEARCH_RESULTS: "#search_results",
        PAGINATION: "#pagination"

    },
    SearchView = View.extend({

        autoRender: true,

        className: 'search',

        template: template,

        initialize: function (options) {
            this.o = $.extend(true, {}, options);
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

            var query = this.o.query,
                self = this;

            this.$SEARCH_RESULTS = this.$el.find(s.SEARCH_RESULTS);
            this.$PAGINATION = this.$el.find(s.PAGINATION);



            log.info(this.o);

            $.ajax({
                //url: "http://fenixapps2.fao.org/api/v1.0/en/search/" + query,
                url: "http://localhost:8081/api/v1.0/en/search/" + query,
                success: function(result) {
                    self.parseSearchResults(result);
                }
            });

        },

        parseSearchResults: function(results) {

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

        renderResults: function (cluster) {

            var self = this,
                cluster = cluster,
                page = 1,
                pageSize = 10;

            //var t = Handlebars.compile(templateResults),
            //    d = {
            //        data: cluster
            //    },
            //    html = t(d);

            log.info(cluster.length)
            log.info(cluster.length / pageSize)

           this.$PAGINATION.bootpag({
               total: Math.round(cluster.length / pageSize),
               page: page,
               leaps: false,
               next: 'Next',
               prev: 'Previous',
               //wrapClass: 'pagination',
               activeClass: 'active',
               disabledClass: 'disabled'
            }).on("page", function(event, /* page number here */ num){
                log.info(event, num)
                self.$SEARCH_RESULTS.html(self.getPage(cluster, num, pageSize));
                //self.$SEARCH_RESULTS.focus();
                //self.$SEARCH_RESULTS.animate({ scrollTop: 0 }, "fast");
                $('body, html').scrollTop(0);
            });

            self.$SEARCH_RESULTS.html(self.getPage(cluster, page, pageSize));

            //this.$SEARCH_RESULTS.html(html);

        },

        getPage: function(cluster, nextPage, pageSize) {

            // TODO: this could be cached
            var t = Handlebars.compile(templateResults),
                currentPage = (nextPage - 1),
                d = {
                    data: cluster.slice(currentPage * pageSize, nextPage * pageSize)
                };

            return t(d);

        },

        initComponents: function () {

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
