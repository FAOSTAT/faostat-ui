/*global define, _:false, $, amplify, FM */
define([
    'jquery',
    'globals/Common',
    'config/Config',
    'config/Events',
    'i18n!nls/filter',
    'text!lib/filters/templates/filter-box.hbs',
    'handlebars',
    'faostatapiclient',
    'underscore',
    'lib/filters/filter',
    'q',
    'loglevel',
    'amplify'
], function ($, Common, C, E, i18nLabels, template, Handlebars, API, _, Filter, Q, log) {

    'use strict';

    var defaultOptions = {

        // EVENTS
        E: {
            ON_FILTER_CHANGE: E.ON_FILTER_CHANGE
        }

    },
    s = {
        LOADING: '[data-role=loading]',
        FILTERS: '[data-role=filters]'
    };

    function FilterBox() {
        return this;
    }

    FilterBox.prototype.render = function (options) {

        var deferred = Q.defer();

        this.o = $.extend(true, {}, defaultOptions, options);

        // log.info("FilterBox.render; options", options);

        this.o.lang = Common.getLocale();

        this._initVariables();

        this._applyDefaultFilter();

        this._configurePage(deferred);

        return deferred.promise;
    };


    FilterBox.prototype._initVariables = function () {

        var t = Handlebars.compile(template);

        if (this.o.hasOwnProperty('container')) {
            this.$CONTAINER = $(this.o.container);
            this.$CONTAINER.html(t());

            this.$LOADING = this.$CONTAINER.find(s.LOADING);
            this.$FILTERS = this.$CONTAINER.find(s.FILTERS);
        }else{
            log.error("FilterBox._initVariables; missing container", this.o);
        }

    };

    FilterBox.prototype._applyDefaultFilter = function () {

        //log.info("FilterBox.applyDefaultFilter;");

        // TODO: leave only this.o.items when dashboards are ready
        var filterItems = this.o.items || this.o.filter.items || [],
            defaultFilter = this.o.defaultFilter || this.o.filter.defaultFilter || {};

        _.each(filterItems, _.bind(function (f) {
            // TODO: in theory all filters should have it
            if (f.hasOwnProperty('config') && f.config.hasOwnProperty('filter')) {
                f.config.filter = $.extend(true, {}, defaultFilter, f.config.filter);
            }

        }, this));

    };

    FilterBox.prototype._configurePage = function (deferred) {

        var self = this;
        this.filters = [];

        amplify.publish(E.LOADING_SHOW, {container: this.$LOADING});

        Q.all(this._preloadFilters()).then(function (filters) {

            amplify.publish(E.LOADING_HIDE, {container: self.$LOADING});
            self.$FILTERS.show();

            //log.info("FilterBox._configurePage;", filters);

            self.filters = filters;

            deferred.resolve();

        });

    };

    FilterBox.prototype._preloadFilters = function () {

        //log.info("FilterBox._preloadFilters;");

        var filters = [],
            // TODO: leave only this.o.items
            filterItems = this.o.items || this.o.filter.items,
            self = this;

        _.each(filterItems, function (filter) {

            var id = 'filter_box_' + Math.random().toString().replace('.');

            // TODO: dirty append for the filters
            self.$FILTERS.append('<div id="' + id + '"></div>');

            // render filter
            var f = new Filter();
            f.init({
                filter: filter,
                container: self.$FILTERS.find('#' + id),
                E: self.o.E
            });
            filters.push(f.render());

        });

        return filters;
    };

    FilterBox.prototype.getFilters = function () {

        //log.info("FilterBox.getFilters;", this.filters);

        var f = [];
        try {
            if (this.filters) {
                _.each(this.filters, function (filter) {
                    f.push(filter.getFilter());
                });
            }
        } catch (e) {
            log.error("FilterBox.getFilters;", e);
        }

        return f;
    };

    FilterBox.prototype.unbindEventListeners = function () {

    };

    FilterBox.prototype.destroy = function () {

        log.info("FilterBox.destroy;");

        if (this.filters) {
            _.each(this.filters, _.bind(function (filter) {

                filter.destroy();

            }, this));

            //delete this.filters;
            delete this.filters;
        }

        this.unbindEventListeners();

        // destroy all filters
        if (this.$CONTAINER !== undefined) {
            this.$CONTAINER.empty();
        }

    };

    return FilterBox;
});
