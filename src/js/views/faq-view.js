/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'config/Config',
    'config/Events',
    'text!templates/faq/faq.hbs',
    'i18n!nls/common',
    'globals/Common',
    'amplify'
], function ($,
             log,
             View,
             C,
             E,
             template,
             i18nLabels
) {

    'use strict';

    var s,
        FAQView;

    s = {

    };

    FAQView = View.extend({

        autoRender: true,

        className: 'faq',

        template: template,

        initialize: function (options) {
            this.o = $.extend(true, {}, options);
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            /* Update State. */
            amplify.publish(E.STATE_CHANGE, {faq: 'faq'});

            this.initVariables();

            this.initComponents();

            this.configurePage();

            this.bindEventListeners();

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

    return FAQView;

});