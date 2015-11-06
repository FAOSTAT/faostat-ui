/*global define, _:false, $, console, amplify, FM*/
define([
    'globals/Common',
    /* TODO: move to another folder? */
    'text!lib/filters/templates/filter.hbs',
    'text!lib/filters/templates/dropdown.hbs',
    'i18n!nls/common',
    'handlebars',
    'faostatapiclient',
    'underscore',
    'select2',
    'amplify'
], function (Common, templateFilter, templateDropDown, i18nLabels, Handlebars, FAOSTATAPIClient, _) {

    'use strict';

    var s = {

        $DD_CONTAINER: '[data-role="dd-container"]',
        $DD: '[data-role="dd"]'

    };

    var dropDownOptions = {

    }

    function Filter(options) {
        this.o = options || {};

        // init lang
        this.o.lang = Common.getLocale();

        // default dropdownOptions
        this.o.ddOptions = $.extend({}, dropDownOptions, this.o.ddOptions || {});

        // store container variable
        this.$CONTAINER = this.o.container;

        this.initVariables();

        this.initComponents();

        return this;
    }

    Filter.prototype.initVariables = function () {

    },

    Filter.prototype.initComponents = function () {

        this.initTemplate();

        // create dropdown
        this.$DD_CONTAINER = this.$CONTAINER.find(s.$DD_CONTAINER);
        this.$DD_CONTAINER.html(this.createDropdown(this.o));

        this.$DD = this.$DD_CONTAINER.find(s.$DD);

        if (this.o.ddOptions.multiple) {
            this.$DD.attr('multiple', 'multiple');
        }

        if (this.o.ddOptions.addEmptySelection) {
            this.$DD.prepend("<option></option>");
        }

        this.$DD.select2();
    };

    Filter.prototype.initTemplate = function () {
        var template = Handlebars.compile(templateFilter);
        this.$CONTAINER.html(template(this.o));
    };

    Filter.prototype.createDropdown = function (data) {
        var template = Handlebars.compile(templateDropDown);
        return template(data);
    };

    Filter.prototype.getDropDown = function (data) {
        return this.$DD;
    };

    Filter.prototype.getFilter = function () {
        var f = {
            id: this.o.metadata.parameters.id,
            parameter: this.o.parameter,
            codes: this.$DD.val()
        };

        // TODO: remove the alert?
        //console.log(f);
        if (f.codes.length <= 0) {
            amplify.publish(E.NOTIFICATION_WARNING, {
                title: i18nLabels.warning,
                text: 'Select at least one ' + this.o.metadata.parameters.id
            });
        }

        // TODO: if nothing is selected set an alert?
        return f;
    };

    Filter.prototype.unbindEventListeners = function () {

    };

    Filter.prototype.dispose = function () {

        this.unbindEventListeners();
    };

    return Filter;
});
