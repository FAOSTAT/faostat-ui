/*global define*/
define(function () {

    'use strict';

    var config = {
        paths: {
            FAOSTAT_UI_MENU: 'start',
            faostat_ui_menu: '../../'
        },
        shim: {
            deps: ['text', 'i18n'],
            bootstrap: {
                deps: ['jquery']
            }
        }
    };

    return config;

});