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
        }
        
    });

    return StandardsController;

});
