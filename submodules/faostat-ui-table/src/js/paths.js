/*global define*/
define(function () {

    'use strict';

    return {
        paths: {
            FAOSTAT_UI_TABLE: 'start',
            faostat_ui_table: '../../'
        },
        shim: {
            bootstrap: {
                deps: ['jquery']
            }
        }
    };

});