/*global define*/
define([
    'controllers/base/controller',
    'views/browse-by-country-view'
], function (Controller, View) {

    'use strict';

    var BrowseByCountryController = Controller.extend({

        show: function (params) {
            this.view = new View({
                region: 'main',
                lang: params.lang,
                code: params.code !== undefined ? params.code: undefined
            });
        }

    });

    return BrowseByCountryController;
});
