/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'views/base/view',
    'globals/Common',
    'config/FAOSTAT',
    'config/Config',
    'config/Queries',
    'config/Events',
    'config/EventsCompare',
    'config/compare/Config',
    'text!templates/compare/compare.hbs',
    'i18n!nls/compare',
    'handlebars',
    'faostatapiclient',
    'views/compare-filter-box-view',
    'q',
    'fx-c-c/start',
    'jquery.rangeSlider',
    'amplify'
], function ($, View, Common, F, C, Queries, E, EC, CC, template, i18nLabels, Handlebars, FAOSTATAPIClient, FilterBoxView, Q, ChartCreator) {

    'use strict';

    var s = {

        FILTERS_CONTAINER: '[data-role="filters_container"]',
        ADD_FILTER: '[data-role="add_filter"]',
        TIMERANGE: '[data-role="timerange"]',
        COMPARE_DATA: '[data-role="compare_data"]',
        CHART: '[data-role="chart"]'

    };

    var filterBoxIDs = 0;

    var filterBox = {};

    var CompareView = View.extend({

        autoRender: true,

        className: 'compare',

        template: template,

        // TODO: remove
        events: {
            'click': function(a) {
            }
        },

        initialize: function (options) {
            this.o = options;
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
            amplify.subscribe(EC.FILTER_BOX_REMOVE, _.bind(this.onFilterBoxRemove, this));

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

            //console.log(this.$filters);

        },

        initComponents: function () {

            // add initial filter
            var filter = this.addFilter();

            // init timerange
            this.$TIMERANGE.rangeSlider(CC.timerange.options);

        },

        configurePage: function () {

        },

        // filters
        addFilter: function() {
            // TODO: keep track of the filters
            var f = new FilterBoxView({
                filterBoxID: ++filterBoxIDs
            });

            this.$FILTERS_CONTAINER.prepend(f.$el);
            // cache the filterBox
            filterBox[f.o.filterBoxID] = f;
            return f;
        },

        onFilterBoxRemove: function(box) {

            console.warn('TODO: internal filter remove');
            //this.removeFilter(filterBox);
            this.removeFilterBox(box);

        },

        removeFilterBox: function(box) {

            if ( Object.keys(filterBox).length > 1 ) {
                delete filterBox[box.filter.o.filterBoxID];
                box.filter.$el.empty();
                console.log(filterBox);
            }

        },

        getFiltersFromBoxes: function() {

          // get the filters from each box to create the chart and the table

        },

        compareData: function() {

            var self = this;

            this.$CHART.empty();

            // Google Analytics Add CompareData Event
            amplify.publish(E.GOOGLE_ANALYTICS_EVENT, {
                category: F.GOOGLE_ANALYTICS.COMPARE.category,
                action: F.GOOGLE_ANALYTICS.COMPARE.action.compare_data
            });

            // loading
            amplify.publish(E.LOADING_SHOW, {container: this.$CHART});

                try {
                    this._retrieveData().then(function (models) {

                        amplify.publish(E.LOADING_HIDE, {container: self.$CHART});

                        // create Chart
                        var c = new ChartCreator();
                        $.when(c.init($.extend(true, {}, CC.chart, {model: models[0]}))).then(
                            function (creator) {
                                for (var i = 1; i < models.length; i++) {
                                    if (models[i].data.length > 0) {
                                        creator.addTimeserieData($.extend(true, {}, CC.chart, {model: models[i]}));
                                    }
                                }

                                // render chart
                                creator.createChart({
                                    // TODO: add chart template
                                    container: self.$CHART
                                });
                            });

                        // TODO: create table

                    });
                }catch(e) {
                    console.error(e);
                }
        },

        _retrieveData: function() {

            // get years TODO: get all the years in the timerange?
            var timerange = this.$TIMERANGE.rangeSlider("values"),
                minYear = timerange.min,
                maxYear = timerange.max;

            var years = [];
            for (var i=minYear; i <= maxYear; i++) {
                years.push(i);
            }

            // get for each filterBox the relative filters (domain, items etc...)
            var filters = this._getFiltersSelections();

            // TODO: check the estimated series dimensions

            // retrieve with getData the data for the single box
            var requests = [];
            _.each(filters, _.bind(function(filter) {
                var r = {};
                _.each(filter, function(filterParameter) {
                    r[filterParameter.parameter] = filterParameter.codes
                });

                r = $.extend(true, {}, CC.getData, {
                    datasource: C.DATASOURCE,
                    lang: this.o.lang,
                    List4Codes: years
                }, r);

                requests.push(this.FAOSTATAPIClient.data(r));

            }, this));

            return Q.all(requests)

        },

        _getFiltersSelections: function() {

            var filters = [];
            _.each(Object.keys(filterBox), function(filterID) {
                filters.push(filterBox[filterID].getFilters());
            });
            return filters;

        },

        bindEventListeners: function () {

            this.$ADD_FILTER.on('click', _.bind(this.addFilter, this));
            this.$COMPARE_DATA.on('click', _.bind(this.compareData, this));

        },

        unbindEventListeners: function () {


        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return CompareView;
});
