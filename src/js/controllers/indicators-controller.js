/*global define*/
define([
    'controllers/base/controller',
    'views/indicators-view'
], function (Controller, View) {

    'use strict';

    var IndicatorsController = Controller.extend({

        show: function (params) {

            this.view = new View({
                region: 'main'
            });
        }
    });

    return IndicatorsController;
});
