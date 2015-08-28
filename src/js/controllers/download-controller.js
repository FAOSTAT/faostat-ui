/*global define*/
define(['controllers/base/controller', 'views/download-view'], function (Controller, View) {

    'use strict';

    var DownloadController = Controller.extend({

        show: function (params) {
            this.view = new View({
                region: 'main'
            });
        },

        show_bulk: function (params) {
            this.view = new View({
                region: 'main',
                section: 'bulk',
                domain: params.domain
            });
        },

        show_interactive: function (params) {
            this.view = new View({
                region: 'main',
                section: 'interactive',
                domain: params.domain
            });
        },

        show_metadata: function (params) {
            this.view = new View({
                region: 'main',
                section: 'metadata',
                domain: params.domain
            });
        }

    });

    return DownloadController;

});
