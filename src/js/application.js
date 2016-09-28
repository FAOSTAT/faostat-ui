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
    'amplify'
], function ($, log, Chaplin, C, E, Common, API, Waves) {

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
            $('body').append('<div id="outdated"><h6>Your browser is out of date!</h6><p>Update your browser to view this website correctly. <a id="btnUpdateBrowser" href="http://outdatedbrowser.com/">Update my browser now </a></p> <p class="last"><a href="#" id="btnCloseUpdateBrowser" title="Close">&times;</a></p></div>');
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

            if (C.DATASOURCE !== null) {
                API.config({
                    datasource: C.DATASOURCE
                });
            }

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
