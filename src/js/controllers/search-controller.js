/*global define*/
define([
    'controllers/base/controller',
    'views/search-view'
], function (Controller, View) {

    'use strict';

    var SearchController = Controller.extend({

        show: function (params) {

            this.view = new View({
                region: 'main'
            });
        }
    });

    return SearchController;
});
