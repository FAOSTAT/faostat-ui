/*global define, amplify*/
define([
    'chaplin',
    'views/site-view',
    'config/Events',
    'nprogress',
    'globals/Common',
    'amplify'
], function (Chaplin, SiteView, E, NProgress, Common) {
    'use strict';

    var Controller = Chaplin.Controller.extend({

        // Place your application-specific controller features here.
        beforeAction: function (params, options) {

            NProgress.start();

            this.reuse('site', SiteView);

            amplify.publish(E.SEARCH_BOX_SHOW);

            // TODO: check if it is always worth to set it here
            amplify.publish(E.GOOGLE_ANALYTICS_PAGE_VIEW, {});

            Common.updatePageTitle();

        }

    });

    return Controller;
});
