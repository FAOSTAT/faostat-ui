/*global define*/
define(function () {

    'use strict';

    var config;
    config = {
        paths: {
            FENIX_UI_METADATA_VIEWER: 'start',
            fenix_ui_metadata_viewer: '../',
            sweetAlert: 'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/0.5.0/sweet-alert.min',
            jsonEditor: '{FENIX_CDN}/js/json-editor/0.7.17/jsoneditor',
            FAOSTAT_THEME: '../submodules/json-editor-faostat-theme/js/faostat-theme'
        },
        shim: {
            bootstrap: {
                deps: ['jquery']
            },
            jsonEditor: {
                deps: ['jquery', 'bootstrap']
            }
        }
    };

    return config;

});