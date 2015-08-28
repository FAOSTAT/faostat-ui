/*global define*/
define([
    'controllers/base/controller',
    'views/about-view'
], function (Controller, View) {
    'use strict';

    var AboutController = Controller.extend({

        show: function (params) {

            this.view = new View({
                region: 'main'
            });
        }
    });

    return AboutController;
});
