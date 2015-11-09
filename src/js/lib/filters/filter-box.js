/*global define, _:false, $, console, amplify, FM*/
define([
    'globals/Common',
    'config/FAOSTAT',
    'config/Config',
    'config/Events',
    'config/EventsCompare',
    //'text!templates/compare/dropdown.hbs',
    'i18n!nls/browse',
    'handlebars',
    'faostatapiclient',
    'underscore',
    //'views/compare-filter-view-backup',
    'lib/filters/filter',
    'q',
    'amplify',
], function (Common, F, C, E, EC, i18nLabels, Handlebars, FAOSTATAPIClient, _, Filter, Q) {

    'use strict';

    var s = {

        //FILTERS: '[data-role="filter-box"]'

    };

    var defaultOptions = {
        cl: {}
    };

    'use strict';

    function FilterBox() {
        return this;
    };

    FilterBox.prototype.init = function(options) {
        this.o = $.extend(true, {}, defaultOptions, options);

        this.o.lang = Common.getLocale();

        this.initVariables();

        this.configurePage();

        return this;
    };

    FilterBox.prototype.initVariables = function () {

        this.FAOSTATAPIClient = new FAOSTATAPIClient();

        // TODO: have a template?
        this.$CONTAINER = $(this.o.container);

    };

    FilterBox.prototype.configurePage = function() {

        var self = this;
        this.filters = [];

        this._preloadCodelists().then(function(f) {

            _.each(f, function(c, index) {

                var id = 'filter_box_'+ index;

                // TODO: dirty append for the filters
                self.$CONTAINER.append('<div id="'+ id + '"></div>');

                // render filter
                var filter = new Filter();

                c.container = self.$CONTAINER.find('#' + id);

                filter.init(c);

                self.filters.push(filter)

            });

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
                    //console.warn("configuration type [" + type + "] not found for: (static is applied)");
                    //console.warn(filter);
                    r.push(self._preloadStaticCodes(filter));
                    //this._processStaticConfiguration(c);
                    break;
            }

        });

        return Q.all(r);
    };

    FilterBox.prototype._preloadCodes = function (filter) {

        var id = filter.config.id,
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
            filter.config.data = codes;

            console.log(filter.config.data );

            return filter;

        });

    };

    FilterBox.prototype._preloadStaticCodes = function (config) {
        return config;
    };


    FilterBox.prototype.dispose = function () {

    };

    return FilterBox;
});
