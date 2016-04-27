/*global define*/
define([
    'controllers/base/controller',
    'views/download-view'
], function (Controller, View) {

    'use strict';

    return Controller.extend({

        show: function (params, section) {
            this.view = new View({
                region: 'main',
                section: section,
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
        },

        show_about: function (params) {
            this.show(params, 'about');
        },

        show_report: function (params) {
            this.show(params, 'report');
        },

        show_browse: function (params) {
            this.show(params, 'browse_by_domain_code');
        }

    });

});
