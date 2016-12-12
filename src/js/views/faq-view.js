/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'config/Config',
    'config/Events',
    'config/faq/Config',
    'text!templates/faq/faq.hbs',
    'i18n!nls/faq',
    'globals/Common',
    'amplify'
], function ($,
             log,
             View,
             C,
             E,
             CM,
             template,
             i18nLabels,
             Common) {

    'use strict';

    var s = {

            QUESTION: '[data-role="question"]'

        },

        FAQView = View.extend({

            autoRender: true,

            className: 'faq',

            template: template,

            initialize: function (options) {
                this.o = $.extend(true, {}, options);
            },

            getTemplateData: function () {
                return $.extend(true, {}, i18nLabels, {data: CM.faq[Common.getLocale()] || CM.faq['en']});
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

            goToQuestion: function (id) {

                $('html,body').animate({
                    scrollTop: $(id).offset().top
                });

            },

            initComponents: function () {

            },

            configurePage: function () {

            },

            bindEventListeners: function () {

                var self = this;

                this.$el.find(s.QUESTION).on('click', function (e) {

                    e.preventDefault();

                    self.goToQuestion(this.getAttribute('data-answer'));

                });

            },

            unbindEventListeners: function () {

                this.$el.find(s.QUESTION).off('click');

            },

            dispose: function () {

                this.unbindEventListeners();

                View.prototype.dispose.call(this, arguments);
            }
        });

    return FAQView;

});