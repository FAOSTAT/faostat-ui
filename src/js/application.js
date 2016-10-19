/*global define, amplify*/
define([
    'jquery',
    'loglevel',
    'chaplin',
    'config/Config',
    'config/Events',
    'globals/Common',
    'faostatapiclient',
    'waves',
    'moment',
    'outdatedbrowser',
    'amplify'
], function ($, log, Chaplin, C, E, Common, API, Waves, moment) {

    'use strict';

    var cache = {
        skip: 'onboarding'
    };

    // The application object
    // Choose a meaningful name for your application
    var Application = Chaplin.Application.extend({

        // Set your application name here so the document title is set to
        // “Controller title – Site title” (see Layout#adjustTitle)
        title: C.CHAPLINJS_APPLICATION_TITLE,

        start: function () {

            // You can fetch some data here and start app
            // (by calling supermethod) after that.

            var args = [].slice.call(arguments);

            this.forceAmplifyStorageClear();

            this.configApplication();

            this.bindEventListeners();

            Chaplin.Application.prototype.start.apply(this, args);

        },

        configApplication: function() {

            // outdatedBrowser. Has been moved here to avoid Google indexing it.
            $('body').append('<div id="outdated">' +
                '<h6>Oh no your browser is out of date!</h6>' +
                '<p>Update your browser to view this website correctly.</p>' +
                '<br><p><img src="data:image/png;base64,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" width="48" height="48"></p>' +
                '<small style="padding-right:15px;" class="pull-right">Icon thanks to <a href="https://icons8.com">Icon pack by Icons8</a></small>' +
                '<p class="last"><a href="#" id="btnCloseUpdateBrowser" title="Close">&times;</a>' +
                '</p></div>');
            outdatedBrowser({
                bgColor: '#f25648',
                color: '#ffffff',
                lowerThan: 'transform',
                languagePath: ''
            });

            // add language to body
            $('body').addClass(locale);

            // init wave effect
            Waves.init();

            // setting global log level
            log.setLevel(C.LOGLEVEL);

            // config api
            API.config({
                base_url: C.URL_API,
                lang: Common.getLocaleAPI(),
                log: C.API_LOG
            });

            // Set direction
            C.direction = Common.getLocale() === 'ar'? 'fs-direction-rtl': 'fs-direction-ltr';

            // set moment locale. fix on chinese lang in momentjs
            moment.locale(Common.getLocale() === 'zh'? 'zh_cn' : Common.getLocale());

            if (C.DATASOURCE !== null) {
                API.config({
                    datasource: C.DATASOURCE
                });
            }

            log.info("MODE", C)
        },

        bindEventListeners: function () {

            Chaplin.mediator.subscribe(E.NOT_AUTHORIZED, function () {
                //Chaplin.utils.redirectTo({url: C.SECURITY_NOT_AUTHORIZED_REDIRECTION_LINK});
            });

        },

        // TODO: move to the initialization
        forceAmplifyStorageClear: function() {

            $.each(amplify.store(), function (storeKey) {
                // Delete the current key from Amplify storage
                // TODO: get from a boarding storageKey
                if (storeKey.indexOf(cache.skip) === -1) {
                    amplify.store(storeKey, null);
                }
            });

        }

    });

    return Application;
});
