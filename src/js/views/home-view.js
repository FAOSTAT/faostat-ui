/*global define, _:false, $, console, amplify, FM, twttr*/
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'globals/Common',
    'config/Analytics',
    'config/Routes',
    'config/Config',
    'config/Events',
    'config/home/Config',
    'text!templates/home/home.hbs',
    // 'text!templates/home/news.hbs',
    'text!templates/home/domains.hbs',
    'text!templates/home/database_updates.hbs',
    'i18n!nls/home',
    'handlebars',
    'faostatapiclient',
   // 'fx-c-c/start',
    //'config/browse_by_domain/Config',
    /*'config/home/sample/chartModel',
     'config/home/sample/whatsNew',
     'config/home/sample/comingUp',
     'config/home/sample/databaseUpdates',*/
    'moment',
    'underscore.string',
    'amplify',
    'bootstrap',
    'twitter',
    'swiper',
    'jquery.lazyload'
], function ($, log,
             View,
             Common,
             A, ROUTE, C, E, CM,
             template,
             // templateNews,
             templateDomains,
             templateDatabaseUpdates,
             i18nLabels, Handlebars, API,
             //ChartCreator,
             //BrowseByDomainConfig,
             /* ChartModel,
              WhatsNew,
              ComingUp,
              DatabaseUpdates,*/
             moment,
             _s
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
            COUNTRY_PROFILES: "#fs_home_country_profiles",
            TWITTER: "fs_home_twitter",
            TERRITORIAL_NOTES: '#territorial_notes',
            FAOSTAT_BULK_ZIP: '[data-role="bulk_download"]'

        },
        HomeView = View.extend({

            autoRender: true,

            className: 'home',

            template: template,

            getTemplateData: function () {

                // ADD links
                // TODO: helper?
                var d = $.extend(true, {}, i18nLabels, {
                    URL_FAOSTAT_DATABASE_ZIP: C.URL_FAOSTAT_DATABASE_ZIP,
                    URL_COUNTRY_PROFILES: C.URL_COUNTRY_PROFILES,
                    URL_BROWSE_BY_COUNTRY: '#' + Common.getURI(ROUTE.BROWSE_BY_COUNTRY),
                    URL_BROWSE_RANKINGS: '#' + Common.getURI(ROUTE.BROWSE_RANKINGS_CODE, ['commodities_by_country']),
                    URL_RELEASE_CALENDAR: C.URL_RELEASE_CALENDAR,
                    EMAIL_FAO_STATISTICS: C.EMAIL_FAO_STATISTICS,
                    TELEPHONE_FAO_STATISTICS: C.TELEPHONE_FAO_STATISTICS,
                    URL_DATA: '#' + Common.getURI(ROUTE.DATA),
                    locale: Common.getLocale()
                });

                return d;

            },

            attach: function () {

                View.prototype.attach.call(this, arguments);

                this.$el.find("img.lazy").lazyload({
                    threshold: 50,
                    effect : "fadeIn"
                });

                //update State
                amplify.publish(E.STATE_CHANGE, {home: 'home'});

                this.initVariables();

                this.bindEventListeners();

                this.configurePage();
            },

            initVariables: function () {

                this.$DOMAINS = this.$el.find(s.DOMAINS);
                this.$WHATS_NEW = this.$el.find(s.WHATS_NEW);
                this.$COMING_UP = this.$el.find(s.COMING_UP);
                this.$DATABASE_UPDATES = this.$el.find(s.DATABASE_UPDATES);
                this.$FAOSTAT_BULK_ZIP = this.$el.find(s.FAOSTAT_BULK_ZIP);

/*                this.$INFO = this.$el.find(s.INFO);
                this.$FAO_LINKS = this.$el.find(s.FAO_LINKS);
                this.$PARTNERS = this.$el.find(s.PARTNERS);
                this.$RELEASE_CALENDAR = this.$el.find(s.RELEASE_CALENDAR);
                this.$COUNTRY_PROFILES = this.$el.find(s.COUNTRY_PROFILES);
                this.$CHART1 = this.$el.find(s.CHART + "1");
                this.$CHART2 = this.$el.find(s.CHART + "2");
                this.$CHART3 = this.$el.find(s.CHART + "3");
                this.$CHART4 = this.$el.find(s.CHART + "4");*/

                this.api = new API();

                this.o = {};
                this.o.lang = Common.getLocale();

            },

            configurePage: function () {

                this.initSlideShow();

                this.initDatabaseUpdates();

                this.initTwitter();

                //this.initBulkDownload();

                //this.initCountryTerritorialNotes();

                //this.initDomains();

                //this.initChart();

                //this.initWhatsNew();

                //this.initComingUp();


            },

            initSlideShow: function() {

                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    preventLinks: false,
                    preventLinksPropagation: false,
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                    parallax: true,
                    autoplay: 5000,
                    speed: 600
                });

            },

            initDomains: function () {

                var self = this;

                amplify.publish(E.LOADING_SHOW, {container: self.$DOMAINS});

                this.api.groupsanddomains({
                    dataosource: C.DATASOURCE,
                    lang: this.o.lang
                }).then(function(json) {

                    var groups = _.chain(json.data)
                        .uniq(function(d) {
                            return d.group_code;
                        })
                        .value();

                    var v = _.chain(json.data).pluck('group_code').unique().value();

                    var t = Handlebars.compile(templateDomains);
                    //self.$DOMAINS.hide().html(t(json)).slideDown(1000);
                    self.$DOMAINS.html(t(
                        {
                            groups: groups,
                            download: i18nLabels.download,
                            browse: i18nLabels.browse
                        }));

                    // add listeners on domains
                    self.$DOMAINS.find(s.GO_TO_BROWSE).on('click', function(e) {

                        e.preventDefault();

                        var section = ROUTE.BROWSE_BY_DOMAIN_CODE,
                        //code = $(e.target).data("code");
                            code = this.getAttribute('data-code');

                        self.changeState({
                            section:section,
                            code: code
                        });

                    });

                    self.$DOMAINS.find(s.GO_TO_DOWNLOAD).on('click', function(e) {

                        e.preventDefault();

                        var section = ROUTE.DOWNLOAD_ABOUT,
                        //code = $(e.target).data("code");
                            code = this.getAttribute('data-code');

                        self.changeState({
                            section:section,
                            code: code
                        });

                    });

                }).fail(function(e) {

                    // TODO: Handle error
                    log.error("Home.initDomains; error", e);

                    amplify.publish(E.LOADING_HIDE, {container: self.$DOMAINS});
                    amplify.publish(E.CONNECTION_PROBLEM, {});

                });

            },

            initChart: function () {

                var self = this,
                    c = new ChartCreator();

                amplify.publish(E.LOADING_SHOW, {container: self.$CHART1});

                this.api.databean($.extend(true, {}, ChartModel.filter, {
                    lang: this.o.lang,
                    datasource: C.DATASOURCE
                })).then(function(d) {

                    amplify.publish(E.LOADING_HIDE, {container: self.$CHART1});

                    c.init($.extend(true, {}, CM.chart, {model: d})).then(function (c) {

                        c.render($.extend(true, {}, CM.chart, {container: self.$CHART1}));
                        c.render($.extend(true, {}, CM.chart, {container: self.$CHART2}));
                        c.render($.extend(true, {}, CM.chart, {container: self.$CHART3}));
                        c.render($.extend(true, {}, CM.chart, {container: self.$CHART4}));

                    });


                }).fail(function(e) {

                    // TODO: Handle error
                    log.error("Home.initChart; error", e);
                    //amplify.publish(E.NOTIFICATION_WARNING, {title: "Error Connection", text: "We are expecting connection problems"});
                    amplify.publish(E.LOADING_HIDE, {container: self.$CHART1});
                    amplify.publish(E.CONNECTION_PROBLEM, {});

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

                var self = this,
                    t = Handlebars.compile(templateDatabaseUpdates);

                amplify.publish(E.LOADING_SHOW, {container: self.$DATABASE_UPDATES});

                this.api.groupsanddomains({
                    lang: this.o.lang,
                    datasource: C.DATASOURCE
                }).then(function(d) {

                    var sortedDomains = [],
                        databaseUpdates = [];

                    _.each(d.data, function(domain) {

                        // clean date for firefox
                        //http://stackoverflow.com/questions/3257460/new-date-is-working-in-chrome-but-not-firefox
                        domain.date_update = _s.strLeft(_s.replaceAll(domain.date_update, '-', '/'), ".");

                        domain.date_update = new Date(domain.date_update);
                        sortedDomains.push(domain);
                    });

                    // order by date
                    sortedDomains = _.sortBy(sortedDomains, function(o){
                        return -o.date_update.getTime();
                    });

                    // parse 10 first domains
                    log.info("Home.initDatabaseUpdates; sortedDomains", sortedDomains);

                    moment.locale(Common.getLocale());

                    _.each(sortedDomains, function(domain, index) {

                        //log.info(domain, index);

                        if (index < CM.MAX_DATABASE_UPDATES) {

                            var m = moment(domain.date_update),
                                date =  m.format("MMM DD, YYYY");

                            domain.title = domain.domain_name + " ("+ domain.group_name + ")";
                            domain.date = date;
                            domain.url = '#' + Common.getURI(ROUTE.DOWNLOAD_INTERACTIVE, [domain.domain_code ]);

                            databaseUpdates.push(domain);

                        }

                    });

                    log.info("Home.initDatabaseUpdates; databaseUpdates", databaseUpdates);

                    self.$DATABASE_UPDATES.html(t(databaseUpdates));

                    self.$DATABASE_UPDATES.find(s.GO_TO_DOWNLOAD).off('click');
                    self.$DATABASE_UPDATES.find(s.GO_TO_DOWNLOAD).on('click', function(e) {

                        e.preventDefault();

                        var section = ROUTE.DOWNLOAD_ABOUT,
                            code = this.getAttribute('data-code');

                        log.info(this.getAttribute('data-code'));

                        self.changeState({
                            section:section,
                            code: code
                        });
                    });


                    var swiper = new Swiper('.swiper-container-updates', {
                        scrollbar: '.swiper-scrollbar',
                        direction: 'vertical',
                        slidesPerView: 'auto',
                        mousewheelControl: true,
                        freeMode: true
                    });


                }).fail(function(e) {

                    // TODO: Handle error
                    log.error("Home.initDatabaseUpdates; error", e);
                    amplify.publish(E.LOADING_HIDE, {container: self.$DATABASE_UPDATES});
                    amplify.publish(E.CONNECTION_PROBLEM, {});

                });

            },

            initTwitter: function() {

                amplify.publish(E.LOADING_SHOW, {container: document.getElementById(s.TWITTER)});

                setTimeout(function() {

                    amplify.publish(E.LOADING_HIDE, {container: document.getElementById(s.TWITTER)});

                    twttr.widgets.createTimeline(
                        "700247798168551424",
                        document.getElementById(s.TWITTER),
                        {
                            height: 550,
                            screenName: "FAOStatistics"
                        }
                    );

                }, 1000);
            },

            bindEventListeners: function () {

                this.$FAOSTAT_BULK_ZIP.on('click', function() {
                    amplify.publish(E.GOOGLE_ANALYTICS_EVENT, A.site.faostat_bulk_downloads_zip);
                });


                // territorial notes
                /*this.$TERRITORIAL_NOTES.on('click', function(e) {

                    e.preventDefault();

                    amplify.publish(E.NOTIFICATION_INFO, {
                        title: i18nLabels.territorial_notes,
                        text: i18nLabels.territorial_notes_info
                    });
                });*/

            },

            unbindEventListeners: function () {

                if (this.$FAOSTAT_BULK_ZIP) {
                    this.$FAOSTAT_BULK_ZIP.off('click');
                }

                if (this.$DATABASE_UPDATES) {
                    this.$DATABASE_UPDATES.find(s.GO_TO_DOWNLOAD).off();
                }
                //this.$TERRITORIAL_NOTES.off('click');

            },

            changeState: function (data) {

                var section = data.section,
                    code = data.code;

                log.info(section, code);

                Common.changeURL(section, code? [code] : [], true);

            },

            dispose: function () {

                this.unbindEventListeners();

                View.prototype.dispose.call(this, arguments);

            }
        });

    return HomeView;

});
