/*global define, _:false, console, amplify, FM*/
define([
    'jquery',
    'views/base/view',
    'config/FAOSTAT',
    'config/Config',
    'config/Queries',
    'config/Events',
    'text!templates/browse/browse_by_country.hbs',
    'i18n!nls/browse_by_country',
    'handlebars',
    'globals/Common',
    'amplify'
], function ($, View, F, C, Q, E, template, i18nLabels, Handlebars, Common) {

    'use strict';

    var s = {

            TREE: "tree"
        },

        o = {

        };

    var BrowseByCountryView = View.extend({

        autoRender: true,

        className: 'browse',

        template: template,

        initialize: function (options) {

            this.o = $.extend(true, {}, o, options);

            this.o.lang = Common.getLocale();

            // TODO: handle change state
            this.changeState();

        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State. needed?
            amplify.publish(E.STATE_CHANGE, {browse: 'browse'});

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

        changeState: function() {
            console.warn("TODO: read internal state anche change URL state");
            // TODO: handle the country selection
            Common.changeURL(this.o.section, [], false);
        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return BrowseByCountryView;
});
