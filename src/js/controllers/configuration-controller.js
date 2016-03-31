/*global define*/
define([
    'controllers/base/controller',
    'views/status-view'], function (Controller, View) {

    'use strict';

    var StatusController = Controller.extend({

        show: function (params) {

            this.view = new View({
                region: 'main'
            });
        }

    });

    return StatusController;

});
