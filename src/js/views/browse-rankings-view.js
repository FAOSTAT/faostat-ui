/*global define, _:false, $, console, amplify, FM*/
define([
    'views/base/view',
    'config/FAOSTAT',
    'config/Config',
    'config/Queries',
    'config/Events',
    'text!templates/browse/browse_rankings.hbs',
    'i18n!nls/browse',
    'handlebars',
    'FAOSTAT_UI_TREE',
    'amplify'
], function (View, F, C, Q, E, template, i18nLabels, Handlebars, Tree) {

    'use strict';

    var s = {

        TREE: "tree"
    };

    var BrowseRankingsView = View.extend({

        autoRender: true,

        className: 'browse',

        template: template,

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

            console.log("BrowseRankingsView");

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
        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return BrowseRankingsView;
});
