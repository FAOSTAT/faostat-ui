/*global define*/
define([
    'controllers/base/controller',
    'views/definitions-view'], function (Controller, View) {

    'use strict';

    var DefinitionsController = Controller.extend({

        show: function (params) {
            this.view = new View({
                region: 'main',
                lang: params.lang
            });
        },

    });

    return DefinitionsController;

});
