/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'config/Config',
    'config/Events',
    'config/Analytics',
    'config/Routes',
    'globals/Common',
    'text!templates/search/search.hbs',
    'text!templates/search/search_results.hbs',
    'i18n!nls/search',
    'underscore',
    'underscore.string',
    'handlebars',
    'bootpag',
    'faostatapiclient',
    'lib/search/search-box',
    'fs-t-c/table',
    'lib/onboarding/onboarding',
    'amplify'
], function ($,
             log,
             View,
             C,
             E,
             A,
             ROUTE,
             Common,
             template,
             templateResults,
             i18nLabels,
             _,
             _s,
             Handlebars,
             bootpag,
             API,
             SearchBox,
             Table,
             OnBoarding
){

    'use strict';

    var config = {

            isClustered: false

        },

    s = {

        SEARCH_BOX: '#fs-search-box',
        SEARCH_RESULTS: "#fs-search-results",
        SEARCH_RESULT: '[data-role="search-result"]', // used for onboarding
        PAGINATION: "#pagination",

        // download button for each result container
        DOWNLOAD_BUTTON: "[data-role='download']",
        DOWNLOAD_LINK: "[data-role='download-link']",
        PREVIEW: "[data-role='preview']",
        METADATA: "[data-role='metadata']",

        // {{index}} is overwritten at runtime based on the result index
        OUTPUT: "[data-role='output-{{index}}']",

        // Template filters
        TEMPLATE_RESULTS: config.isClustered? "#results_clustered" : "#results_full",

        // onboarding
        ONBOARDING: "[data-role='help']"

    },

    onBoarding = {

        search: {
            id: 'search',
            steps: [{
                        intro: "<h4>Search Result</h4>This is the search result",
                        element: s.SEARCH_RESULT,
                    },
                    {
                        intro: "<h4>Metadata</h4>If you want to see the metadata <i>Click here</i>",
                        element: s.METADATA
                    },
                    {
                        intro: "<h4>Download Page</h4>If you want to go to the domain download data page <i>Click here</i> ",
                        element: s.DOWNLOAD_LINK
                    },
                    {
                        intro: "<h4>Data Preview</h4>If you want to preview the data <i>Click here</i>",
                        element: s.PREVIEW
                    },
                    {
                        intro: "<h4>Download Data</h4>If you want to download the data <i>Click here</i>",
                        element: s.DOWNLOAD_BUTTON
                    }

            ]
        }

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
            amplify.publish(E.SEARCH_BOX_HIDE);

            this.initVariables();

            this.initComponents();

            this.configurePage();

            this.bindEventListeners();

            log.warn("Search; TODO: add Analytics");

        },

        initVariables: function () {

            // init variables
            this.o.lang = Common.getLocale();
            this.cache = {};

            this.$SEARCH_BOX = this.$el.find(s.SEARCH_BOX);
            this.$SEARCH_RESULTS = this.$el.find(s.SEARCH_RESULTS);
            this.$PAGINATION = this.$el.find(s.PAGINATION);
            this.$ONBOARDING = $(s.ONBOARDING);

        },

        initComponents: function () {

            // init search box container
            this.initSearchBox();

            // init query results page
            this.initQuerySearchResults();

        },

        configurePage: function () {

        },

        initQuerySearchResults: function() {

            var self = this,
                query = self.o.query;


            // add query to analytics
            this._analyticsQuery(query);

            amplify.publish(E.LOADING_SHOW, {
                container: this.$SEARCH_RESULTS
            });

            // TODO: use this API for caching the groups and domains? or the domainstree with 'search' parameter?
            // caching domains
            API.groupsanddomains().then(function(d) {

                // cachind the domains
                self.cache.domains = d.data;

                API.search({
                    q: query
                }).then(function(results) {

                    self.results = results;

                    //self.parseSearchResultsClustered(result);
                    if (!config.isClustered) {
                        self.parseSearchResults(results);
                    }else {
                        self.parseSearchResultsClusteredSearch(results);
                    }

                });

            });

        },

        parseSearchResults: function(results) {

            log.info("Search.parseSearchResults; results from query", results);

            // cluster results
            var r = [],
                self = this;

            // TODO: this can be computed and rendered at runtime on page change.
            _.each(results.data, function(v, index) {

                // index used to retrieve the obj in cached results
                v.index = index;

                // adding domain name
                v = $.extend(true, {}, v, self.getDomain(v.domain_code));

                // i18n
                v.type = i18nLabels[v.id];
                v.domain_label = i18nLabels.domain;
                v.group_label = i18nLabels.group;
                v.download_data = i18nLabels.download_data;
                v.show_data = i18nLabels.show_data;
                v.metadata = i18nLabels.metadata;

                // TODO: this can be computed and rendered at runtime on page change.
                v.download_link = "#" + Common.getURI(ROUTE.DOWNLOAD_INTERACTIVE, [v.domain_code]);

                r.push(v);

            });

            log.info("Search.parseSearchResults; parsed results", r);

            this.renderResults(r);

        },

        parseSearchResultsClusteredSearch: function(results) {

            log.info("Search.parseSearchResultsClusteredSearch; results from query", results);

            // cluster results
            var r = [],
                self = this;

            // TODO: this can be computed and rendered at runtime on page change.
            _.each(results.data, function(v, index) {

                // index used to retrieve the obj in cached results
                v.index = index;

                // adding domain name
                v = $.extend(true, {}, v, self.getDomain(v.domain_code));

                // i18n
                v.type = i18nLabels[v.id];
                v.domain_label = i18nLabels.domain;
                v.group_label = i18nLabels.group;
                v.download_data = i18nLabels.download_data;
                v.show_data = i18nLabels.show_data;

                // TODO: this can be computed and rendered at runtime on page change.
                v.download_link = "#" + Common.getURI(ROUTE.DOWNLOAD_INTERACTIVE, [v.domain_code]);

                r.push(v);

            });

            log.info("Search.parseSearchResults; parsed results", r);

            this.renderResults(r);

        },

        /*parseSearchResultsClustered: function(results) {

            log.info(results);

            // cluster results
            var cluster = [],
                values = results.data,
                relatedValues = [],
                browseWhitelist = BrowseByDomainConfig.whitelist;

            _.each(values, function(v) {

                if ( $.inArray( v, relatedValues ) === -1 ) {

                    log.info(v.Label);

                    var domainCode = v.domain_code,
                        id = v.id,
                        relations = [];

                    // check if a relation exists
                    _.each(values, function(d) {

                        if (d.domain_code === domainCode && d.id !== id) {

                            relations.push(d);
                            relatedValues.push(d);

                        }

                    });

                    cluster.push($.extend(true, {}, v, {relations: relations}, {addBrowse: ($.inArray(domainCode, browseWhitelist) !== -1) }));

                }

            });

            this.renderResults(cluster);

        },*/

        renderResults: function (results) {

            var self = this,
                page = 1,
                pageSize = 10;

            log.info("Search.renderResults; results:", results.length, "pages", results.length / pageSize);

            if (results.length === 0) {

                // no data available
                // TODO: fix it in a more consistant way
                this.$SEARCH_RESULTS.html('<h3>'+ i18nLabels.no_results_available_for +'<i>'+ unescape(this.o.query) +'</i></h1>');


            }else {

                // show resuls

                this.$PAGINATION.bootpag({
                    total: Math.round(results.length / pageSize),
                    page: page,
                    leaps: false,
                    next: _s.capitalize(i18nLabels.next),
                    prev: _s.capitalize(i18nLabels.previous),
                    maxVisible: 10,
                    //wrapClass: 'pagination',
                    activeClass: 'active',
                    disabledClass: 'disabled'
                }).on("page", function (event, /* page number here */ num) {

                    self.$SEARCH_RESULTS.html(self.getPage(results, num, pageSize));

                    // scroll to search box to show the results
                    amplify.publish(E.SCROLL_TO_SELECTOR, {container: self.$SEARCH_BOX});

                    // bind export data selection
                    self.bindSearchResultListeners();

                    // binding download link
                    self.bindDownloadLink();

                });

                self.$SEARCH_RESULTS.html(self.getPage(results, page, pageSize));

                // bind export data selection
                self.bindSearchResultListeners();

                // binding download link
                self.bindDownloadLink();
            }

        },

        getPage: function(results, nextPage, pageSize) {

            // TODO: this could be cached
            var t = Handlebars.compile($(templateResults).filter(s.TEMPLATE_RESULTS).html()),
                currentPage = (nextPage - 1),
                d = {
                    data: results.slice(currentPage * pageSize, nextPage * pageSize)
                };

            return t(d);

        },

        bindDownloadLink: function() {

            var self = this;

            log.info(this.$el.find(s.DOWNLOAD_LINK));

            this.$el.find(s.DOWNLOAD_LINK).off('click');
            this.$el.find(s.DOWNLOAD_LINK).on('click', function(e) {

                var obj = self.results.data[index],
                    s = {};

                // adding the export code to the filters
                s[obj.id] = [obj.code];

                // this is will be used on the download data to preselect the clicked indicator
                amplify.store('search.selection', s);

            });

        },

        bindSearchResultListeners: function() {

            var self = this;

            this.$el.find(s.DOWNLOAD_BUTTON).on('click', function(e) {

                e.preventDefault();

                self.exportData($(this).data('index'));

            });

            this.$el.find(s.METADATA).on('click', function(e) {

                e.preventDefault();

                $(this).tooltip('hide');
                self.showMetadata($(this).data('index'));

            });
            this.$el.find(s.METADATA).tooltip('hide');
            this.$el.find(s.METADATA).tooltip();

            this.$el.find(s.PREVIEW).on('click', function(e) {

                e.preventDefault();

                self.showPreview($(this).data('index'));

            });

        },

        exportData: function(index) {

            var obj = this.results.data[index],
                exportObj = {
                    domain_code: obj.domain_code
                };

            // adding the export code to the filters
            exportObj[obj.id] = [obj.code];

            log.info("Search.exportData;", exportObj);

           amplify.publish(E.EXPORT_DATA, exportObj, {
                //requestType: 'databean',
                requestType: 'data',
               // TODO: multilinguage
                waitingText: 'Please wait<br> The download could require some time'
            });

            // this will be a double counting event, but useful to track the events coming from the search
            this._analyticsDownload(exportObj);

        },

        showMetadata: function(index) {

            var obj = this.results.data[index],
                domain_code = obj.domain_code;


            amplify.publish(E.METADATA_SHOW, {
                code: domain_code
            });

        },

        showPreview: function(index) {

            var $output = this.$el.find(s.OUTPUT.replace('{{index}}', index)),
                obj = this.results.data[index],
                title = obj.label,
                subtitle = i18nLabels.data_preview, //"Preview data",
                requestObj = {
                    domain_code: obj.domain_code,
                    //limit: 100,
                    page_number: 1,
                    page_size: 50
                };

            // adding the export code to the filters
            requestObj[obj.id] = [obj.code];

            $output.empty();
            amplify.publish(E.LOADING_SHOW, {container: $output});
            $output.show();

            API.data(requestObj).then(function (d) {

                var table = new Table();
                table.render({
                    container: $output,
                    model: d,
                    adapter: {
                        show_codes: true,
                        thousand_separator: ",",
                        decimal_separator: "."
                    },
                    template: {
                        height: '298',
                        sortable: false,
                        removable: true,
                        addPanel: true,
                        title: title,
                        subtitle: subtitle
                    }
                });

            }).fail(function(e) {
                amplify.publish(E.LOADING_HIDE, {container: $output});
                log.error("Search.showPreview; error", e);
                // TODO: show error message
            });

            // track analytics
            this._analyticsOnPreview(obj);

        },

        getDomain: function(code) {

            var domains = this.cache.domains;

            for(var i=0; i < domains.length; i++) {
                if (domains[i].domain_code === code) {
                    return {
                        domain_code: domains[i].domain_code,
                        domain_name: domains[i].domain_name,
                        group_code: domains[i].group_code,
                        group_name: domains[i].group_name
                    };
                }
            }

            return {};

        },

        initSearchBox: function() {

            var self = this,
                query = self.o.query;

            this.searchBox =  new SearchBox();
            this.searchBox.init({
                query: query,
                container: s.SEARCH_BOX,
                callback: {
                    searchQuery: function(q) {

                        // route to search page
                        //Common.changeURL(ROUTE.SEARCH_QUERY, [escape(q)], true);
                        Common.changeURL(ROUTE.SEARCH_QUERY, [encodeURIComponent(q)], true);
                        //Common.changeURL(ROUTE.SEARCH_QUERY, [encodeURI(q)], true);

                    }
                }
            });

        },

        _analyticsQuery: function(query) {

            amplify.publish(E.GOOGLE_ANALYTICS_EVENT, {
                category: A.search.query.category,
                action: A.search.query.action,
                label: decodeURIComponent(query)
            });
            
        },

        _analyticsDownload: function(obj) {

            // this will be a double counting event, but useful to track the events coming from the search
            amplify.publish(E.GOOGLE_ANALYTICS_EVENT, $.extend(true, {},
                A.search.download, {
                    label: {
                        domain_codes: obj.domain_codes,
                        filters: obj.filters
                    }
                })
            );

        },

        _analyticsOnPreview: function(obj) {

            // this will be a double counting event, but useful to track the events coming from the search
            amplify.publish(E.GOOGLE_ANALYTICS_EVENT, $.extend(true, {},
                A.search.preview, {
                    label: {
                        domain_codes: obj.domain_codes,
                        filters: obj.filters
                    }
                })
            );

        },

        tour: function(e) {

            e.preventDefault();

            var force = true;

            if (this.onboarding === undefined) {
            }
            else{
                this.onboarding.destroy();
            }

            this.onboarding = new OnBoarding();
            this.onboarding.setOptions(onBoarding.search);
            this.onboarding.start(force);

        },

        bindEventListeners: function () {

            this.$ONBOARDING.show();
            this.$ONBOARDING.tooltip('destroy');
            this.$ONBOARDING.tooltip({
                container: 'body'
            });
            this.$ONBOARDING.on('click', _.bind(this.tour, this));

        },

        unbindEventListeners: function () {

            if (this.onboarding) {
                this.onboarding.destroy();
            }

        },

        dispose: function () {

            this.unbindEventListeners();

            // TODO: clean all the results, tables and events

            View.prototype.dispose.call(this, arguments);

        }
    });

    return SearchView;

});
