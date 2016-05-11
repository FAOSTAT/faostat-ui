/*global define*/
define([
    'controllers/base/controller',
    'views/standards-view'], function (Controller, View) {

    'use strict';

    var StandardsController = Controller.extend({

        show: function (params, section) {
            this.view = new View({
                region: 'main',
                section: section,
                lang: params.lang,
                id: params.id !== undefined ? params.id.toUpperCase() : undefined
            });
        },

        show_classifications: function (params) {
            this.show(params, 'classifications');
        }

    });

    return StandardsController;

});
