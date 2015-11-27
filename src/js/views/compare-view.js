/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'globals/Common',
    'config/FAOSTAT',
    'config/Config',
    'config/Queries',
    'config/Events',
    'config/EventsCompare',
    'config/compare/Config',
    'config/submodules/fx-chart/highcharts_template',
    'text!templates/compare/compare_2.hbs',
    'i18n!nls/compare',
    'faostatapiclient',
    'views/compare-filter-box-view',
    'q',
    'fx-c-c/start',
    'fx-ds/itemRenders/tableItem',
    'highcharts-export',
    'jquery.rangeSlider',
    'amplify'
], function ($, log, View, Common, F, C, Queries, E, EC, CM, HighchartsTemplate, template, i18nLabels, FAOSTATAPIClient, FilterBoxView, Q, ChartCreator, TableItem) {

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

    var defaultOptions = {
    };

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

            // Google Analytics change page
            amplify.publish(E.GOOGLE_ANALYTICS_PAGE_VIEW, {});

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

            this.FAOSTATAPIClient = new FAOSTATAPIClient();

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
            this.$TIMERANGE.rangeSlider(CM.timerange.options);

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
            //this.removeFilter(filterBox);
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

            // Google Analytics Add CompareData Event
            amplify.publish(E.GOOGLE_ANALYTICS_EVENT, {
                category: F.GOOGLE_ANALYTICS.COMPARE.category,
                action: F.GOOGLE_ANALYTICS.COMPARE.action.compare_data
            });

            try {
                this._retrieveData().then(function (models) {

                    self.$OUTPUT.show();

                    amplify.publish(E.WAITING_HIDE);

                    // create chart
                    self._createTimeserieChart(models);

                    // TODO: create table
                    self._createTables(models);

                });
            } catch (e) {
                amplify.publish(E.WAITING_HIDE);
                log.error(e);
            }
        },

        _retrieveData: function () {

            // get years TODO: get all the years in the timerange?
            var timerange = this.$TIMERANGE.rangeSlider("values"),
                minYear = timerange.min,
                maxYear = timerange.max;

            var years = [];
            for (var i = minYear; i <= maxYear; i++) {
                years.push(i);
            }

            // get for each filterBox the relative filters (domain, items etc...)
            var filters = this._getFiltersSelections();

            log.info(filters)

            // retrieve with getData the data for the single box

            var requests = [];
            // TODO: fix the requests array (DIRTY fix to pass it to the tables)
            this.cachedRequest = [];
            _.each(filters, _.bind(function (f, index) {
                var r = {};

                log.info(f, index)

                _.each(f.filter, function (filterParameter) {

                    r[filterParameter.parameter] = filterParameter.codes;

                    // DIRTY domainName, groupName
                    if ( filterParameter.hasOwnProperty("domainName")) {
                        r.domainName = filterParameter.domainName;
                    }
                    if ( filterParameter.hasOwnProperty("groupName")) {
                        r.groupName = filterParameter.groupName;
                    }
                });

                r = $.extend(true, {}, CM.getData, {
                    datasource: C.DATASOURCE,
                    lang: this.o.lang,

                    // TODO: get the years properly (from the domainSchema)
                    List4Codes: years,
                    "null_values": null,
                    order_by: "year"

                }, r);

                this.cachedRequest.push(r);
                requests.push(this.FAOSTATAPIClient.data(r));

            }, this));

            // WAITING_SHOW
            amplify.publish(E.WAITING_SHOW);

            return Q.all(requests);

        },

        _createTimeserieChart: function (models) {

            var self = this;

            // create Chart
            var c = new ChartCreator();
            $.when(c.init($.extend(true, {}, CM.chart, {model: models[0]}))).then(
                function (creator) {

                    // add timeserie data
                    for (var i = 1; i < models.length; i++) {

                        if (models[i].data.length > 0) {
                            creator.addTimeserieData($.extend(true, {}, CM.chart, {model: models[i]}));
                        }

                    }

                    // render chart
                    creator.createChart(
                        $.extend(true, {},
                            {
                                creator: {
                                    chartObj: HighchartsTemplate
                                }
                            },
                            CM.chart,
                            {
                                container: self.$CHART
                            }
                        )
                    );

                });
        },

        _createTables: function(models) {

            _.each(models, _.bind(this._createTable, this));

        },

        _createTable: function(model, index) {

            // TODO: switch to something better when view will be defined
            var tableID = 'data-role="table_' + index + '"';
            this.$TABLES_CONTAINER.append("<div "+ tableID +"></div>");

            var $table_container = this.$TABLES_CONTAINER.find("[" + tableID +"]");


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
                        addExport: true,
                        export: i18nLabels.export_data
                },

                // TODO: leave exportRequest?
                exportRequest: request

            });
            var t = new TableItem({config: config});

            t.render();

        },

        _getFiltersSelections: function () {

            log.info("getFiltersSelection");

            var filters = [];
            _.each(Object.keys(filterBox), function (filterID) {
                filters.push({
                    filter: filterBox[filterID].getFilters(),
                    filterBox: filterBox
                });
            });
            return filters;

        },

        bindEventListeners: function () {

            this.$ADD_FILTER.on('click', _.bind(this.addFilter, this));
            this.$COMPARE_DATA.on('click', _.bind(this.compareData, this));

        },

        unbindEventListeners: function () {

            amplify.unsubscribe(EC.FILTER_BOX_REMOVE, this.onFilterBoxRemove);

        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);

        }
    });

    return CompareView;
});
