/*global define, _:false, $, console, amplify, FM*/
define([
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
    'amplify'
], function (View, Common, F, C, Q, E, EC, CC, template, i18nLabels, Handlebars, FAOSTATAPIClient, FilterBoxView) {

    'use strict';

    var s = {

        FILTERS_CONTAINER: '[data-role="filters_container"]',
        ADD_FILTER: '[data-role="add_filter"]',
        TIMERANGE: '[data-role="timerange"]',
        APPLY: '[data-role="apply"]',
    };

    var filtersIDs = 0;

    var filters = {};

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

            //update State
            amplify.publish(E.STATE_CHANGE, {compare: 'compare'});
            amplify.subscribe(EC.FILTER_REMOVED, this.onFilterRemove);

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

            //console.log(this.$filters);

        },

        initComponents: function () {

            var filter = this.addFilter();

        },

        configurePage: function () {

        },


        // filters
        addFilter: function() {
            console.log("here");

            // TODO: keep track of the filters
            var filterBox = new FilterBoxView({
                filterID: ++filtersIDs
            });
            filters[filterBox.filterID] = filterBox;
            this.$FILTERS_CONTAINER.prepend(filterBox.$el);

        },

        onFilterRemove: function(filter) {
            console.warn('TODO: internal filter remove');
            this.removeFilter(filter);
        },

        removeFilter: function(filter) {
            console.warn('TODO: internal filter remove');

        },



        bindEventListeners: function () {

            this.$ADD_FILTER.on('click', _.bind(this.addFilter, this));
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
