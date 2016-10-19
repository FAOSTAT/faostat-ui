/*global define*/
define([
    'controllers/base/controller',
    'views/home-view',
    'globals/Common',
    'config/Routes',
], function (Controller, View, Common, ROUTES) {

    'use strict';

    var HomeController = Controller.extend({

        show: function (params) {

            this.view = new View({
                region: 'main'
            });
        },

        redirect: function (params) {

            Common.changeURL(ROUTES.HOME, [], false);

        }
    });

    return HomeController;
});
