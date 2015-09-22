/*global define*/
define(['jquery', 'controllers/base/controller', 'views/standards-view'], function ($, Controller, View) {

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

        show_methodologies: function (params) {
            this.show(params, 'methodology');
            $('#methodology_link').css('background-color', '#eee');
        },

        show_methodology: function (params) {
            this.show(params, 'methodology');
            $('#methodology_link').css('background-color', '#eee');
        },

        show_units: function (params) {
            this.show(params, 'units');
            $('#units_link').css('background-color', '#eee');
        },

        show_abbreviations: function (params) {
            this.show(params, 'abbreviations');
            $('#abbreviations_link').css('background-color', '#eee');
        }

    });

    return StandardsController;

});
