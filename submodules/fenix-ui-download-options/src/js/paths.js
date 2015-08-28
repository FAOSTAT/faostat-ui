/*global define*/
define(function () {

    'use strict';

    var config = {
        paths: {
            FENIX_UI_DOWNLOAD_OPTIONS: 'start',
            fenix_ui_download_options: '../../'
        },
        shim: {
            bootstrap: {
                deps: ['jquery']
            }
        }
    };

    return config;

});