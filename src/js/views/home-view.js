/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'globals/Common',
    'config/Config',
    'config/Events',
    'config/home/Config',
    'text!templates/home/home.hbs',
    'i18n!nls/home',
    'handlebars',
    'faostatapiclient',
    'fx-c-c/start',
    'config/home/chartModel',
    'amplify'
], function ($, log, View, Common, C, E, CM, template, i18nLabels, Handlebars, API, ChartCreator, ChartModel) {

    'use strict';

    var s = {

        DOMAINS: "#fs_home_domains",
        CHART: "#fs_home_chart",
        WHATS_NEW: "#fs_home_whats_new",
        COMING_UP: "#fs_home_coming_up",
        INFO: "#fs_home_info", // i.e. FAO Statistical pocketbook
        FAO_LINKS: "#fs_home_fao_links",
        DATABASE_UPDATES: "#fs_home_database_updates",
        RELEASE_CALENDAR: "#fs_home_release_calendar",
        PARTNERS: "#fs_home_partners"

    };

    var HomeView = View.extend({

        autoRender: true,

        className: 'home',

        template: template,

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {menu: 'home'});

            this.initVariables();

            this.initComponents();

            this.bindEventListeners();

            this.configurePage();
        },

        initVariables: function () {

            this.$DOMAINS = this.$el.find(s.DOMAINS);
            this.$CHART = this.$el.find(s.CHART);
            this.$WHATS_NEW = this.$el.find(s.WHATS_NEW);
            this.$COMING_UP = this.$el.find(s.COMING_UP);
            this.$INFO = this.$el.find(s.INFO);
            this.$FAO_LINKS = this.$el.find(s.FAO_LINKS);
            this.$PARTNERS = this.$el.find(s.PARTNERS);
            this.$DATABASE_UPDATES = this.$el.find(s.DATABASE_UPDATES);
            this.$RELEASE_CALENDAR = this.$el.find(s.RELEASE_CALENDAR);

            this.api = new API();

        },

        initComponents: function () {

        },

        configurePage: function () {

            this.initChart();

            this.initWhatsNew();

            this.initComingUp();

            this.initDatabaseUpdates();

        },

        initChart: function () {

            var self = this;

            var c = new ChartCreator();

            c.init($.extend(true, {}, CM.chart, {model: ChartModel.model})).then(function (c) {

                c.render($.extend(true, {}, CM.chart, {container: self.$CHART}));

            });

        },

        initWhatsNew: function () {

            amplify.publish(E.LOADING_SHOW, {container: this.$WHATS_NEW});

        },

        initComingUp: function () {

            amplify.publish(E.LOADING_SHOW, {container: this.$COMING_UP});

        },

        initDatabaseUpdates: function () {

            amplify.publish(E.LOADING_SHOW, {container: this.$DATABASE_UPDATES});

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

    return HomeView;

});
