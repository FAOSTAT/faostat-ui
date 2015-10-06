/*global define, amplify*/
define([
    'jquery',
    'chaplin',
    'underscore',
    'config/Config',
    'config/Events',
    'globals/State',
    'views/base/view',
    'globals/AuthManager',
    'i18n!nls/site',
    'text!templates/site.hbs',
    'FAOSTAT_UI_MENU',
    'lib/common/waiting',
    'sweetAlert',
    'globals/Common',
    // TODO: move analytics in another section?
    'globals/GoogleAnalyticsManager'
], function ($, Chaplin, _, C, E, State, View, AuthManager, i18nLabels, template, FAOSTATMenu, Waiting, swal, Common, GoogleAnalyticsManager) {

    'use strict';

    var s = {
        TOP_MENU_CONTAINER: '#top-menu-container',
        BREADCRUMB_CONTAINER: "#breadcrumb-container",
        FOOTER_MENU_CONTAINER: "#footer-menu-container",
        LANG: "#footer-menu-container"
    };

    var SiteView = View.extend({

        container: 'body',

        id: 'site-container',

        regions: {
            main: '#main-container'
        },

        template: template,

        getTemplateData: function () {
            return $.extend(true, {}, C, i18nLabels);
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this.bindEventListeners();

            this.initComponents();
        },

        bindEventListeners: function () {

            var self = this;

            amplify.subscribe(E.STATE_CHANGE, this, this.onStateUpdate);
            amplify.subscribe(E.NOTIFICATION_WARNING, this, this.onNotificationWarning);
            amplify.subscribe(E.NOTIFICATION_ACCEPT, this, this.onNotificationAccept);
            amplify.subscribe(E.WAITING_SHOW, this, Waiting.showPleaseWait);
            amplify.subscribe(E.WAITING_HIDE, this, Waiting.hidePleaseWait);

            amplify.subscribe(E.GOOGLE_ANALYTICS_PAGE_VIEW, GoogleAnalyticsManager.pageView);
            amplify.subscribe(E.GOOGLE_ANALYTICS_EVENT, GoogleAnalyticsManager.event);


            /* Switch Language */
            this.$el.find('.fs-languages').find('a').click(function(e) {
                console.log(this.getAttribute("data-locale"))
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

        },

        initComponents: function () {

            var self = this,
                menuConf = {

                    url: C.TOP_MENU_CONFIG,

                    template: C.TOP_MENU_TEMPLATE,

                    //active: State.menu,
                    container: s.TOP_MENU_CONTAINER,
                    callback: _.bind(this.onMenuRendered, this),
                    breadcrumb: {
                        active: C.TOP_MENU_SHOW_BREADCRUMB,
                        container: s.BREADCRUMB_CONTAINER,
                        showHome: C.TOP_MENU_SHOW_BREADCRUMB_HOME
                    },
                    footer: {
                        active: C.TOP_MENU_SHOW_FOOTER,
                        container: s.FOOTER_MENU_CONTAINER
                    }
                },
                menuConfAuth = _.extend({}, menuConf, {
                    hiddens: C.TOP_MENU_AUTH_MODE_HIDDEN_ITEMS
                }),
                menuConfPub = _.extend({}, menuConf, {
                    hiddens: C.TOP_MENU_PUBLIC_MODE_HIDDEN_ITEMS
                });

            this.authManager = AuthManager.init({
                onLogin: _.bind(function () {
                    self.topMenu.refresh(menuConfAuth);
                }, this),
                onLogout: _.bind(function () {
                    Chaplin.mediator.publish(E.NOT_AUTHORIZED);
                    self.topMenu.refresh(menuConfPub);
                }, this)
            });

            //Top Menu
            //this.topMenu = new Menu(this.authManager.isLogged() ? menuConfAuth : menuConfPub);

            /* FAOSTAT menu. */
            /* Initiate the menu. */
            var menu = new FAOSTATMenu();
            // TODO: fix menu language and check how is it taken
            menu.init({
                lang: 'en',
                prefix: 'faostat_download_',
                datasource: 'faostatdb'
            });

        },

        scrollToTop: function() {
            var verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
            var element = $('body');
            var offset = element.offset();
            var offsetTop = offset.top;
            $('html, body').animate({scrollTop: offsetTop}, 400, 'linear');
        },

        onMenuRendered: function () {

            this.onMenuUpdate();

            amplify.subscribe(E.MENU_UPDATE, this, this.onMenuUpdate);
        },

        onStateUpdate: function (s) {

            console.log(s);

            State = $.extend(true, State, s);

            amplify.publish(E.MENU_UPDATE);

        },

        onMenuUpdate: function () {

            this.topMenu.select(State.menu);
        },


        // Notifications

        onNotificationWarning: function (data) {

            swal({
                title: data.title,
                type: 'warning',
                text: data.text
            });

        },

        onNotificationAccept: function (data, callback) {

            swal({
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
                });
        },

        changeLanguage: function(lang) {
            // TODO: Check if english is used

            Common.changeURLLanguage(lang);

           /*
            Common.setLocale(lang);
           var uri = Common.updateQueryStringParameter(window.location.href, 'locale', Common.getLocale());

            // TODO: rewrite. dirty change url
            window.location.replace(uri);
            window.location.reload();*/
            //window.open(uri, '_self')
        }


    });

    return SiteView;
});
