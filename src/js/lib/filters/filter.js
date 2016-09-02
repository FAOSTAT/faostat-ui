/*global define, _, amplify*/
define([
    'jquery',
    'globals/Common',
    'config/Events',
    'text!lib/filters/templates/filter.hbs',
    'i18n!nls/filter',
    'handlebars',
    'underscore',
    'loglevel',
    'q',
    'faostatapiclient',
    'select2',
    'amplify'
], function ($, Common, E, templateFilter, i18nLabels, Handlebars, _, log, Q, API) {

    'use strict';

    var s = {

        DD: '[data-role="dd"]',
        FROM_YEAR: 'fromyear',
        TO_YEAR: 'toyear',
        VALIDATION: '[data-role="validation"]'

    }, defaultOptions = {

        labelSeparator: "; ",
        componentType: {},

        E: {
            ON_FILTER_CHANGE: E.ON_FILTER_CHANGE
        }

    };

    /* {
     "id": "item",
     "type": "codelist",
     "parameter": "List3Codes",
     // "componentType": {
     // "class": "col-lg-3",
     // "type": "dropDownList"
     // },
     "config": {
     //"dimension_id": "item",
     "defaultCodes": ["27"],
     "filter": {
     "domain_code": "QC"
     }
     }
     }*/

    function Filter(options) {

        return this;
    }

    Filter.prototype.init = function (options) {

        this.o = $.extend(true, {}, defaultOptions, options);

        // init lang
        this.o.lang = Common.getLocale();

        return this;
    };

    Filter.prototype.render = function () {

        this.deferred = Q.defer();

        // store container variable
        this.$CONTAINER = $(this.o.container);

        //log.info("Filter;", this.o);

        // load codes
        var type = this.o.filter.type,
            filter = this.o.filter;

        switch (type) {
            case 'static':
                this._preloadStaticCodes(filter).then(_.bind(this._createFilter, this));
                break;
            case 'codelist':
                this._preloadCodes(filter).then(_.bind(this._createFilter, this));
                break;
            default:
                this._preloadCodes(filter).then(_.bind(this._createFilter, this));
                break;
        }

        return this.deferred.promise;

    };

    Filter.prototype._preloadCodes = function (filter) {

        var config = filter.config,
            // TODO: it should be id
            id = config.dimension_id || config.id,
            defaultCodes = (config.hasOwnProperty("defaultCodes")) ? config.defaultCodes : [],
            request = $.extend(true, {}, {
                id: id
            }, config.filter);

        return API.codes(request)
            .then(function (c) {

                var codes = [];

                // process codes/defaults
                _.each(c.data, function (d) {
                    codes.push($.extend({}, d, {selected: defaultCodes.indexOf(d.code) > -1}));
                });

                return $.extend(true, {}, filter, {config: {data: codes}});

            }).fail(function (e) {
                log.error("Filter._preloadCodes", e);
            });

    };

    Filter.prototype._preloadStaticCodes = function (filter) {

        //log.info("Filter._preloadStaticCodes; filter", filter);
        var defaultCodes = (filter.config.hasOwnProperty("defaultCodes")) ? filter.config.defaultCodes : [];

        // TODO: add boolean "translatable"? in the json definition?
        _.each(filter.config.data, function (d) {

            // change labels if needed with i18nlabels.
            d.label = i18nLabels[d.label] || d.label;

            // process codes/defaults
            //log.info("FilterBox._preloadStaticCodes; d", d, "selected", defaultCodes.indexOf(d.code) > -1);
            d.selected = (defaultCodes.indexOf(d.code) > -1);

        });

        return Q(filter);
    };

    Filter.prototype._createFilter = function (filter) {

        var type = filter.hasOwnProperty('componentType') ? filter.componentType.type : filter.componentType = {};

        switch (type) {
            case 'dropDownList-timerange':
                this._renderFilterTimerange(filter);
                break;
            default:
                this._renderFilter(filter);
                break;
        }

        this.$VALIDATION = this.$CONTAINER.find(s.VALIDATION);

        this.bindEventListeners();

        this.deferred.resolve(this);
    };

    Filter.prototype._renderFilter = function (filter) {

        var config = {
                data: filter.config.data,
                multiple: filter.componentType.multiple,
                class: filter.componentType.class
            },
            title = filter.hasOwnProperty("title") ? filter.title[Common.getLocale()] || filter.title["en"] || i18nLabels[obj.title] || filter.title : null,
            template = Handlebars.compile(templateFilter);

        if (title === null) {
            title = filter.title || filter.dimension_id || filter.id;
            title = i18nLabels[title] || title
        }
        config.title = title;

        this.$CONTAINER.append(template(config));

        // initialize with select2
        this.$DD = this.$CONTAINER.find(s.DD);
        this.$DD.select2();

        return filter;
    };

    /* TODO: make it nicer the timerange. Use plugins "method" for the future.*/
    Filter.prototype._renderFilterTimerange = function (filter) {

        var template = Handlebars.compile(templateFilter),
            data = filter.config.data,
            defaultCodes = filter.config.defaultCodes,
            componentType = filter.componentType;

        if (defaultCodes === undefined) {

            log.warn("Timerange filter doesn't have default codes. Adding it manually.");

            // TODO: make a proper sorting for the year codes.
            defaultCodes = [data[data.length - 1].code];

        }

        // TODO check if this.o.defaultCodes exists
        var fromYearDefaultCode = defaultCodes[0] ? {code: defaultCodes[0]} : {index: (data.length - 1)};
        var c = $.extend(true, {}, {data: this._getTimerangeData(data, fromYearDefaultCode)}, componentType);
        c.role = s.FROM_YEAR;
        c.title = i18nLabels.fromyear;
        this.$CONTAINER.append(template(c));

        this.$DD_FROM_YEAR = this.$CONTAINER.find("[data-role='" + s.FROM_YEAR + "']").find(s.DD);
        this.$DD_FROM_YEAR.select2();

        var toYearDefaultCode = defaultCodes[1] ? {code: defaultCodes[1]} : {index: 0};
        var c = $.extend(true, {}, {data: this._getTimerangeData(data, toYearDefaultCode)}, componentType);
        c.role = s.TO_YEAR;
        c.title = i18nLabels.toyear;
        this.$CONTAINER.append(template(c));

        // initialize with select2
        this.$DD_TO_YEAR = this.$CONTAINER.find("[data-role='" + s.TO_YEAR + "']").find(s.DD);
        this.$DD_TO_YEAR.select2();

        return filter;
    };

    Filter.prototype._getTimerangeData = function (data, select) {

        var values = [];
        _.each(data, function (d, index) {

            var selected = false;
            if (select.code) {
                selected = (d.code === select.code);
            }
            else if (select.index) {
                selected = (index == select.index);
            }
            values.push($.extend({}, d, {selected: selected}));
        });

        return values;

    };

    Filter.prototype.getFilter = function () {

        var filter = this.o.filter,
            type = this.o.hasOwnProperty('componentType') ? filter.componentType.type : null;

        switch (type) {
            case 'dropDownList-timerange':
                return this._getFilterTimerange(filter);
                break;
            default:
                return this._getFilterStandard(filter);
                break;
        }

    };

    Filter.prototype._getFilterStandard = function (filter) {

        //log.info("Filter.getFilterStandard;", filter);

        var labelSeparator = this.o.labelSeparator,
            id = filter.id,
            parameter = filter.parameter,
            f = {
                id: id,
                parameter: parameter,
                codes: this.$DD.val(),
                labels: []
            };

        _.each(this.$DD.find(':selected'), function (o) {
            f.labels.push(o.text);
        });

        f.labels = f.labels.join(labelSeparator);

        //log.info("Filter.getFilterStandard; labels:", f.labels);

        // TODO: remove the alert?
        if (f.codes.length <= 0) {
            //throw new Error('Error');
        }

        return f;
    };

    Filter.prototype._getFilterTimerange = function (filter) {

        var id = filter.id,
            parameter = filter.parameter,
            f = {
                id: id,
                parameter: parameter,
                labels: []
            },
            fromYear = this.$DD_FROM_YEAR.val(),
            toYear = this.$DD_TO_YEAR.val();

        var codes = [];
        for (var i = parseInt(fromYear); i <= parseInt(toYear); i++) {
            codes.push(i);
        }
        f.codes = codes;

        // TODO: make it nicer
        f.labels.push(fromYear);
        if (fromYear !== toYear) {
            f.labels.push(toYear);
        }

        f.labels = f.labels.join(" - ");

        // TODO: remove the alert?
        if (f.codes.length <= 0) {
            //throw new Error('Error');
        }

        return f;
    };


    Filter.prototype.bindEventListeners = function () {

        var self = this;

        if (this.$DD) {
            this.$DD.change(function (e) {
                if (self._validateSelection(self.$DD)) {
                    amplify.publish(self.o.E.ON_FILTER_CHANGE);
                }
                else {
                    amplify.publish(self.o.E.ON_FILTER_INVALID_SELECTION);
                }

            });
        }

        if (this.$DD_FROM_YEAR) {
            this.$DD_FROM_YEAR.change(function (e) {
                if (self._validateTimerangeSelection(self.$DD_FROM_YEAR)) {
                    amplify.publish(self.o.E.ON_FILTER_CHANGE);
                }
                else {
                    amplify.publish(self.o.E.ON_FILTER_INVALID_SELECTION);
                }
            });
        }

        if (this.$DD_TO_YEAR) {
            this.$DD_TO_YEAR.change(function (e) {
                if (self._validateTimerangeSelection(self.$DD_TO_YEAR)) {
                    amplify.publish(self.o.E.ON_FILTER_CHANGE);
                }
                else {
                    amplify.publish(self.o.E.ON_FILTER_INVALID_SELECTION);
                }
            });
        }

    };

    Filter.prototype._validateSelection = function ($DD) {

        var isValidated = $DD.val() !== null;

        // check if at least a value is selected
        if (!isValidated) {
            this.$VALIDATION.show();
            this.$VALIDATION.focus();
        } else {
            this.$VALIDATION.hide();
        }

        return isValidated;
    };

    Filter.prototype._validateTimerangeSelection = function ($DD) {

        var fromYear = this.$DD_FROM_YEAR.val(),
            toYear = this.$DD_TO_YEAR.val(),
            isValidYears = parseInt(fromYear) <= parseInt(toYear),
            isValidSelection = this._validateSelection($DD);

        if (!isValidYears) {
            amplify.publish(E.NOTIFICATION_WARNING, {
                title: 'Range Date selection is not valid',
                text: 'From year ' + fromYear + " - To year " + toYear
            });
            // TODO: implement validation for from-to year
            //this.$VALIDATION.show();
            //this.$VALIDATION.focus();
            // TODO: implement focus?
        }else {
            //this.$VALIDATION.hide();
        }

        // TODO: implement is not valid selection

        return isValidYears;
    };

    Filter.prototype._unbindEventListeners = function () {

        if (this.$DD) {
            this.$DD.off('change');
        }

        if (this.$DD_FROM_YEAR) {
            this.$DD_FROM_YEAR.off('change');
        }

        if (this.$DD_TO_YEAR) {
            this.$DD_TO_YEAR.off('change');
        }

    };

    Filter.prototype.destroy = function () {

        //log.info("Filter.destroy;");

        this._unbindEventListeners();

        if (this.$DD) {
            this.$DD.empty();
        }

        if (this.$DD_FROM_YEAR) {
            this.$DD_FROM_YEAR.empty();
        }

        if (this.$DD_TO_YEAR) {
            this.$DD_TO_YEAR.empty();
        }

    };

    return Filter;
});
