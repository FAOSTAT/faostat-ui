/*global define*/
define(function () {

    'use strict';

    return {
        paths: {
            FAOSTAT_UI_STANDARDS_METHODOLOGY: 'start',
            faostat_ui_standards_methodology: '../../'
        },
        shim: {
            bootstrap: {
                deps: ['jquery']
            }
        }
    };

});