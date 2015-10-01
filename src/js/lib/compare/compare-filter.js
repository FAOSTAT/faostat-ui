/*global define, _:false, $, console, amplify, FM*/
define([
    '../../views/base/view',
    'globals/Common',
    'text!templates/compare/compare_filter.hbs',
    'text!templates/compare/dropdown.hbs',
    'handlebars',
    'faostatapiclient',
    'underscore',
    'select2',
    'amplify'
], function ( View, Common, templateFilter, templateDropDown, Handlebars, FAOSTATAPIClient, _) {

    'use strict';

    var s = {

        $DD_CONTAINER: '[data-role="dd-container"]',
        $DD: '[data-role="dd"]'

    };

    function CompareFilter(options) {
        this.o = options || {};

        // store container variable
        console.log(this.o.container);
        this.$CONTAINER = this.o.container;

        this.initVariables();

        this.initComponents();

        return this;
    }

    CompareFilter.prototype.initVariables = function () {

        // init lang
        this.o.lang = Common.getLocale();

        //this.$DD = this.

    },

    CompareFilter.prototype.initComponents = function () {

        this.initTemplate();

        // create dropdown
        this.$DD_CONTAINER = this.$CONTAINER.find(s.$DD_CONTAINER);
        this.$DD_CONTAINER.html(this.createDropdown(this.o));

        this.$DD = this.$DD_CONTAINER.find(s.$DD);
        this.$DD.select2();
    };

    CompareFilter.prototype.initTemplate = function () {
        var template = Handlebars.compile(templateFilter);
        this.$CONTAINER.html(template(this.o));
    };

    CompareFilter.prototype.createDropdown = function (data) {
        var template;
        template = Handlebars.compile(templateDropDown);
        return template(data);
    };

    CompareFilter.prototype.getSelectedOptions = function (data) {
        // TODO: get selected options
    };

    CompareFilter.prototype.getDropDown = function () {
        // TODO: get dropdown
        return this.$DD;
    };

    CompareFilter.prototype.unbindEventListeners = function () {

    };

    CompareFilter.prototype.dispose = function () {

        this.unbindEventListeners();
    };

    return CompareFilter;
});
