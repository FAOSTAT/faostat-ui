/*global define*/
define(function () {

    'use strict';

    var config;
    config = {
        paths: {
            FAOSTAT_UI_DOWNLOAD_SELECTORS_MANAGER: 'start',
            faostat_ui_download_selectors_manager: '../../'
            //FAOSTAT_UI_DOWNLOAD_SELECTOR: '../../submodules/faostat-ui-download-selector/src/js/start',
            //faostat_ui_download_selector: '../../submodules/faostat-ui-download-selector'
        },
        shim: {
            bootstrap: {
                deps: ['jquery']
            }
        }
    };

    return config;

});