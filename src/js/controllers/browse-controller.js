/*global define*/
define([
    'controllers/base/controller',
    'views/browse-view',
], function (Controller, View) {

    'use strict';

    var BrowseController = Controller.extend({

        show: function (params, section) {
            this.view = new View({
                region: 'main',
                section: section,
                lang: params.lang,
                code: params.code !== undefined ? params.code.toUpperCase() : undefined
            });
        },

        show_browse_by_domain: function (params) {
            //TODO: can be switched to the "name" section from ChaplinJS routes.js definition?
            this.show(params, 'browse_by_domain');
        },

        show_browse_by_country: function (params) {
            this.show(params, 'browse_by_country');
        },

        show_browse_rankings: function (params) {
            this.show(params, 'browse_rankings');
        }

    });

    return BrowseController;
});
