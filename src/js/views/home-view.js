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
    'text!templates/home/database_updates.hbs',
    'i18n!nls/home',
    'handlebars',
    'faostatapiclient',
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
             templateDatabaseUpdates,
             i18nLabels, Handlebars,
             API,
             moment,
             _s
) {

    'use strict';

    var s = {

            DATABASE_UPDATES: "#fs_home_database_updates",
            RELEASE_CALENDAR: "#fs_home_release_calendar",
            PARTNERS: "#fs_home_partners",
            COUNTRY_PROFILES: "#fs_home_country_profiles",
            TWITTER: "fs_home_twitter",
            TERRITORIAL_NOTES: '#territorial_notes',
            FAOSTAT_BULK_ZIP: '[data-role="bulk_download"]',
            FAOSTAT_BULK_DATE: '[data-role="bulk_download_date"]',
            FAOSTAT_BULK_SIZE: '[data-role="bulk_download_size"]',
            EXTERNAL_LINK: "[data-link='external']"

            //DOMAINS: "#fs_home_domains",
            //GO_TO_BROWSE: '[data-role="go_to_browse"]',
            //GO_TO_DOWNLOAD: '[data-role="go_to_download"]',
           // CHART: "#fs_home_chart",

        },
        HomeView = View.extend({

            autoRender: true,

            className: 'home',

            template: template,

            getTemplateData: function () {

                // TODO select which labels to add
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

                this.o = {};

                this.$DATABASE_UPDATES = this.$el.find(s.DATABASE_UPDATES);
                this.$FAOSTAT_BULK_ZIP = this.$el.find(s.FAOSTAT_BULK_ZIP);
                this.$FAOSTAT_BULK_DATE = this.$el.find(s.FAOSTAT_BULK_DATE);
                this.$FAOSTAT_BULK_SIZE = this.$el.find(s.FAOSTAT_BULK_SIZE);
                this.$EXTERNAL_LINK = this.$el.find(s.EXTERNAL_LINK);


                //this.$DOMAINS = this.$el.find(s.DOMAINS);
                //this.$WHATS_NEW = this.$el.find(s.WHATS_NEW);
                //this.$COMING_UP = this.$el.find(s.COMING_UP);
                // this.$CHART1 = this.$el.find(s.CHART + "1");

            },

            configurePage: function () {

               // this.initSlideShow();

                this.initDatabaseUpdates();

                this.initTwitter();

                this.initBulkDownload();

                //this.initDomains();

                //this.initChart();

            },

           /* initSlideShow: function() {

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

            },*/

     /*       initDomains: function () {

                var self = this;

                amplify.publish(E.LOADING_SHOW, {container: self.$DOMAINS});

                API.groupsanddomains().then(function(json) {

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

            },*/

           /* initChart: function () {

                var self = this,
                    c = new ChartCreator();

                amplify.publish(E.LOADING_SHOW, {container: self.$CHART1});

                API.databean($.extend(true, {}, ChartModel.filter, {})).then(function(d) {

                    amplify.publish(E.LOADING_HIDE, {container: self.$CHART1});

                    c.init(
                        $.extend(true,
                            {},
                            CM.chart,
                        {
                            container: self.$CHART1,
                            model: d
                        }
                    )
                    ).then(function(creator) {
                        creator.render();
                        //creator.render(Utils.lineChartOptions(o));
                        //creator.render(Utils.columnChartOptions(o));
                        //creator.render(Utils.barChartOptions(o));
                    });




                    // c.init($.extend(true, {}, CM.chart, {model: d}, {container: self.$CHART1})).then(function (c) {
                    //
                    //     c.render();
                    //     // c.render($.extend(true, {}, CM.chart, {container: self.$CHART2}));
                    //     // c.render($.extend(true, {}, CM.chart, {container: self.$CHART3}));
                    //     // c.render($.extend(true, {}, CM.chart, {container: self.$CHART4}));
                    //
                    // });


                }).fail(function(e) {

                    // TODO: Handle error
                    log.error("Home.initChart; error", e);
                    //amplify.publish(E.NOTIFICATION_WARNING, {title: "Error Connection", text: "We are expecting connection problems"});
                    amplify.publish(E.LOADING_HIDE, {container: self.$CHART1});
                    amplify.publish(E.CONNECTION_PROBLEM, {});

                });

            },*/

            initDatabaseUpdates: function () {

                var self = this,
                    t = Handlebars.compile(templateDatabaseUpdates);

                amplify.publish(E.LOADING_SHOW, {container: self.$DATABASE_UPDATES});

                API.groupsanddomains().then(function(d) {

                    self.$DATABASE_UPDATES.html(t(self._prepareDatabaseUpdates(d)));

                    self.o.database_updates = new Swiper('.swiper-container-updates', {
                        scrollbar: '.swiper-scrollbar',
                        direction: 'vertical',
                        slidesPerView: 'auto',
                        mousewheelControl: true,
                        freeMode: true
                    });

                    // add analytics
                    self.$DATABASE_UPDATES.find('a').on('click', function() {

                        amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                            $.extend({}, A.home.database_updates, {
                                label: $(this).attr('href')
                            })
                        );

                    });

                }).fail(function(e) {

                    // TODO: Handle error
                    log.error("Home.initDatabaseUpdates; error", e);
                    amplify.publish(E.LOADING_HIDE, {container: self.$DATABASE_UPDATES});
                    amplify.publish(E.CONNECTION_PROBLEM, {});

                });

            },

            _prepareDatabaseUpdates: function(d) {

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

                //log.info("Home.initDatabaseUpdates; sortedDomains", sortedDomains);

                moment.locale(Common.getLocale());

                _.each(sortedDomains, function(domain, index) {

                    if (index < CM.MAX_DATABASE_UPDATES) {

                        var m = moment(domain.date_update),
                            date =  m.format("MMM DD, YYYY");

                        domain.title = domain.domain_name + " ("+ domain.group_name + ")";
                        domain.date = date;
                        domain.url = '#' + Common.getURI(ROUTE.DOWNLOAD_INTERACTIVE, [domain.domain_code ]);

                        databaseUpdates.push(domain);

                    }

                });

                return databaseUpdates;

            },

            initTwitter: function() {

                amplify.publish(E.LOADING_SHOW, {container: document.getElementById(s.TWITTER)});

                setTimeout(function() {

                    amplify.publish(E.LOADING_HIDE, {container: document.getElementById(s.TWITTER)});

                    twttr.widgets.createTimeline(
                        "700247798168551424",
                        document.getElementById(s.TWITTER),
                        {
                            height: 830,
                            width: '100%',
                            screenName: "FAOStatistics"
                        }
                    );

                }, 1000);
            },

            initBulkDownload: function() {

                //log.info("Home.initBulkDownload;");

                var self = this;

                API.bulkdownloads({
                    domain_code: '0'
                }).then(function(d) {

                    //log.info("Home.initBulkDownload;", d);

                    moment.locale(Common.getLocale());

                    var data = d.data[0],
                        size = Math.round(data.FileSize * 0.001),
                        mu = "MB", //data.FileSizeUnit,
                        m = moment(data.CreatedDate),
                        date =  m.format("MMMM DD, YYYY"),
                        url = data.URL;

                    self.$FAOSTAT_BULK_SIZE.html(size + " " + mu);
                    self.$FAOSTAT_BULK_DATE.html(date);
                    self.$FAOSTAT_BULK_ZIP.data('url', url);

                }).fail(function(e) {

                    log.error("Home.initBulkDownload; error", e);

                });

            },

            bindEventListeners: function () {

                this.$FAOSTAT_BULK_ZIP.off();
                this.$FAOSTAT_BULK_ZIP.on('click', function() {

                    amplify.publish(E.GOOGLE_ANALYTICS_EVENT, A.site.faostat_bulk_downloads_zip);

                    window.open($(this).data('url'));

                });

                this.$EXTERNAL_LINK.off();
                this.$EXTERNAL_LINK.on('click', function(e) {

                    var url = $(this).attr('href');

                    amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                        $.extend({}, true, A.external_link, {
                            label: url
                        })
                    );
                });

            },

            unbindEventListeners: function () {

                if (this.$FAOSTAT_BULK_ZIP) {
                    this.$FAOSTAT_BULK_ZIP.off('click');
                }

                if (this.$DATABASE_UPDATES) {
                    this.$DATABASE_UPDATES.find('a').off();
                }

            },

            dispose: function () {

                this.unbindEventListeners();

                // destroy swiper
                if (this.o.database_updates) {
                    this.o.database_updates.destroy();
                }

                this.$el.empty();

                View.prototype.dispose.call(this, arguments);

            }
        });

    return HomeView;

});
