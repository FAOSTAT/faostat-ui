/*global define*/
define(function () {

    'use strict';

    return {
        paths: {
            FAOSTAT_UI_PIVOT: 'start',
            faostat_ui_pivot: '../../'
        },
        shim: {
            bootstrap: {
                deps: ['jquery']
            }
        }
    };

});