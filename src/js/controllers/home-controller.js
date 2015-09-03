/*global define*/
define([
    'controllers/base/controller',
    'views/home-view'
], function (Controller, View) {

    'use strict';

    var HomeController = Controller.extend({

        show: function (params) {

            this.view = new View({
                region: 'main'
            });
        }
    });

    return HomeController;
});
