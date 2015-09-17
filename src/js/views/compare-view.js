/*global define, _:false, $, console, amplify, FM*/
define([
    'views/base/view',
    'config/FAOSTAT',
    'config/Config',
    'config/Queries',
    'config/Events',
    'text!templates/compare/compare.hbs',
    'text!templates/compare/compare_box.hbs',
    'text!templates/compare/compare_filters.hbs',
    'text!templates/compare/compare_resume.hbs',
    'i18n!nls/compare',
    'handlebars',
    // TODO the views probably can be loaded at runtime?
    'views/compare-view',
    'amplify'
], function (View, F, C, Q, E, template, templateBox, templateFilters, templateResume, i18nLabels, Handlebars) {

    'use strict';

    var s = {

    };

    var CompareView = View.extend({

        autoRender: true,

        className: 'compare',

        template: template,

        // TODO: remove
        events: {
            'click': function(a) {
            }
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {compare: 'compare'});

            this.initVariables();

            this.initComponents();

            this.bindEventListeners();

            this.configurePage();
        },

        initVariables: function () {

        },

        initComponents: function () {

        },

        configurePage: function () {

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

    return CompareView;
});
