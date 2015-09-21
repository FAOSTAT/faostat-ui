/*global define*/
define(['controllers/base/controller', 'views/standards-view'], function (Controller, View) {

    'use strict';

    var StandardsController = Controller.extend({

        show: function (params, section) {
            this.view = new View({
                region: 'main',
                section: section,
                lang: params.lang
                //,domain: params.domain.toUpperCase()
            });
        },

        show_methodologies: function (params) {
            this.show(params, 'methodology');
            $('#methodology_link').css('background-color', '#eee');
        }

    });

    return StandardsController;

});
