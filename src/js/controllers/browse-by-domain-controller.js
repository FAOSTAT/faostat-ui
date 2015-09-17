/*global define*/
define([
    'controllers/base/controller',
    'views/browse-view',
    'views/browse-by-domain-view',
], function (Controller, BrowseView, DomainView) {

    'use strict';

    var BrowseByDomainController = Controller.extend({

        //beforeAction: function (params, route) {
        //    console.log(route.action);
        //
        //},

        show: function (params) {

            this.view = new BrowseView({
                region: 'main'
            });

            this.domain = new DomainView({
                regions: {
                    main: '#fs-browse-by-domain'
                }
            });
        }
    });

    return BrowseByDomainController;
});
