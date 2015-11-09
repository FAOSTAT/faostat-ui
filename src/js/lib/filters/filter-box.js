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

        FILTERS: '[data-role="filters"]'

    };

    var defaultOptions = {
        cl: {}
    };

    'use strict';

    function FilterBox() {
        this.o = {};
        this.o.lang = Common.getLocale();
        return this;
    };

    FilterBox.prototype.init = function(options) {
        this.o = $.extend({}, true, defaultOptions, options);

        this.initVariables();

        this.configurePage();

        return this;
    };

    FilterBox.prototype.initVariables = function () {

        this.FAOSTATAPIClient = new FAOSTATAPIClient();

    };

    FilterBox.prototype.configurePage = function() {

        var r = this._preloadCodelists().then(function(filters) {

            console.log(filters);

        });

    };

    FilterBox.prototype._preloadCodelists = function () {

        var r = [],
            filters = this.o.filter,
            self = this;

        _.each(filters, function(filter) {

            var type = filter.type;

            switch(type) {
                case 'codelist':
                    r.push(self._preloadCodes(filter));
                    break;
                default:
                    console.warn("configuration type [" + type + "] not found for: (static is applied)");
                    console.warn(filter);
                    r.push(self._preloadStaticCodes(filter));
                    //this._processStaticConfiguration(c);
                    break;
            }

        });

        return Q.all(r);
    };

    FilterBox.prototype._preloadCodes = function (filter) {

        var self = this,
            id = filter.config.id,
            defaultCodes = filter.config.defaultCodes || {};

        var request = $.extend({}, true, {
            datasource: C.DATASOURCE,
            lang: this.o.lang,
            subcodelists: null,
            show_lists: null,
            show_full_metadata: null,
            ord: null,
            id: id
        }, filter.config.filter);

        return this.FAOSTATAPIClient.codes(request).then(function(c) {

            // TODO: use directly metadata/data returned by APIs?
            var codes = [];

            // process codes/defaults
            _.each(c.data, function(d) {
                codes.push($.extend({}, d, {selected: defaultCodes.indexOf(d.code) > -1 }));
            });
            filter.config.codes = codes;

            return filter;

        });
    };


    FilterBox.prototype._preloadStaticCodes = function (config) {
        return config;
    };

    // Process filters responses
    FilterBox.prototype._processFilters = function () {

    };

    FilterBox.prototype.renderFilter = function() {

    };

    FilterBox.prototype.dispose = function () {

    };

    return FilterBox;
});
