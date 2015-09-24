/*global define*/
define(function () {

    'use strict';

    return {
        paths: {
            FAOSTAT_UI_OPTIONS_MANAGER: 'start',
            faostat_ui_options_manager: '../../',
            FENIX_UI_DOWNLOAD_OPTIONS: '../../submodules/fenix-ui-download-options/src/js/start',
            fenix_ui_download_options: '../../submodules/fenix-ui-download-options/'
        },
        shim: {
            bootstrap: {
                deps: ['jquery']
            }
        }
    };

});