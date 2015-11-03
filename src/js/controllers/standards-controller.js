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

        show_methodologies: function (params) {
             //TODO: can be switched to the "name" section from ChaplinJS routes.js definition?
            this.show(params, 'methodologies');
        },

        show_units: function (params) {
            this.show(params, 'units');
        },

        show_abbreviations: function (params) {
            this.show(params, 'abbreviations');
        },

        show_glossary: function (params) {
            this.show(params, 'glossary');
        },

        show_classifications: function (params) {
            this.show(params, 'classifications');
        }

    });

    return StandardsController;

});
