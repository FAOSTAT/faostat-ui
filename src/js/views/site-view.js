/*global define, amplify, document, window, escape */
define([
    'jquery',
    'loglevel',
    'chaplin',
    'underscore',
    'config/Config',
    'config/Events',
    'config/Routes',
    'globals/State',
    'views/base/view',
    'globals/AuthManager',
    'i18n!nls/site',
    'text!templates/site.hbs',
    'FAOSTAT_UI_MENU',
    'lib/common/waiting',
    'lib/common/loading',
    'sweetAlert',
    'globals/Common',
    // TODO: move analytics in another section?
    'globals/GoogleAnalyticsManager',
    'globals/Export',
    'lib/search/search-box',
    'fs-m-v/start'
], function ($, log, Chaplin, _, C, E, ROUTES, State, View, AuthManager, i18nLabels, template, FAOSTATMenu, Waiting, Loading, swal, Common, GoogleAnalyticsManager, Export, SearchBox, MetadataViewer) {

    'use strict';

    var s = {

        TERRITORIAL_NOTES: '#territorial-notes',
        FEEDBACK_SYSTEM: '#feedback-system',
        LANGUAGES: '#fs-lang',
        SEARCH: '#fs-search',

        TOP_MENU_CONTAINER: '#top-menu-container',
        BREADCRUMB_CONTAINER: "#breadcrumb-container",
        FOOTER_MENU_CONTAINER: "#footer-menu-container",
        LANG: "#footer-menu-container"

    }, 
    SiteView = View.extend({

        container: 'body',

        id: 'site-container',

        regions: {
            main: '#main-container'
        },

        template: template,

        getTemplateData: function () {
            // add lang
            return $.extend(true, {locale: Common.getLocale()}, C, i18nLabels);
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
            amplify.subscribe(E.NOTIFICATION_ACCEPT, this, this.onNotificationAccept);

            amplify.subscribe(E.WAITING_SHOW, this, Waiting.showPleaseWait);
            amplify.subscribe(E.WAITING_HIDE, this, Waiting.hidePleaseWait);

            amplify.subscribe(E.LOADING_SHOW, this, Loading.show);
            amplify.subscribe(E.LOADING_HIDE, this, Loading.hide);

            amplify.subscribe(E.GOOGLE_ANALYTICS_PAGE_VIEW, GoogleAnalyticsManager.pageView);
            amplify.subscribe(E.GOOGLE_ANALYTICS_EVENT, GoogleAnalyticsManager.event);

            amplify.subscribe(E.EXPORT_DATA, Export, Export.exportData);
            amplify.subscribe(E.EXPORT_TABLE_HTML, Export, Export.exportTable);
            amplify.subscribe(E.EXPORT_MATRIX_DATA, Export, Export.exportMatrix);

            amplify.subscribe(E.SEARCH_BOX_SHOW, this, this.showSearchBox);
            amplify.subscribe(E.SEARCH_BOX_HIDE, this, this.hideSearchBox);

            amplify.subscribe(E.METADATA_SHOW, this, this.showMetadata);

            // publishing GA Events
            amplify.publish(E.GOOGLE_ANALYTICS_PAGE_VIEW);
            //amplify.publish(E.GOOGLE_ANALYTICS_EVENT, {});


            /* Switch Language */
            this.$el.find(s.LANGUAGES).find('a').on('click', function(e) {

                e.preventDefault();

                //log.info(this.getAttribute("data-locale"))

                self.changeLanguage(this.getAttribute("data-locale"));
            });

            // scrolling
            $(document).on( 'scroll', function(){

                if ($(window).scrollTop() > 100) {
                    $('.scroll-top-wrapper').addClass('show');
                } else {
                    $('.scroll-top-wrapper').removeClass('show');
                }
            });

            $('.scroll-top-wrapper').on('click', this.scrollToTop);

            // territorial notes
            this.$el.find(s.TERRITORIAL_NOTES).on('click', function(e) {

                e.preventDefault();

                amplify.publish(E.NOTIFICATION_INFO, {
                    title: i18nLabels.territorial_notes,
                    text: i18nLabels.territorial_notes_info
                });
            });

            // feedback system
            this.$el.find(s.FEEDBACK_SYSTEM).on('click', function(e) {

                e.preventDefault();

                log.warn('The feeback system opens in a popup in faostat3.fao.org');
                window.open(C.FEEDBACK_SYSTEM_URL, "_target=black");
            });

            this.$SEACH_BOX = this.$el.find(s.SEARCH);

        },

        initComponents: function () {

            this.initMenu();
            this.initSearchBox();

            // init breadcrumb (N.B. not used)
            this.$BREADCRUMB_CONTAINER = this.$el.find(s.BREADCRUMB_CONTAINER);

        },

        initMenu: function() {

            /* Initiate the menu. */
            this.menu = new FAOSTATMenu();
            // TODO: fix menu language and check how is it taken
            this.menu.init({
                lang: Common.getLocale(),
                //prefix: 'faostat_download_',
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
                        //Common.changeURL(ROUTES.SEARCH_QUERY, [encodeURI(q)], true);

                    }
                }
            });

        },

        scrollToTop: function() {

            var element = $('body'),
                offset = element.offset(),
                offsetTop = offset.top;

            $('html, body').animate({scrollTop: offsetTop}, 400, 'linear');

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

                var metadataViewer = new MetadataViewer();
                metadataViewer.init($.extend(true, {},
                        {
                            modal: true,
                            addHeaders: false,
                            lang: Common.getLocale(),
                            url_get_metadata: C.URL_METADATA_MODEL,
                            url_get_domain: C.URL_METADATA_DOMAIN
                        },
                        options)
                );
            }

        },

        onMenuUpdate: function (s) {

            this.menu.select(s);

        },

        // Notifications
        onNotificationInfo: function (data) {

            swal({
                title: data.title,
                type: 'info',
                text: data.text
            });

        },

        onNotificationWarning: function (data) {

            swal({
                title: data.title,
                type: 'warning',
                text: data.text
            });

        },

        onNotificationAccept: function (data, callback) {

            // TODO: implement it
/*            swal({
                    title: "An input!",
                    text: "Write something interesting:",
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    animation: "slide-from-top",
                    inputPlaceholder: "Write something"
                },
                function(inputValue){
                    if (inputValue === false)
                        return false;
                    if (inputValue === "") {
                        swal.showInputError("You need to write something!");
                        return false;
                    }
                    swal("Nice!", "You wrote: " + inputValue, "success");
                });*/
        },

        changeLanguage: function(lang) {

            Common.changeURLLanguage(lang);

        }

    });

    return SiteView;
});
