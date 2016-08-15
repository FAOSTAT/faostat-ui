/*global define, _:false, $, amplify, FM */
define([
    'jquery',
    'globals/Common',
    'config/Config',
    'config/Events',
    'i18n!nls/filter',
    'handlebars',
    'faostatapiclient',
    'underscore',
    'lib/filters/filter',
    'q',
    'loglevel',
    'amplify'
], function ($, Common, C, E, i18nLabels, Handlebars, FAOSTATAPIClient, _, Filter, Q, log) {

    'use strict';

    var s = {

        //FILTERS: '[data-role="filter-box"]'
    },
        events = {
    },

    defaultOptions = {

        // EVENTS
        E: {
            ON_FILTER_CHANGE: E.ON_FILTER_CHANGE
        }

        //requestKey: 0
    };

    function FilterBox() {
        return this;
    }

    FilterBox.prototype.render = function (options) {

        this.o = $.extend(true, {}, defaultOptions, options);

        log.info("FilterBox.render; options", options);

        this.o.lang = Common.getLocale();

        this.initVariables();

        this.applyDefaultFilter();

        this.configurePage();

    };


    FilterBox.prototype.initVariables = function () {

        this.FAOSTATAPIClient = new FAOSTATAPIClient();

        // TODO: have a template?
        //log.info(this.o.container);
        this.$CONTAINER = $(this.o.container);

    };


    FilterBox.prototype.applyDefaultFilter = function () {

        var filterItems = this.o.filter.items|| [],
            defaultFilter =  this.o.filter.defaultFilter || {};

        _.each(filterItems, _.bind(function(f) {
            // TODO: in theory all filters should have it
            if (f.hasOwnProperty('config') && f.config.hasOwnProperty('filter')) {
                f.config.filter = $.extend(true, {}, defaultFilter, f.config.filter);
            }

            log.info("FilterBox.render; f.config.filter", f);

        }, this));

    };

    FilterBox.prototype.configurePage = function() {

        var self = this;
        this.o.filters = [];

        amplify.publish(E.LOADING_SHOW, {container: this.$CONTAINER});

        this._preloadCodelists().then(function(f) {

            amplify.publish(E.LOADING_HIDE, {container: self.$CONTAINER});

            _.each(f, function (c, index) {

                var id = 'filter_box_' + index;

                // TODO: dirty append for the filters
                self.$CONTAINER.append('<div id="' + id + '"></div>');

                // render filter
                var filter = new Filter();

                // binding the right event publish/subscriber
                c.E = self.o.E;
                c.requestKey = self.o.requestKey;

                c.container = self.$CONTAINER.find('#' + id);

                filter.init(c);

                self.o.filters.push(filter);

            });

        }).done(function() {

            amplify.publish(self.o.E.ON_FILTER_CHANGE, {isOnLoad: true, requestKey: self.o.requestKey});

        });

    };

    FilterBox.prototype._preloadCodelists = function () {

        var r = [],
            filterItems = this.o.filter.items,
            self = this;

        _.each(filterItems, function(filter) {

            log.info("FilterBox._preloadCodelists;", filter);

            var type = filter.type;

            switch(type) {
                case 'codelist':
                    r.push(self._preloadCodes(filter));
                    break;
                default:
                    r.push(self._preloadStaticCodes(filter));
                    break;
            }

        });

        return Q.all(r);
    };

    FilterBox.prototype._preloadCodes = function (filter) {

        var id = filter.config.dimension_id,
            defaultCodes = (filter.config.hasOwnProperty("defaultCodes"))? filter.config.defaultCodes: [],
            request = $.extend({}, true, {
            datasource: C.DATASOURCE,
            lang: this.o.lang,
            subcodelists: null,
            show_lists: null,
            show_full_metadata: null,
            ord: null,
            id: id
        }, filter.config.filter);

        log.info("FilterBox._preloadCodes; filter.config.filter", filter.config.filter);

        log.info("FilterBox._preloadCodes; request", request);

        return this.FAOSTATAPIClient.codes(request)
            .then(function(c) {

                // TODO: use directly metadata/data returned by APIs?
                var codes = [];

                // process codes/defaults
                _.each(c.data, function(d) {
                    codes.push($.extend({}, d, {selected: defaultCodes.indexOf(d.code) > -1 }));
                });
                filter.config.data = codes;
                return filter;

            }).fail(function(e) {
                log.error("FilterBox._preloadCodes", e);
                amplify.subscribe(E.CONNECTION_PROBLEM);
            });

    };

    FilterBox.prototype._preloadStaticCodes = function (config) {

        // TODO: add boolean "translatable"? in the json definition?
        _.each(config.config.data, function(d) {

            // change labels if needed with i18nlabels.
            d.label = i18nLabels[d.label] || d.label;

        });

        return config;
    };

    FilterBox.prototype.getFilters = function () {

        var f = [];
        try {
            if (this.o.filters) {
                _.each(Object.keys(this.o.filters), _.bind(function (filterKey) {
                    log.info(filterKey, this.o.filters);
                    f.push(this.o.filters[filterKey].getFilter());
                }, this));
            }
        }catch (e) {
            log.error(e);
        }

        //log.info("end getFilters");

        return f;
    };


    FilterBox.prototype.destroy = function () {

        if (this.o.filters) {
            _.each(Object.keys(this.o.filters), _.bind(function (filterKey) {

                log.info(filterKey, this.o.filters)
                this.o.filters[filterKey].destroy();
            }, this));

            delete this.o.filters;
        }


        // destroy all filters
        if (this.$CONTAINER !== undefined) {
            this.$CONTAINER.empty();
        }

        log.warn("Handle destroy of all filters");

    };

    return FilterBox;
});
