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
    'require',
    'amplify',
    'bootstrap',
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
             _s,
             Require) {

    'use strict';

    var s = {
            DATABASE_UPDATES: "#fs_home_database_updates",
            RELEASE_CALENDAR: "#fs_home_release_calendar",
            COUNTRY_PROFILES: "#fs_home_country_profiles",
            TWITTER: "fs_home_twitter",
            FAOSTAT_BULK_ZIP: '[data-role="bulk_download"]',
            FAOSTAT_BULK_DATE: '[data-role="bulk_download_date"]',
            FAOSTAT_BULK_SIZE: '[data-role="bulk_download_size"]',
            EXTERNAL_LINK: "[data-link='external']"
        },

        defaults = {},

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
                    locale: Common.getLocale(),
                    // direction of html
                    direction: C.direction
                });

                return d;

            },

            attach: function () {

                View.prototype.attach.call(this, arguments);

                this.$el.find("img.lazy").lazyload({
                    threshold: 50,
                    effect: "fadeIn"
                });

                //update State
                amplify.publish(E.STATE_CHANGE, {home: 'home'});

                this.initVariables();

                this.bindEventListeners();

                this.configurePage();
            },

            initVariables: function () {

                this.o = $.extend({}, defaults);

                this.$DATABASE_UPDATES = this.$el.find(s.DATABASE_UPDATES);
                this.$FAOSTAT_BULK_ZIP = this.$el.find(s.FAOSTAT_BULK_ZIP);
                this.$FAOSTAT_BULK_DATE = this.$el.find(s.FAOSTAT_BULK_DATE);
                this.$FAOSTAT_BULK_SIZE = this.$el.find(s.FAOSTAT_BULK_SIZE);
                this.$EXTERNAL_LINK = this.$el.find(s.EXTERNAL_LINK);

            },

            configurePage: function () {

                this.initDatabaseUpdates();

                this.initTwitter();

                this.initBulkDownload();

            },

            initDatabaseUpdates: function () {

                var self = this,
                    t = Handlebars.compile(templateDatabaseUpdates);

                amplify.publish(E.LOADING_SHOW, {container: self.$DATABASE_UPDATES});

                API.groupsanddomains().then(function (d) {

                    self.$DATABASE_UPDATES.html(t(self._prepareDatabaseUpdates(d)));

                    self.o.database_updates = new Swiper('.swiper-container-updates', {
                        scrollbar: '.swiper-scrollbar',
                        direction: 'vertical',
                        slidesPerView: 'auto',
                        mousewheelControl: true,
                        freeMode: true
                    });

                    // add analytics
                    self.$DATABASE_UPDATES.find('a').on('click', function () {

                        amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                            $.extend({}, A.home.database_updates, {
                                label: $(this).attr('href')
                            })
                        );

                    });

                }).fail(function (e) {

                    // TODO: Handle error
                    log.error("Home.initDatabaseUpdates; error", e);
                    amplify.publish(E.LOADING_HIDE, {container: self.$DATABASE_UPDATES});
                    amplify.publish(E.CONNECTION_PROBLEM, {});

                });

            },

            _prepareDatabaseUpdates: function (d) {

                var sortedDomains = [],
                    databaseUpdates = [];

                _.each(d.data, function (domain) {

                    // clean date for firefox
                    //http://stackoverflow.com/questions/3257460/new-date-is-working-in-chrome-but-not-firefox
                    domain.date_update = _s.strLeft(_s.replaceAll(domain.date_update, '-', '/'), ".");
                    domain.date_update = new Date(domain.date_update);
                    sortedDomains.push(domain);

                });

                // order by date
                sortedDomains = _.sortBy(sortedDomains, function (o) {
                    return -o.date_update.getTime();
                });

                //log.info("Home.initDatabaseUpdates; sortedDomains", sortedDomains);

                _.each(sortedDomains, function (domain, index) {

                    // if (index < CM.MAX_DATABASE_UPDATES) {

                    var d = $.extend(true, {}, domain),
                        m = moment(domain.date_update),
                        //date_update =  m.format("MMMM DD, YYYY");
                        date_update = m.format("LL");

                    d.title = d.domain_name + " (" + d.group_name + ")";
                    d.date_update = date_update;
                    d.url = '#' + Common.getURI(ROUTE.DOWNLOAD_INTERACTIVE, [d.domain_code]);

                    databaseUpdates.push(d);

                    // }

                });

                return databaseUpdates;

            },

            initTwitter: function () {

                var self = this;

                log.info(self.o.twitter);

                var $TWITTER = this.$el.find('#' + s.TWITTER);

                amplify.publish(E.LOADING_SHOW, {container: $TWITTER});

                setTimeout(function () {

                    Require(['twitter'],
                        function () {
                            twttr.widgets.createTimeline(
                                CM.twitter.id,
                                document.getElementById(s.TWITTER),
                                {
                                    height: CM.twitter.height[Common.getLocale()] || CM.twitter.height["en"],
                                    width: '100%',
                                    screenName: "FAOStatistics"
                                }
                            );

                            amplify.publish(E.LOADING_HIDE, {container: $TWITTER});

                        },
                        function (e) {
                            log.error("Twitter widget is unavailable.", e);
                            amplify.publish(E.LOADING_HIDE, {container: $TWITTER});
                            $TWITTER.html('Twitter Timeline is unavailable.');
                        });

                }, 500);
            },

            initBulkDownload: function () {

                var self = this;

                API.bulkdownloads({
                    domain_code: '0'
                }).then(function (d) {

                    var data = d.data[0],
                        size = Math.round(data.FileSize * 0.001),
                        mu = "MB", //data.FileSizeUnit,
                        m = moment(data.CreatedDate),
                        date = m.format("ll"),
                        url = data.URL;

                    self.$FAOSTAT_BULK_SIZE.html(size + " " + mu);
                    self.$FAOSTAT_BULK_DATE.html(date);
                    self.$FAOSTAT_BULK_ZIP.data('url', url);

                }).fail(function (e) {
                    log.error("Home.initBulkDownload; error", e);
                });

            },

            bindEventListeners: function () {

                this.$FAOSTAT_BULK_ZIP.off();
                this.$FAOSTAT_BULK_ZIP.on('click', function () {

                    amplify.publish(E.GOOGLE_ANALYTICS_EVENT, A.site.faostat_bulk_downloads_zip);

                    window.open($(this).data('url'));

                });

                this.$EXTERNAL_LINK.off();
                this.$EXTERNAL_LINK.on('click', function (e) {

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
