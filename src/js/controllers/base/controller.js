/*global define, amplify*/
define(
    ['chaplin',
    'views/site-view',
    'config/Events',
    'amplify'
], function (Chaplin, SiteView, E) {
    'use strict';

    var Controller = Chaplin.Controller.extend({

        // Place your application-specific controller features here.
        beforeAction: function (params, options) {

            this.reuse('site', SiteView);

        }

    });

    return Controller;
});
