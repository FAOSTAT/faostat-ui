/*global define*/
define(function () {

    'use strict';

    var config;
    config = {
        paths: {
            FENIX_UI_METADATA_VIEWER:'./start',
            fenix_ui_metadata_viewer: '../',
            sweetAlert: 'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/0.5.0/sweet-alert.min',
            jsonEditor: '{FENIX_CDN}/js/json-editor/0.7.17/jsoneditor'
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



/*
*
*  'fx-menu/start': './start',
 'fx-menu/templates': '../templates/',

 'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
 'bootstrap': '{FENIX_CDN}/js/bootstrap/3.2/js/bootstrap.min',
 'text': '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
 'amplify' : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min'
 },*/