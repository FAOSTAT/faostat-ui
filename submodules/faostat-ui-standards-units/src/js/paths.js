/*global define*/
define(function () {

    'use strict';

    return {
        paths: {
            FAOSTAT_UI_STANDARDS_UNITS: 'start',
            faostat_ui_standards_units: '../../'
        },
        shim: {
            bootstrap: {
                deps: ['jquery']
            }
        }
    };

});