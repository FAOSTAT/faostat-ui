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
], function ( View, Common, F, C, E, CC, template, templateDropDown, Handlebars, FAOSTATAPIClient, _) {

    'use strict';

    var s = {

        DD: '[data-role="dd"]'

    };

    function CompareFilter(options) {
        this.o = options || {};

        console.log("selector");

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

    };

    CompareFilter.prototype.createDropdown = function (data) {
        var template, dynamic_data, html;
        template = Handlebars.compile(templateDropDown);
        return template(data);
    };


    CompareFilter.prototype.unbindEventListeners = function () {

    };

    CompareFilter.prototype.dispose = function () {

        this.unbindEventListeners();
    };

    return CompareFilter;
});
