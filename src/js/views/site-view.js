/*global define, amplify, document, window, escape, setTimeout */
define([
    'jquery',
    'loglevel',
    'config/Config',
    'config/Events',
    'config/Analytics',
    'config/Routes',
    'views/base/view',
    'i18n!nls/site',
    'text!templates/site.hbs',
    'FAOSTAT_UI_MENU',
    'lib/common/waiting',
    'lib/common/loading',
    'globals/Common',
    // TODO: move analytics in another section?
    'globals/GoogleAnalyticsManager',
    'globals/Export',
    'lib/search/search-box',
    'fs-m-v/start',
    'lib/common/modal',
    'toastr',
    'jquery.visible',
    'jquery.lazyload'
], function ($,
             log,
             C,
             E,
             A,
             ROUTES,
             View,
             i18nLabels,
             template,
             FAOSTATMenu,
             Waiting,
             Loading,
             Common,
             GoogleAnalyticsManager,
             Export, SearchBox,
             MetadataViewer,
             Modal,
             toastr
) {

    'use strict';

    var s = {
        
        FEEDBACK_SYSTEM: '#feedback-system',
        LANGUAGE: '#fs-language',
        SEARCH: '[data-role="fs-search"]',
        GOOGLE_FORM: '[data-role="google-form"]',

        TOP_MENU_CONTAINER: '#top-menu-container',
        BREADCRUMB_CONTAINER: "#breadcrumb-container",
        FOOTER_MENU_CONTAINER: "#footer-menu-container",
        LANG: "#footer-menu-container",

        JIRA_COLLECTOR: "#jiraFaostatCollector",
        JIRA_LOGIN: "#jiraLogin",

        EXTERNAL_LINK: '[data-link="external"]'

    }, 
        
    SiteView = View.extend({

        container: 'body',

        containerMethod: 'html',

        id: 'site-container',

        regions: {
            main: '#main-container'
        },

        template: template,

        getTemplateData: function () {
            // add lang
            return $.extend(true,
                {
                    locale: Common.getLocale()
                },
                C,
                i18nLabels);
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this.initComponents();

            this.bindEventListeners();

        },

        bindEventListeners: function () {

            var self = this;

            amplify.subscribe(E.STATE_CHANGE, this, this.onStateUpdate);
            amplify.subscribe(E.MENU_UPDATE, this, this.onMenuUpdate);

            amplify.subscribe(E.NOTIFICATION_INFO, this, this.onNotificationInfo);
            amplify.subscribe(E.NOTIFICATION_WARNING, this, this.onNotificationWarning);
            amplify.subscribe(E.NOTIFICATION_ERROR, this, this.onNotificationError);
            amplify.subscribe(E.NOTIFICATION_ACCEPT, this, this.onNotificationAccept);

            amplify.subscribe(E.WAITING_SHOW, this, Waiting.showPleaseWait);
            amplify.subscribe(E.WAITING_HIDE, this, Waiting.hidePleaseWait);

            amplify.subscribe(E.LOADING_SHOW, this, Loading.show);
            amplify.subscribe(E.LOADING_HIDE, this, Loading.hide);

            amplify.subscribe(E.GOOGLE_ANALYTICS_PAGE_VIEW, GoogleAnalyticsManager, GoogleAnalyticsManager.pageView);
            amplify.subscribe(E.GOOGLE_ANALYTICS_EVENT, GoogleAnalyticsManager, GoogleAnalyticsManager.event);

            amplify.subscribe(E.EXPORT_DATA, Export, Export.exportData);
            amplify.subscribe(E.EXPORT_TABLE_HTML, Export, Export.exportTable);
            amplify.subscribe(E.EXPORT_MATRIX_DATA, Export, Export.exportMatrix);

            amplify.subscribe(E.SEARCH_BOX_SHOW, this, this.showSearchBox);
            amplify.subscribe(E.SEARCH_BOX_HIDE, this, this.hideSearchBox);

            amplify.subscribe(E.METADATA_SHOW, this, this.showMetadata);
            //amplify.subscribe(E.GLOSSARY_SHOW, Modal, Modal.glossary);
            amplify.subscribe(E.DEFINITION_DOMAIN_SHOW, Modal, Modal.definitions_domain);

            amplify.subscribe(E.SCROLL_TO_SELECTOR, this, this.scrollTo);
            
            amplify.subscribe(E.CONNECTION_PROBLEM, this, this.connectionProblem);

            // publishing GA Events
            amplify.publish(E.GOOGLE_ANALYTICS_PAGE_VIEW);

            /* Switch Language */
            this.$el.find(s.LANGUAGE).find('a').on('click', function(e) {

                e.preventDefault();

                self.changeLanguage(this.getAttribute('data-locale'));

            });
            this.$el.find(s.LANGUAGE).find('[data-locale=' + Common.getLocale() + ']').addClass('active');

            // scrolling
            $(document).on( 'scroll', function(){

                if ($(window).scrollTop() > 100) {
                    $('.scroll-top-wrapper').addClass('show');
                } else {
                    $('.scroll-top-wrapper').removeClass('show');
                }
            });

            $('.scroll-top-wrapper').on('click', this.scrollToTop);

            this.$SEACH_BOX = this.$el.find(s.SEARCH);

            // tooltip
            $('[data-toggle="tooltip"]').tooltip();

            // disclaimer
            amplify.publish(E.NOTIFICATION_INFO, {
                title: "Disclaimer",
                text: "Please note that this is a beta version of the FAOSTAT website which is still undergoing final testing before its official release. The website, its software and all content found on it are provided on an “as is” and “as available” basis. FAO does not give any warranties, whether express or implied, as to the suitability or usability of the website, its software or any of its content. Under no circumstances shall FAO, or its affiliates, or any of their respective agents, employees, information providers or content providers be responsible or liable to any user or anyone else for any inaccuracy, error, omission, interruption, deletion, defect, alteration of or use of any content herein, or for its timeliness or completeness, nor shall they be liable for any failure of performance, computer virus or communication line failure, regardless of cause, or for damages of any kind arising out of use, reference to, or reliance on any information contained within the website. <br> Should you encounter any bugs, glitches, lack of functionality or other problems on the website, please let us know. Your help is greatly appreciated",
                options: {
                    "closeButton": true,
                    "debug": false,
                    "newestOnTop": false,
                    "progressBar": false,
                    "positionClass": "toast-bottom-full-width",
                    "preventDuplicates": true,
                    "onclick": null,
                    "showDuration": "300",
                    "hideDuration": "1000",
                    "timeOut": "null",
                    "extendedTimeOut": "1000",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut",
                    "closeMethod": 'fadeOut',
                    "closeDuration": 300,
                    "closeEasing": 'swing'
                }

            });

        },

        initComponents: function () {

            this.$GOOGLE_FORM = this.$el.find(s.GOOGLE_FORM);
            this.$JIRA_COLLECTOR = this.$el.find(s.JIRA_COLLECTOR);
            this.$JIRA_LOGIN = this.$el.find(s.JIRA_LOGIN);

            this.initMenu();
            this.initSearchBox();
            this.initLazyLoading();
            this.initGoogleFormAnalytics();
            this.trackExternalLinks();
           // this.initJIRACollector();
            this.initNotificationInitConfiguration();

            // init breadcrumb (N.B. not used)
            //this.$BREADCRUMB_CONTAINER = this.$el.find(s.BREADCRUMB_CONTAINER);
        },

        initMenu: function() {

            /* Initiate the menu. */
            this.menu = new FAOSTATMenu();
            // TODO: fix menu language and check how is it taken
            this.menu.init({
                lang: Common.getLocale(),
                datasource: C.DATASOURCE
            });

        },

        initSearchBox: function() {

            this.searchBox =  new SearchBox();
            this.searchBox.init({
                container: s.SEARCH,
                callback: {
                    searchQuery: function(q) {

                        // route to search page
                        Common.changeURL(ROUTES.SEARCH_QUERY, [encodeURIComponent(q)], true);

                    }
                }
            });

        },

        initLazyLoading: function() {

            var self = this;

            // workaround for lazy bottom images.
            // they are loaded delayed to avoid to be loaded on startup
            setTimeout(function() {
                self.$el.find("img.lazy-bottom").lazyload({
                    threshold: 800
                });
            }, 2000);

        },

        initGoogleFormAnalytics: function () {
            
            this.$GOOGLE_FORM.on('click', function() {
                amplify.publish(E.GOOGLE_ANALYTICS_EVENT, A.site.select_google_form);
            });

        },

        trackExternalLinks: function () {

            this.$EXTERNAL_LINK = this.$el.find(s.EXTERNAL_LINK);
            this.$EXTERNAL_LINK.off();
            this.$EXTERNAL_LINK.on('click', function(e) {

                var url = $(this).attr('href');

                amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                    $.extend({}, true,
                        A.external_link,
                        { label: url }
                    ));
            });

        },

        // JIRA Collector workaround
        initJIRACollector: function () {

            var allCookies = document.cookie;

            log.info(allCookies);

            // Get all the cookies pairs in an array
            var cookiearray = allCookies.split(';');

            // Now take key value pair out of this array
            for(var i=0; i<cookiearray.length; i++){
                var name = cookiearray[i].split('=')[0];
                var value = cookiearray[i].split('=')[1];
                log.info("Key is : " + name + " and Value is : " + value);
            }

            log.info("SiteView.initJIRACollector; init");

            var self = this;

            $.browser = 'msie';

           if (C.hasOwnProperty("JIRA_COLLECTOR") &&
               C.JIRA_COLLECTOR.hasOwnProperty("ENABLED") &&
               C.JIRA_COLLECTOR.ENABLED) {

               // load JIRA snippet
               this.$JIRA_COLLECTOR.show();

               this.jiraLoadSnippet();

               this.jiraEnableClick();

           }

        },

        jiraEnableClick: function() {

            log.info("SiteView.jiraEnableClick; enable click;");

            var self = this;

            this.$JIRA_COLLECTOR.off();
            this.$JIRA_COLLECTOR.on('click', function() {

                if ($('#atlwdg-container').length > 0) {

                    // rendered jira

                }
                else {

                    self.jiraLogin();

                }

                amplify.publish(E.GOOGLE_ANALYTICS_EVENT, A.site.select_jira_collector);

            });


        },

        jiraLoadSnippet: function() {

            log.info("SiteView.jiraLoadSnippet; load snippet");


            $.ajax({
                url: C.JIRA_COLLECTOR.URL,
                type: "get",
                cache: true,
                dataType: "script"
            });

        },

        jiraLogin: function() {

            log.info("SiteView.jiraLogin; load modal");

            var self = this;

            this.$JIRA_LOGIN.off();
            this.$JIRA_LOGIN.on('hidden.bs.modal', function () {

                self.$JIRA_COLLECTOR.off();

                setTimeout(function() {

                    self.jiraLoadSnippet();

                    self.jiraEnableClick();

                }, 3000);

            });

            this.$JIRA_LOGIN.modal('show');

        },

        scrollToTop: function() {

            var element = $('body'),
                offset = element.offset(),
                offsetTop = offset.top;

            $('html, body').animate({scrollTop: offsetTop}, 400, 'linear');

        },

        scrollTo: function(config) {

            var o = config || {},
                $container =  $(o.container),
                paddingTop = o.paddingTop || 15,
                animate = o.animate || true,
                animateTime = o.animateTime || 800,
                force = o.force || false,
                forceInvisible =  o.forceInvisible || false,
                scrollPos;


            if (o && $container) {

                // if not visible in the page (!$container.visible())
                if ((!$container.visible()) || force || forceInvisible) {

                    // if is not hidden ($container.is(':visible'))
                    if ($container.is(':visible') || forceInvisible) {

                        scrollPos = $(o.container).offset().top + (-paddingTop);

                        if (animate) {
                            //$(o.container).animate({"height": "47px", "padding-top": "25px"}, {duration: 10, easing: 'easeOutBounce'});

                            $('html, body').stop(animateTime).animate(
                                {
                                    scrollTop: scrollPos
                                },
                                animateTime
                            );

                            // TODO: this requires jquery-ui
                            /*$('html, body').animate(
                                {
                                    scrollTop: scrollPos
                                },{
                                    duration: animateTime,
                                    easing: 'easeInBounce',
                                   /* specialEasing: {
                                       // width: "linear",
                                        height: "easeInOutElastic"
                                    },*/
                                   /* complete: function() {}
                                }
                            );*/
/*
                            $('html, body').stop().animate({
                                'scrollTop': scrollPos
                            }, 1000, 'swing', function () {
                                //window.location.hash = target;
                            });*/

                        } else {
                            $(window).scrollTop(scrollPos);
                        }
                    }
                }
            }

        },

        connectionProblem: function(options) {

            // TODO: Handle connection problems
           amplify.publish(E.NOTIFICATION_WARNING,
               {
                   title: "Connection Problem",
                   text: "We are expecting connection problems. Sorry for the inconvenience."
               }
           );

        },

        onStateUpdate: function (s) {

            amplify.publish(E.MENU_UPDATE, Object.keys(s)[0]);

        },

        showSearchBox: function () {

            // initialize text
            this.searchBox.emptySearchBox();

            // show search box
            this.$SEACH_BOX.show();

        },

        hideSearchBox: function () {

            this.$SEACH_BOX.hide();

        },

        showMetadata: function (options) {

            if ( !options.hasOwnProperty('code')) {
                log.error('Code is not passed in the options', options);
            }
            else {

                var metadataViewer = new MetadataViewer($.extend(true, {},
                    {
                        modal: true,
                        addHeaders: false,
                        lang: Common.getLocale()
                    },
                    options)
                );

                metadataViewer.render();
            }

        },

        onMenuUpdate: function (s) {

            this.menu.select(s);
            this.menu.collapse();
            
        },

        // Notifications
        initNotificationInitConfiguration: function () {

            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": true,
                "progressBar": false,
                "positionClass": "toast-top-center",
                "preventDuplicates": true,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };

        },

        onNotificationInfo: function (data) {

            this.initNotificationInitConfiguration();

            if (data.hasOwnProperty('options')) {
                toastr.options = data.options;
            }

            toastr.info( '<h4>' + data.title + '</h4>', (data.text)? '<h5>' + data.text + '</h5>': '');

        },

        onNotificationWarning: function (data) {

            this.initNotificationInitConfiguration();

            if (data.hasOwnProperty('options')) {
                toastr.options = data.options;
            }

            toastr.warning( '<h4>' + data.title + '</h4>', (data.text)? '<h5>' + data.text + '</h5>': '');

        },

        onNotificationError: function (data) {

            this.initNotificationInitConfiguration();

            if (data.hasOwnProperty('options')) {
                toastr.options = data.options;
            }

            toastr.error( '<h4>' + data.title + '</h4>', (data.text)? '<h5>' + data.text + '</h5>': '');

        },

        onNotificationAccept: function (data, callback) {

        },

        changeLanguage: function(lang) {

            Common.changeURLLanguage(lang);

        }

    });

    return SiteView;
});
