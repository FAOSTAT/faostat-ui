/*global define*/
define([
    'controllers/base/controller',
    'views/configuration-view'], function (Controller, View) {

    'use strict';

    var ConfigurationController = Controller.extend({

        show: function (params) {

            this.view = new View({
                region: 'main'
            });
        }

    });

    return ConfigurationController;

});
