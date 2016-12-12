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
    'globals/GoogleAnalyticsManager',
    'globals/Export',
    'lib/search/search-box',
    'lib/common/modal',
    'toastr',
    'jquery.visible',
    'jquery.lazyload',
    'bootstrap'
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
             Modal,
             toastr
) {

    'use strict';

    var s = {

        LANGUAGE: '#fs-language',
        SEARCH: '[data-role="fs-search"]',
        GOOGLE_FORM: '[data-role="google-form"]',
        FEEDBACK_SYSTEM: '[data-role="feedback-system"]',

        TOP_MENU_CONTAINER: '#top-menu-container',
        BREADCRUMB_CONTAINER: "#breadcrumb-container",
        FOOTER_MENU_CONTAINER: "#footer-menu-container",
        LANG: "#footer-menu-container",
        SCROLL_TOP: '[data-role="scroll-top"]',
        MENU: '#fs-menu',

        JIRA_COLLECTOR: "#jiraFaostatCollector",
        JIRA_LOGIN: "#jiraLogin",

        EXTERNAL_LINK: '[data-link="external"]'

    },

    defaultOptions = {

        toastr: {
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
        }

    },
        
    SiteView = View.extend({

        container: 'body',

        containerMethod: 'append',

        id: 'site-container',

        regions: {
            main: '#main-container'
        },

        template: template,

        getTemplateData: function () {
            return $.extend(true,
                i18nLabels,
                {
                    locale: Common.getLocale(),
                    URL_FEEDBACK_SYSTEM: C.URL_FEEDBACK_SYSTEM,
                    direction: C.direction,
                    ALL_LANGUAGES: C.ALL_LANGUAGES || false
                }
            );
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

            amplify.subscribe(E.METADATA_SHOW, Modal, Modal.showMetadata);
            amplify.subscribe(E.DEFINITION_DOMAIN_SHOW, Modal, Modal.definitions_domain);

            amplify.subscribe(E.SCROLL_TO_SELECTOR, this, this.scrollTo);
            
            amplify.subscribe(E.CONNECTION_PROBLEM, this, this.connectionProblem);

            // publishing GA events
            //amplify.publish(E.GOOGLE_ANALYTICS_PAGE_VIEW);

            // switch language
            this.$el.find(s.LANGUAGE).find('a').on('click', function(e) {

                e.preventDefault();

                self.changeLanguage(this.getAttribute('data-locale'));

            });
            this.$el.find(s.LANGUAGE).find('[data-locale=' + Common.getLocale() + ']').addClass('active');

            this.$SEACH_BOX = this.$el.find(s.SEARCH);

            // disclaimer
            /*amplify.publish(E.NOTIFICATION_INFO, {
                title: "Disclaimer",
                text: "Please note that this is a beta version of the FAOSTAT website which is still undergoing final testing before its official release. The website, its software and all content found on it are provided on an “as is” and “as available” basis. FAO does not give any warranties, whether express or implied, as to the suitability or usability of the website, its software or any of its content. Under no circumstances shall FAO, or its affiliates, or any of their respective agents, employees, information providers or content providers be responsible or liable to any user or anyone else for any inaccuracy, error, omission, interruption, deletion, defect, alteration of or use of any content herein, or for its timeliness or completeness, nor shall they be liable for any failure of performance, computer virus or communication line failure, regardless of cause, or for damages of any kind arising out of use, reference to, or reliance on any information contained within the website. <br> Should you encounter any bugs, glitches, lack of functionality or other problems on the website, please let us know. Your help is greatly appreciated",
                options: {
                     "positionClass": "toast-bottom-full-width"
                 }
            });*/

        },

        initComponents: function () {

            this.$GOOGLE_FORM = this.$el.find(s.GOOGLE_FORM);
            this.$FEEDBACK_SYSTEM = this.$el.find(s.FEEDBACK_SYSTEM);
            this.$JIRA_COLLECTOR = this.$el.find(s.JIRA_COLLECTOR);
            this.$JIRA_LOGIN = this.$el.find(s.JIRA_LOGIN);
            this.$SCROLL_TO_TOP = this.$el.find(s.SCROLL_TOP);

            this.initMenu();
            this.initSearchBox();
            this.initLazyLoading();
            this.initScrollToTop();
            this.initGoogleFormAnalytics();
            this.initFeedbackSystem();
            this.trackExternalLinks();
           // this.initJIRACollector();

            // init breadcrumb
            //this.$BREADCRUMB_CONTAINER = this.$el.find(s.BREADCRUMB_CONTAINER);

        },

        initMenu: function() {

            /* Initiate the menu. */
            this.menu = new FAOSTATMenu();
            // TODO: fix menu language and check how is it taken
            this.menu.init({
                container: s.MENU
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

        initScrollToTop: function() {

            $(document).on( 'scroll', function(){
                if ($(window).scrollTop() > 900) {
                    $('.scroll-top-wrapper').addClass('show');
                } else {
                    $('.scroll-top-wrapper').removeClass('show');
                }
            });

            this.$SCROLL_TO_TOP.on('click', this.scrollToTop)

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

            // tooltip
            this.$GOOGLE_FORM.tooltip('destroy');
            this.$GOOGLE_FORM.tooltip({
                container: 'body'
            });

        },

        initFeedbackSystem: function () {

            this.$FEEDBACK_SYSTEM.on('click', function() {
                amplify.publish(E.GOOGLE_ANALYTICS_EVENT, A.site.select_feedback_system);
            });

            // tooltip
            this.$FEEDBACK_SYSTEM.tooltip('destroy');
            this.$FEEDBACK_SYSTEM.tooltip({
                container: 'body'
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

                            $('html, body').stop(animateTime).animate(
                                {
                                    scrollTop: scrollPos
                                },
                                animateTime
                            );

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

        onMenuUpdate: function (s) {

            this.menu.select(s);
            this.menu.collapse();
            
        },

        // Notifications
        onNotificationInfo: function (data) {

            toastr.options = $.extend(true, {}, defaultOptions.toastr, data.options);
            toastr.info(data.text? data.text: '', data.title);

        },

        onNotificationWarning: function (data) {

            toastr.options = $.extend(true, {}, defaultOptions.toastr, data.options);
            toastr.warning(data.text? data.text: '', data.title)

        },

        onNotificationError: function (data) {

            toastr.options = $.extend(true, {}, defaultOptions.toastr, data.options);
            toastr.error(data.text? data.text: '', data.title)

        },

        onNotificationAccept: function (data, callback) {

        },

        changeLanguage: function(lang) {

            amplify.publish(E.GOOGLE_ANALYTICS_EVENT, $.extend(true, {}, A.site.change_language, {
                action: lang
            }));

            Common.changeURLLanguage(lang);

        }

    });

    return SiteView;
});
