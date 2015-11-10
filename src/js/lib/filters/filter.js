/*global define, _:false, $, console, amplify, FM*/
define([
    'globals/Common',
    'config/Events',
    'text!lib/filters/templates/filter.hbs',
    'i18n!nls/filter',
    'handlebars',
    'underscore',
    'select2',
    'amplify'
], function (Common, E, templateFilter, i18nLabels, Handlebars, _) {

    'use strict';

    var s = {

        DD: '[data-role="dd"]',
        FROM_YEAR: 'fromyear',
        TO_YEAR: 'toyear'

    },defaultOptions = {

    };

    function Filter() {

        return this;
    };

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

    };

    Filter.prototype.renderFilter = function () {
        var template = Handlebars.compile(templateFilter);
        var c = $.extend(true, {},{data: this.o.config.data}, this.o.componentType),
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
        var c = $.extend(true, {},{data: this.getTimerangeData(this.o.config.data, 1)}, this.o.componentType);
        c.role = s.FROM_YEAR;
        c.title = i18nLabels.fromyear;
        this.$CONTAINER.append(template(c));

        this.$DD_FROM_YEAR = this.$CONTAINER.find("[data-role='" + s.FROM_YEAR +"']").find(s.DD);
        this.$DD_FROM_YEAR.select2();

        var template = Handlebars.compile(templateFilter);
        var c = $.extend(true, {},{data: this.getTimerangeData(this.o.config.data, 0)}, this.o.componentType);
        c.role = s.TO_YEAR;
        c.title = i18nLabels.toyear;
        this.$CONTAINER.append(template(c));

        // initialize with select2
        this.$DD_TO_YEAR = this.$CONTAINER.find("[data-role='" + s.TO_YEAR +"']").find(s.DD);
        this.$DD_TO_YEAR.select2();

    };

    Filter.prototype.getTimerangeData = function (data, index) {

        var values = [];
        var i = 0;
        _.each(data, function(d) {

            var selected = false;
            if (d.selected) {
                if (i === index) {
                    selected = true;
                }
               i++;
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
            codes: this.$DD.val()
        };

        // TODO: remove the alert?
        if (f.codes.length <= 0) {
            amplify.publish(E.NOTIFICATION_WARNING, {
                title: i18nLabels.warning,
                text: 'Select at least one ' + this.o.metadata.parameters.id
            });
        }

        console.log(f);

        return f;
    };


    Filter.prototype.getFilterTimerange = function () {
        var f = {
            id: this.o.id,
            parameter: this.o.parameter,
        };

        var codes = [];
        for(var i = parseInt(this.$DD_FROM_YEAR.val()); i <= parseInt(this.$DD_TO_YEAR.val()); i++) {
            codes.push(i);
        }
        f.codes = codes;

        // TODO: remove the alert?
        if (f.codes.length <= 0) {
            amplify.publish(E.NOTIFICATION_WARNING, {
                title: i18nLabels.warning,
                text: 'Select at least one ' + this.o.metadata.parameters.id
            });
        }

        console.log(f);

        return f;
    };

    Filter.prototype.bindEventListeners = function () {

        if (this.$DD) {
            this.$DD.change(function (e) {
                amplify.publish(E.VIEW_FILTER_CHANGE, {});
            });
        }

        if (this.$DD_FROM_YEAR) {
            this.$DD_FROM_YEAR.change(function(e) {
                amplify.publish(E.VIEW_FILTER_CHANGE, {});
            });
        }

        if (this.$DD_TO_YEAR) {
            this.$DD_TO_YEAR.change(function (e) {
                amplify.publish(E.VIEW_FILTER_CHANGE, {});
            });
        }

    };

    Filter.prototype.unbindEventListeners = function () {



    };

    Filter.prototype.dispose = function () {

        this.unbindEventListeners();
    };

    return Filter;
});
