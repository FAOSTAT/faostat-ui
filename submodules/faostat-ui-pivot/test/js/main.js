/*global require,document*/
require.config({

    baseUrl: 'js/libs',

    paths: {

        pivot_exporter: '../../../src/js/PivotExporter'

    },

    shim: {
        pivot_exporter: ['jquery']
    }

});

require(['jquery', 'pivot_exporter'], function ($, PivotExporter) {

    'use strict';

    var PE = new PivotExporter({
        placeholder_id: 'downloadOutputArea',
        filename: 'Crops'
    });

    $('#csv_button').click({PE: PE}, function (e) {
        e.data.PE.csv();
    });

    $('#excel_button').click({PE: PE}, function (e) {
        e.data.PE.excel();
    });

});