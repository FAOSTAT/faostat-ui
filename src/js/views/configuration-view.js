/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
define([
    'jquery',
    'loglevel',
    'globals/Common',
    'views/base/view',
    'config/Config',
    'config/Events',
    'text!templates/configuration/configuration.hbs',
    'faostatapiclient'
], function ($,
             log,
             Common,
             View,
             C,
             E,
             template,
             api
     ) {

    'use strict';

    var s= {

        },

    ConfigurationView = View.extend({

        autoRender: true,

        className: 'indicators',

        template: template,

        initialize: function (options) {
            this.o = $.extend(true, {}, options);
        },

        getTemplateData: function () {
            return $.extend({}, true, C, {
                URL_API: new api().CONFIG.base_url,
                API_MODE: new api().CONFIG.mode
            });
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            /* Update State. */
            amplify.publish(E.STATE_CHANGE, {configuration: 'configuration'});

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

    return ConfigurationView;

});
