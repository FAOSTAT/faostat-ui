/*global define*/
define([
    'controllers/base/controller',
    'views/data-view'
], function (Controller, View) {

    'use strict';

    return Controller.extend({

        show: function (params) {

            this.view = new View({
                region: 'main'
            });
        }

    });

});
