/*global define*/
define(function () {

    'use strict';

    return {
        paths: {
            FAOSTAT_UI_TREE: 'start',
            faostat_ui_tree: '../',
            sweetAlert: '{FENIX_CDN}/js/sweet-alert/0.5.0/sweet-alert.min',
            jstree: '{FENIX_CDN}/js/jstree/3.0.8/dist/jstree.min',
            faostatapiclient: '{FENIX_CDN}/js/faosttapiclient/1.0.0/dist/FAOSTATAPIClient.min'
        },
        shim: {
            jstree: {
                deps: ['jquery']
            }
        }
    };

});