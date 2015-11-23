/*global define, amplify*/
define([
    'controllers/base/controller',
    'views/404-view'
], function (Controller, NotFoundView) {
    'use strict';

    var NotFoundController = Controller.extend({

        show: function (params) {

            this.view = new NotFoundView({
                region: 'main'
            });
        }
    });

    return NotFoundController;
});
