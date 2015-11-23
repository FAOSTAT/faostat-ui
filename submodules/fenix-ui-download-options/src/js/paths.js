/*global define*/
define(function () {

    'use strict';

    return {
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

});