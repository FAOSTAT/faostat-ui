/*global define*/
define(['controllers/base/controller', 'views/download-view'], function (Controller, View) {

    'use strict';

    var DownloadController = Controller.extend({

        show: function (params, section) {
            this.view = new View({
                region: 'main',
                section: section,
                lang: params.lang,
                code: params.code.toUpperCase()
            });
        },

        show_bulk_downloads: function (params) {
            this.show(params, 'bulk');
        },

        show_interactive_download: function (params) {
            this.show(params, 'interactive');
        },

        show_metadata: function (params) {
            this.show(params, 'metadata');
        }

    });

    return DownloadController;

});