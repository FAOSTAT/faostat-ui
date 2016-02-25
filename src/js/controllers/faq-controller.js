/*global define*/
define([
    'controllers/base/controller',
    'views/faq-view'], function (Controller, View) {

    'use strict';

    var FAQController = Controller.extend({

        show: function (params) {

            this.view = new View({
                region: 'main'
            });
        }

    });

    return FAQController;

});
