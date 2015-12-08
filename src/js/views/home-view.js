/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'globals/Common',
    'config/Routes',
    'config/Config',
    'config/Events',
    'config/home/Config',
    'text!templates/home/home.hbs',
    'text!templates/home/news.hbs',
    'text!templates/home/domains.hbs',
    'i18n!nls/home',
    'handlebars',
    'faostatapiclient',
    'fx-c-c/start',
    'config/browse_by_domain/Config',
    'config/home/sample/chartModel',
    'config/home/sample/whatsNew',
    'config/home/sample/comingUp',
    'amplify'
], function ($, log, View, Common, ROUTE, C, E, CM, template, templateNews, templateDomains, i18nLabels, Handlebars, API, ChartCreator,
             BrowseByDomainConfig,
             ChartModel,
             WhatsNew,
             ComingUp
) {

    'use strict';

    var s = {

        DOMAINS: "#fs_home_domains",
        GO_TO_BROWSE: '[data-role="go_to_browse"]',
        GO_TO_DOWNLOAD: '[data-role="go_to_download"]',


        CHART: "#fs_home_chart",
        WHATS_NEW: "#fs_home_whats_new",
        COMING_UP: "#fs_home_coming_up",
        INFO: "#fs_home_info", // i.e. FAO Statistical pocketbook
        FAO_LINKS: "#fs_home_fao_links",
        DATABASE_UPDATES: "#fs_home_database_updates",
        RELEASE_CALENDAR: "#fs_home_release_calendar",
        PARTNERS: "#fs_home_partners",
        COUNTRY_PROFILES: "#fs_home_country_profiles"

    };

    var HomeView = View.extend({

        autoRender: true,

        className: 'home',

        template: template,

        getTemplateData: function () {

            // ADD links
            // TODO: helper?
            var d = $.extend(true, {}, i18nLabels, {
                URL_FAOSTAT_DATABASE_ZIP: C.URL_FAOSTAT_DATABASE_ZIP,
                URL_COUNTRY_PROFILES: C.URL_COUNTRY_PROFILES,
                EMAIL_FAO_STATISTICS: C.EMAIL_FAO_STATISTICS,
                TELEPHONE_FAO_STATISTICS: C.TELEPHONE_FAO_STATISTICS
            });

            return d;
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
            this.$COUNTRY_PROFILES = this.$el.find(s.COUNTRY_PROFILES);

            this.api = new API();

        },

        initComponents: function () {

        },

        configurePage: function () {

            this.initDomains();

            this.initChart();

            this.initWhatsNew();

            this.initComingUp();

            this.initDatabaseUpdates();

        },

        initDomains: function () {

            var self = this,
                browseWhiteList = BrowseByDomainConfig.whitelist || [],
                browseBlackList = BrowseByDomainConfig.blacklist || [];

            this.api.groups({
                dataosource: C.DATASOURCE,
                lang: Common.getLocale()
            }).then(function(json) {

                // TODO: how to handle the browse blacklist/whitelist?
                // TODO: should come from the DB?
                _.each(json.data, function(d) {
                    // for now implemented just the whitelist from config file
                    if ( browseWhiteList.indexOf(d.code) > -1) {
                        d.addBrowse = true;
                    }
                });

                var t = Handlebars.compile(templateDomains);
                //self.$DOMAINS.hide().html(t(json)).slideDown(1000);
                self.$DOMAINS.html(t(json));

                // add listeners on domains
                self.$DOMAINS.find(s.GO_TO_BROWSE).on('click', function(e) {

                    var section = ROUTE.BROWSE_BY_DOMAIN_CODE,
                        //code = $(e.target).data("code");
                        code = this.getAttribute('data-code');

                    log.info(section, code, e)

                    self.changeState(
                        {
                            section:section,
                            code: code
                        }
                    );

                });

                self.$DOMAINS.find(s.GO_TO_DOWNLOAD).on('click', function(e) {

                    var section = ROUTE.DOWNLOAD_WELCOME,
                    //code = $(e.target).data("code");
                        code = this.getAttribute('data-code');

                    self.changeState(
                        {
                            section:section,
                            code: code
                        }
                    );
                });

            });

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

            amplify.publish(E.LOADING_HIDE, {container: this.$WHATS_NEW});

            /* this.api.whatsNew({}).then(function() {

            }); */

            var t = Handlebars.compile(templateNews);
            this.$WHATS_NEW.append(t(WhatsNew));

        },

        initComingUp: function () {

            amplify.publish(E.LOADING_SHOW, {container: this.$COMING_UP});

            amplify.publish(E.LOADING_HIDE, {container: this.$COMING_UP});

            /* this.api.comingUp({}).then(function() {

             }); */

            var t = Handlebars.compile(templateNews);
            this.$COMING_UP.append(t(ComingUp));

        },

        initDatabaseUpdates: function () {

        },

        bindEventListeners: function () {

        },

        unbindEventListeners: function () {

        },

        changeState: function (data) {

            var section = data.section,
                code = data.code;

            log.info(section, code);

            Common.changeURL(section, (code) ? [code] : [], true);

        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);

        }
    });

    return HomeView;

});
