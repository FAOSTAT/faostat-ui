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
    'jquery.rangeSlider',
    'amplify'
], function ($, View, Common, F, C, Q, E, EC, CC, template, i18nLabels, Handlebars, FAOSTATAPIClient, FilterBoxView) {

    'use strict';

    var s = {

        FILTERS_CONTAINER: '[data-role="filters_container"]',
        ADD_FILTER: '[data-role="add_filter"]',
        TIMERANGE: '[data-role="timerange"]',
        APPLY: '[data-role="apply"]',
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

            //console.log(this.$filters);

        },

        initComponents: function () {

            var filter = this.addFilter();

            this.initTimerange();

        },

        configurePage: function () {

        },

        initTimerange: function () {

            this.$TIMERANGE.rangeSlider(CC.timerange.options);
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
            console.log(filterBox);
            return f;
        },

        onFilterBoxRemove: function(box) {
            console.warn('TODO: internal filter remove');
            //this.removeFilter(filterBox);
            console.log(this);
            this.removeFilterBox(box);
        },

        removeFilterBox: function(box) {
            console.log(box);
            console.log(filterBox);
            console.log(filterBox[box.filter.o.filterBoxID]);
            delete filterBox[box.filter.o.filterBoxID];
            console.log(filterBox);
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
