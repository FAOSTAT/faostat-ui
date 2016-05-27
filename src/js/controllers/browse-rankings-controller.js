/*global define*/
define([
    'controllers/base/controller',
    'views/browse-rankings-view'
], function (Controller, View) {

    'use strict';

    var BrowseRankingsController = Controller.extend({

        show: function (params) {
            this.view = new View({
                region: 'main',
                lang: params.lang,
                code: params.code !== undefined ? params.code: undefined
            });
        }

    });

    return BrowseRankingsController;
});
