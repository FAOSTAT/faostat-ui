/*global define*/
define(function () {

    'use strict';

    var config = {

        paths : {
            //'fx-c-c': prefix,
            'fx-c-c/start': './start',
            'fx-c-c/html': '../html',
            'fx-c-c/config': '../../config',
            'fx-c-c/adapters':  './adapters',
            'fx-c-c/templates': './templates',
            'fx-c-c/creators': './creators',

            // third party libs
            text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
            jquery: '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            underscore: '{FENIX_CDN}/js/underscore/1.7.0/underscore.min',
            amplify: '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
            'handlebars': '{FENIX_CDN}/js/handlebars/2.0.0/handlebars',
            'highcharts': '{FENIX_CDN}/js/highcharts/4.0.4/js/highcharts',

            // highcharts plugins TODO: switch to CDN if they are going to be used
            'highcharts-export': '{FENIX_CDN}/js/highcharts/4.0.4/js/modules/exporting',
            'highcharts-export-csv': 'http://highslide-software.github.io/export-csv/export-csv'
        },

        shim: {
            "highcharts": {
                "exports": "Highcharts",
                "deps": ["jquery"]
            },
            "highcharts-export": {
                "deps": ["highcharts"]
            },
            "highcharts-export-csv": {
                "deps": ["highcharts", "highcharts-export" ]
            },
             "amplify": {
                "deps": ["jquery"]
            }
        }
    };

    return config;
});
