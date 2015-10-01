/*global define, _:false, $, console, amplify, FM*/
define([
    'views/base/view',
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

    var filters = {};

    // list of the dimensions by code
    var dimensions = {

    };

    var CompareFilterView = View.extend({

        autoRender: true,

        className: 'compare',

        template: template,

        initialize: function (options) {
            this.o = options || {};
        },

        getTemplateData: function () {
            return i18nLabels || {};
        },

        attach: function () {

            console.log('attach');

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {compare: 'compare'});

            this.initVariables();

            this.initComponents();

            this.bindEventListeners();

        },

        initVariables: function () {

            // init lang
            this.o.lang = Common.getLocale();

            this.FAOSTATAPIClient = new FAOSTATAPIClient();

            this.$DD = this.$el.find(s.DD);
            console.log(this.$DD);
            this.$DD.append("aiudjaoisjd");
        },

        initComponents: function () {

            console.log("here");
            this.initFilter();

        },

        createDropdown:function(data) {
            var template, dynamic_data, html;
            template = Handlebars.compile(templateDropDown);
            return template(data);
        },

        initFilter: function() {

            console.log(this.o.data);
            var html = this.createDropdown(this.o);
            console.log(html);

        },


        getFilter: function () {
            // TODO: get all the filters mapping
        },

        bindEventListeners: function () {

        },

        unbindEventListeners: function () {


        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return CompareFilterView;
});
