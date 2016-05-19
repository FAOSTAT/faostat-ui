/*global define, _:false, amplify, FM*/
define([
    'jquery',
    'globals/Common',
    'config/Events',
    'text!lib/filters/templates/filter.hbs',
    'i18n!nls/filter',
    'handlebars',
    'underscore',
    'loglevel',
    'select2',
    'amplify'
], function ($, Common, E, templateFilter, i18nLabels, Handlebars, _, log) {

    'use strict';

    var s = {

        DD: '[data-role="dd"]',
        FROM_YEAR: 'fromyear',
        TO_YEAR: 'toyear',
        VALIDATION: '[data-role="validation"]'

    },defaultOptions = {

        labelSeparator: "; ",

        E: {
            ON_FILTER_CHANGE: E.ON_FILTER_CHANGE
        }

    };

    function Filter() {

        return this;
    }

    Filter.prototype.init = function (options) {

        this.o = $.extend(true, {}, defaultOptions, options);

        // init lang
        this.o.lang = Common.getLocale();

        // store container variable
        this.$CONTAINER = $(this.o.container);

        this.initVariables();

        this.initComponents();

        this.bindEventListeners();

    };

    Filter.prototype.initVariables = function () {

    };

    Filter.prototype.initComponents = function () {

        var type = this.o.componentType.type || null;

        switch(type) {
            case 'dropDownList-timerange':
                this.renderFilterTimerange();
                break;
            default:
                this.renderFilter();
                break;
        }

        this.$VALIDATION = this.$CONTAINER.find(s.VALIDATION);

    };

    Filter.prototype.renderFilter = function () {
        var template = Handlebars.compile(templateFilter);
        var c = $.extend(true, {}, i18nLabels, {data: this.o.config.data}, this.o.componentType),
            // TODO: how to handle correctly the title?
            title = this.o.title ||  this.o.config.dimension_id || this.o.id;

        c.title = i18nLabels[title] || title;

        this.$CONTAINER.append(template(c));

        // initialize with select2
        this.$DD = this.$CONTAINER.find(s.DD);
        this.$DD.select2();
    };

    /* TODO: make it nicer the timerange. Use plugins "method" for the future.*/
    Filter.prototype.renderFilterTimerange = function () {

        // create two filters
        var template = Handlebars.compile(templateFilter);

        if (this.o.config.defaultCodes === undefined) {
            // TODO: trhrow an error
            log.info(this.o.config.data);
            log.warn("Timerange filter doesn't have default codes. Adding it manually.");

            // TODO: make a proper sorting for the year codes.
            // this should be the older available year
            this.o.config.defaultCodes = [this.o.config.data[this.o.config.data.length-1].code];

        }

        // tODO check if this.o.config.defaultCodes exists
        var fromYearDefaultCode = (this.o.config.defaultCodes[0])? {code: this.o.config.defaultCodes[0]}: {index: (this.o.config.data.length - 1)};
        var c = $.extend(true, {},{data: this.getTimerangeData(this.o.config.data, fromYearDefaultCode)}, this.o.componentType);
        c.role = s.FROM_YEAR;
        c.title = i18nLabels.fromyear;
        this.$CONTAINER.append(template(c));

        this.$DD_FROM_YEAR = this.$CONTAINER.find("[data-role='" + s.FROM_YEAR +"']").find(s.DD);
        this.$DD_FROM_YEAR.select2();

        var template = Handlebars.compile(templateFilter);

        var toYearDefaultCode = (this.o.config.defaultCodes[1])? {code: this.o.config.defaultCodes[1]}: {index: 0};
        var c = $.extend(true, {},{data: this.getTimerangeData(this.o.config.data, toYearDefaultCode)}, this.o.componentType);
        c.role = s.TO_YEAR;
        c.title = i18nLabels.toyear;
        this.$CONTAINER.append(template(c));

        // initialize with select2
        this.$DD_TO_YEAR = this.$CONTAINER.find("[data-role='" + s.TO_YEAR +"']").find(s.DD);
        this.$DD_TO_YEAR.select2();

    };

    Filter.prototype.getTimerangeData = function (data, select) {

        var values = [];
        _.each(data, function(d, index) {

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

        var type = this.o.componentType.type || null;

        switch(type) {
            case 'dropDownList-timerange':
                return this.getFilterTimerange();
                break;
            default:
                return this.getFilterStandard();
                break;
        }

    };

    Filter.prototype.getFilterStandard = function () {
        var f = {
            id: this.o.id,
            parameter: this.o.parameter,
            codes: this.$DD.val(),
            labels: []
        };

        _.each(this.$DD.find(':selected'), function(o) {
            log.info(o);
            f.labels.push(o.text);
        });

        log.info("Filter.getFilterStandard; f.labels:", f.labels);

        f.labels = f.labels.join(this.o.labelSeparator);

        log.info("Filter.getFilterStandard; labels:", f.labels);

        // TODO: remove the alert?
        if (f.codes.length <= 0) {
            amplify.publish(E.NOTIFICATION_WARNING, {
                title: i18nLabels.warning,
                text: 'Select at least one ' + this.o.id
            });
            throw new Error('Error');
        }

        return f;
    };

    Filter.prototype.getFilterTimerange = function () {
        var f = {
                id: this.o.id,
                parameter: this.o.parameter,
                labels: []
            },
            fromYear = this.$DD_FROM_YEAR.val(),
            toYear = this.$DD_TO_YEAR.val();

        var codes = [];
        for(var i = parseInt(fromYear); i <= parseInt(toYear); i++) {
            codes.push(i);
        }
        f.codes = codes;

        // TODO: make it nicer
        f.labels.push(fromYear);
        if ( fromYear !== toYear) {
            f.labels.push(toYear);
        }

        f.labels = f.labels.join(" - ");

        // TODO: remove the alert?
        if (f.codes.length <= 0) {
            amplify.publish(E.NOTIFICATION_WARNING, {
                title: i18nLabels.warning,
                text: 'Range Date selection is not valid: From year: ' + this.$DD_FROM_YEAR.val() + " To year:" + this.$DD_TO_YEAR.val()
            });
            throw new Error('Error');
        }

        return f;
    };

    Filter.prototype.bindEventListeners = function () {

        var self = this;

        if (this.$DD) {
            this.$DD.change(function (e) {

               if ( self.validateSelection(self.$DD)) {
                   amplify.publish(self.o.E.ON_FILTER_CHANGE, {requestKey: self.o.requestKey});
               }
               else{
                   amplify.publish(self.o.E.ON_FILTER_INVALID_SELECTION, {requestKey: self.o.requestKey});
               }

            });
        }

        if (this.$DD_FROM_YEAR) {
            this.$DD_FROM_YEAR.change(function(e) {
                if ( self.validateSelection(self.$DD_FROM_YEAR)) {
                    amplify.publish(self.o.E.ON_FILTER_CHANGE, {requestKey: self.o.requestKey});
                }
                // this should never happen
                else{
                    amplify.publish(self.o.E.ON_FILTER_INVALID_SELECTION, {requestKey: self.o.requestKey});
                }
            });
        }

        if (this.$DD_TO_YEAR) {
            this.$DD_TO_YEAR.change(function (e) {
                if ( self.validateSelection(self.$DD_TO_YEAR)) {
                    amplify.publish(self.o.E.ON_FILTER_CHANGE, {requestKey: self.o.requestKey});
                }
                else{
                    amplify.publish(self.o.E.ON_FILTER_INVALID_SELECTION, {requestKey: self.o.requestKey});
                }
            });
        }

    };

    Filter.prototype.validateSelection = function ($DD) {

        var isValidated = ($DD.val() !== null);

        // check if at least a value is selected
        if (!isValidated) {
            this.$VALIDATION.show();
            this.$VALIDATION.focus();
        }else{
            this.$VALIDATION.hide();
        }

        return isValidated;
    };

    Filter.prototype.unbindEventListeners = function () {

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

        this.unbindEventListeners();

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
