/*global define*/
define([
    'controllers/base/controller',
    'views/compare-view'
], function (Controller, View) {

    'use strict';

    var CompareController = Controller.extend({

        show: function (params) {

            this.view = new View({
                region: 'main'
            });
        }
    });

    return CompareController;
});
