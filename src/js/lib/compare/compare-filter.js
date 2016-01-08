/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'config/Events',
    'globals/Common',
    /* TODO: move to another folder? */
    'text!lib/compare/templates/compare_filter.hbs',
    'text!lib/compare/templates/dropdown.hbs',
    'i18n!nls/compare',
    'handlebars',
    'faostatapiclient',
    'underscore',
    'select2',
    'amplify'
], function ($, log, E, Common, templateFilter, templateDropDown, i18nLabels, Handlebars, FAOSTATAPIClient, _) {

    'use strict';

    var s = {

            DD_CONTAINER: '[data-role="dd-container"]',
            DD: '[data-role="dd"]',
            VALIDATION: '[data-role="validation"]'

        },

        defaultOptions = {

            show: true

    }

    function CompareFilter(options) {
        this.o = options || {};

        // init lang
        this.o.lang = Common.getLocale();

        // default dropdownOptions
        this.o.ddOptions = $.extend(true, {}, defaultOptions, this.o.ddOptions || {});

        // store container variable
        this.$CONTAINER = this.o.container;

        this.initVariables();

        if (this.o.ddOptions.show) {
            this.initComponents();
        }

        return this;
    }

    CompareFilter.prototype.initVariables = function () {

    };

    CompareFilter.prototype.initComponents = function () {

        this.initTemplate();

        // create dropdown
        this.$DD_CONTAINER = this.$CONTAINER.find(s.DD_CONTAINER);

        this.$DD_CONTAINER.html(this.createDropdown($.extend(true, {}, i18nLabels, this.o)));

        this.$DD = this.$DD_CONTAINER.find(s.DD);

        if (this.o.ddOptions.multiple) {
           // this.$DD.attr('multiple', 'multiple');
        }

        if (this.o.ddOptions.addEmptySelection) {
            //this.$DD.prepend("<option></option>");
        }

        this.$DD.select2({
            placeholder: this.o.placeholder || "Select a..."
        });

        this.$VALIDATION = this.$DD_CONTAINER.find(s.VALIDATION);


        this.$DD.change(_.bind(this.onChange, this));

    };

    CompareFilter.prototype.initTemplate = function () {
        var template = Handlebars.compile(templateFilter);
        this.$CONTAINER.html(template(this.o));
    };

    CompareFilter.prototype.createDropdown = function (data) {
        var template = Handlebars.compile(templateDropDown);
        return template(data);
    };

    CompareFilter.prototype.getDropDown = function (data) {
        return this.$DD;
    };

    CompareFilter.prototype.getFilter = function () {

        if (this.o.ddOptions.show) {
            return this.getFilterVisible();
        }else {
            return this.getFilterInvisible();
        }

    };

    CompareFilter.prototype.getFilterVisible = function () {
        var f = {
            id: this.o.metadata.parameters.id,
            parameter: this.o.parameter,
            codes: this.$DD.val() || []
        };

        // TODO: remove the alert?

        if (f.codes.length <= 0) {

            // focus could be enough with a different style?
            this.$VALIDATION.focus();

            amplify.publish(E.NOTIFICATION_WARNING, {
                title: i18nLabels.warning,
                text: 'Select at least one ' + i18nLabels[this.o.metadata.parameters.id] || this.o.metadata.parameters.id
            });

            log.error('Select at least one ' + this.o.metadata.parameters.id);
            throw new Exception('Select at least one ' + this.o.metadata.parameters.id);
        }

        // TODO: if nothing is selected set an alert?
        return f;
    };


    CompareFilter.prototype.getFilterInvisible = function () {

        var f = {
            id: this.o.metadata.parameters.id,
            parameter: this.o.parameter,
            codes: []
        };

        _.each(this.o.data, function(d) {
            f.codes.push(d.code);
        });

        return f;
    };

    CompareFilter.prototype.onChange = function() {

        var v = this.$DD.val();

        if ( v === null || v === undefined) {
            this.$VALIDATION.show();
        }
        else {
            // in theory if passes should be selected something
            this.$VALIDATION.hide();
        }

    };

    CompareFilter.prototype.unbindEventListeners = function () {

    };

    CompareFilter.prototype.dispose = function () {

        this.unbindEventListeners();
    };

    return CompareFilter;
});
