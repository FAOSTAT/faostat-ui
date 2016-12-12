/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'globals/Common',
    'config/Analytics',
    'config/Config',
    'config/Events',
    'config/compare/Events',
    'config/compare/Config',
    'config/submodules/fx-chart/highcharts_template',
    'text!templates/compare/compare.hbs',
    'i18n!nls/compare',
    'faostatapiclient',
    'views/compare-filter-box-view',
    'q',
    'fx-c-c/start',
    'fx-ds/itemRenders/tableItem',
    'highcharts-export',
    'ion.rangeSlider',
    'amplify'
], function ($, log, View, Common, A, C, E, EC, CM, HighchartsTemplate, template, i18nLabels, API, FilterBoxView, Q, ChartCreator, TableItem) {

    'use strict';

    var s = {

        FILTERS_CONTAINER: '[data-role="filters_container"]',
        ADD_FILTER: '[data-role="add_filter"]',
        TIMERANGE: '[data-role="timerange"]',
        OUTPUT: '[data-role="output"]',
        COMPARE_DATA: '[data-role="compare_data"]',
        CHART: '[data-role="chart"]',
        TABLES_CONTAINER: '[data-role="tables_container"]'

    };

    var defaultOptions = {};

    // TODO: check all global objects
    var filterBoxIDs = 0;

    var filterBox = {};

    var CompareView = View.extend({

        autoRender: true,

        className: 'compare',

        template: template,

        initialize: function (options) {
            this.o = $.extend(true, {}, defaultOptions, options);

            filterBox = {};
            filterBoxIDs = 0;

        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {compare: 'compare'});
            amplify.subscribe(EC.FILTER_BOX_REMOVE, this, this.onFilterBoxRemove);

            this.initVariables();

            this.initComponents();

            this.bindEventListeners();

            this.configurePage();
        },

        initVariables: function () {

            this.o.lang = Common.getLocale();

            this.$FILTERS_CONTAINER = this.$el.find(s.FILTERS_CONTAINER);
            this.$ADD_FILTER = this.$el.find(s.ADD_FILTER);
            this.$TIMERANGE = this.$el.find(s.TIMERANGE);
            this.$COMPARE_DATA = this.$el.find(s.COMPARE_DATA);
            this.$CHART = this.$el.find(s.CHART);
            this.$TABLES_CONTAINER = this.$el.find(s.TABLES_CONTAINER);
            this.$OUTPUT = this.$el.find(s.OUTPUT);

        },

        initComponents: function () {

            // add initial filter
            var filter = this.addFilter();

            // init timerange
            this.$TIMERANGE.ionRangeSlider(CM.timerange.options);

        },

        configurePage: function () {

        },

        // filters
        addFilter: function () {

            // TODO: keep track of the filters
            var f = new FilterBoxView({
                filterBoxID: ++filterBoxIDs
            });

            this.$FILTERS_CONTAINER.prepend(f.$el);
            // cache the filterBox
            filterBox[f.o.filterBoxID] = f;
            return f;
        },

        onFilterBoxRemove: function (box) {

            log.warn('TODO: internal filter remove');
            this.removeFilterBox(box);

        },

        removeFilterBox: function (box) {

            if (Object.keys(filterBox).length > 1) {
                delete filterBox[box.filter.o.filterBoxID];
                box.filter.$el.empty();
            }

        },

        getFiltersFromBoxes: function () {

            // get the filters from each box to create the chart and the table

        },

        compareData: function () {

            var self = this;

            // TODO: destroy cached chart/tables
            this.$CHART.empty();
            this.$TABLES_CONTAINER.empty();

            this._retrieveData()
                .then(function (models) {

                    self.$OUTPUT.show();

                    amplify.publish(E.WAITING_HIDE);

                    // create chart
                    self._createTimeserieChart(models);

                    // TODO: create table
                    self._createTables(models);

                    amplify.publish(E.SCROLL_TO_SELECTOR, {
                        container: self.$OUTPUT,
                        paddingTop: 0,
                        force: true,
                        forceInvisible: true
                    });

                })
                .fail(function(e) {
                    log.error("Compare.compareData", e);
                    amplify.publish(E.WAITING_HIDE);
                    amplify.publish(E.CONNECTION_PROBLEM);
                });
        },

        _retrieveData: function () {

            var timerange = this.$TIMERANGE.ionRangeSlider("values"),
                minYear = timerange.data("from"),
                maxYear = timerange.data("to"),
                years = [],
                // the domain codes are cached for analytics
                domainCodes = [];

            for (var i = minYear; i <= maxYear; i++) {
                years.push(i.toString());
            }

            // get for each filterBox the relative filters (domain, items etc...)
            var filters = this._getFiltersSelections();

            // retrieve with getData the data for the single box
            var requests = [];

            // TODO: fix the requests array (DIRTY fix to pass it to the tables)
            this.cachedRequest = [];
            _.each(filters, _.bind(function (f, index) {
                var r = {};

                // the domain codes are cached for analytics
                domainCodes.push(f.filterBox.getDomainCode());

                _.each(f.filter, function (filterParameter) {

                    if (CM.filters.blacklistCodesID.indexOf(filterParameter.id) <= -1) {

                        r[filterParameter.parameter] = filterParameter.codes;

                    }
                    else {

                        // TODO: how to do a dynamic search for the years, and in case for other filters?
                        // years (filter by the right years accordingly to the domain)
                        r[filterParameter.parameter] = _.intersection(years, filterParameter.codes);

                    }

                });

                // TODO: remove it from here
                r.domainName = f.filterBox.getDomainName();
                r.groupName = f.filterBox.getGroupName();

                r = $.extend(true, {}, CM.getData, {
                    // TODO: get the years properly (from the domainSchema)
                    // filter the years accordingly to the domain
                    null_values: null,
                    order_by: "year"

                }, r);

                this.cachedRequest.push(r);
                requests.push(API.data(r));

            }, this));

            // WAITING_SHOW
            amplify.publish(E.WAITING_SHOW);

            amplify.publish(E.GOOGLE_ANALYTICS_EVENT, {
                category: A.compare.compare_data.category,
                action: A.compare.compare_data.action,
                label: {
                    code: domainCodes
                }
            });

            return Q.all(requests);

        },

        _createTimeserieChart: function (models) {

            // create Chart
            var c = new ChartCreator();
            c.init($.extend(true, {},
                CM.chart,
                {
                    container: this.$CHART,
                    //model: models[0],
                    creator: {
                        chartObj: HighchartsTemplate
                    }
                })
            ).then(
                function (creator) {

                    // add timeserie data
                    for (var i = 0; i < models.length; i++) {

                        if (models[i].data.length > 0) {
                            creator.addTimeserieData($.extend(true, {}, CM.chart, {model: models[i]}));
                        }

                    }
                    creator.render({
                        useAdapterChartObj: true
                    });

                });
        },

        _createTables: function (models) {

            _.each(models, _.bind(this._createTable, this));

        },

        _createTable: function (model, index) {

            // TODO: switch to something better when view will be defined
            var tableID = 'data-role="table_' + index + '"';
            this.$TABLES_CONTAINER.append("<div " + tableID + "></div>");

            var $table_container = this.$TABLES_CONTAINER.find("[" + tableID + "]");


            // DIRTY request
            var request = this.cachedRequest[index],
                domainName = request.domainName || "",
                groupName = request.groupName || "";

            log.info(request);

            // create table

            var config = $.extend(true, {},
                CM.table,
                {
                    container: $table_container,
                    model: model,
                    template: {
                        title: groupName + " - " + domainName,
                        addExport: true
                    },

                    // TODO: leave exportRequest?
                    exportRequest: request

                });
            var t = new TableItem({config: config});

            t.render();

        },

        _getFiltersSelections: function () {


            var filters = [];
            _.each(Object.keys(filterBox), function (filterID) {
                filters.push({
                    filter: filterBox[filterID].getFilters(),
                    filterBox: filterBox[filterID]
                });
            });

            //log.info("getFiltersSelection", filters);
            return filters;

        },

        bindEventListeners: function () {

            var self = this;

            this.$ADD_FILTER.on('click', function() {

                self.addFilter();

                amplify.publish(E.GOOGLE_ANALYTICS_EVENT, {
                    category: A.compare.add_filter.category,
                    action: A.compare.add_filter.action,
                    label: ''
                });

            });

            this.$COMPARE_DATA.on('click', function() {

                self.compareData();

            });

        },

        unbindEventListeners: function () {

            amplify.unsubscribe(EC.FILTER_BOX_REMOVE, this.onFilterBoxRemove);

        },

        dispose: function () {

            // TODO: delete all filters
            
            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);

        }
    });

    return CompareView;
});
