/*global define, amplify*/
define([
    'jquery',
    'chaplin',
    'config/Config',
    'config/Events',
    'amplify'
], function ($, Chaplin, C, E) {

    'use strict';

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

            this.bindEventListeners();

            Chaplin.Application.prototype.start.apply(this, args);
        },

        bindEventListeners: function () {

            Chaplin.mediator.subscribe(E.NOT_AUTHORIZED, function () {
                Chaplin.utils.redirectTo({url:  C.SECURITY_NOT_AUTHORIZED_REDIRECTION_LINK});
            });

        }

    });

    return Application;
});
