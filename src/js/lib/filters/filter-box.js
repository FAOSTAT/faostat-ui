/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'globals/Common',
    'config/FAOSTAT',
    'config/Config',
    'config/Events',
    'config/EventsCompare',
    'text!lib/filters/templates/filter_box.hbs',
    'text!lib/filters/templates/filter_container.hbs',
    //'text!templates/compare/dropdown.hbs',
    'i18n!nls/compare',
    'handlebars',
    'faostatapiclient',
    'underscore',
    //'views/compare-filter-view-backup',
    'lib/compare/compare-filter',
    'q',
    'amplify',
], function ($, Common, F, C, E, EC, template, templateFilterContainer, i18nLabels, Handlebars, FAOSTATAPIClient, _, Filter, Q) {

    'use strict';

    var s = {

        FILTERS: '[data-role="filters"]',

    };

    var defaultOptions = {

    };

    'use strict';

    function FiltersBox(options) {
        this.o = {};
        this.o.lang = Common.getLocale();
        this.o = $.extend({}, true, defaultOptions, options);
        return this;
    };

    FiltersBox.prototype.initVariables = function () {

    };

    FiltersBox.prototype.configurePage = function(json) {

    };

    FiltersBox.prototype.dispose = function () {

    };

    return FiltersBox;
});
