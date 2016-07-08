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
        LANG: "#footer-menu-container"

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
            amplify.subscribe(E.GLOSSARY_SHOW, Modal, Modal.glossary);

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
            $('[data-toggle="tooltip"]').tooltip()

        },

        initComponents: function () {

            this.$GOOGLE_FORM = this.$el.find(s.GOOGLE_FORM);

            this.initMenu();
            this.initSearchBox();
            this.initLazyLoading();
            this.initGoogleFormAnalytics();
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

            toastr.info( '<h4>' + data.title + '</h4>', (data.text)? '<h5>' + data.text + '</h5>': '');

        },

        onNotificationWarning: function (data) {

            toastr.warning( '<h4>' + data.title + '</h4>', (data.text)? '<h5>' + data.text + '</h5>': '');

        },

        onNotificationError: function (data) {

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
