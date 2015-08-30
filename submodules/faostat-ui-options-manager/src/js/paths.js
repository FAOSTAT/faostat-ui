/*global define*/
define(function () {

    'use strict';

    return {
        paths: {
            FAOSTAT_UI_OPTIONS_MANAGER: 'start',
            faostat_ui_options_manager: '../../'
        },
        shim: {
            bootstrap: {
                deps: ['jquery']
            }
        }
    };

});