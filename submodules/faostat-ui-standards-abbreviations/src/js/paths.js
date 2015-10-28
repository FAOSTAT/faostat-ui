/*global define*/
define(function () {

    'use strict';

    return {
        paths: {
            FAOSTAT_UI_STANDARDS_ABBREVIATIONS: 'start',
            faostat_ui_standards_abbreviations: '../../'
        },
        shim: {
            bootstrap: {
                deps: ['jquery']
            }
        }
    };

});