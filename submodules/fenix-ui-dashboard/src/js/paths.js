/*global define*/
define(function () {

    'use strict';

    var config = {

        paths:  {

            'fx-ds/start': './start',
            'fx-ds/templates': './templates',
            'fx-ds/config' : '../../config',
            'fx-ds' : './',


            'jquery': '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            'bootstrap': '{FENIX_CDN}/js/bootstrap/3.2/js/bootstrap.min',
            'text': '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
            'amplify' : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
            handlebars: "{FENIX_CDN}/js/handlebars/2.0.0/handlebars"
        },

        shim: {

            "bootstrap": {
                deps: ["jquery"]
            },
            amplify: {
                deps: ['jquery'],
                exports: 'amplify'
            }
        }
    };

    return config;
});