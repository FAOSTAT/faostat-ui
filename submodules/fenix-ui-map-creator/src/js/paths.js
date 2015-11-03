/*global define*/
define(function () {
    'use strict';

    var config = {

        paths : {
            'fx-m-c/start' : './start',
            'fx-m-c/html' : '../html',
            'fx-m-c/config' : '../../config',
            'fx-m-c/adapters' : './adapters',
            'fx-m-c/templates' : './templates',
            // third party libs
            text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
            jquery: '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
            underscore: '{FENIX_CDN}/js/underscore/1.7.0/underscore.min',
            amplify: '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
            'handlebars': '{FENIX_CDN}/js/handlebars/2.0.0/handlebars',
            'chosen': '{FENIX_CDN}/js/chosen/1.2.0/chosen.jquery.min',

            // fenix-ui-map-js
            'import-dependencies':'{FENIX_CDN}/js/FENIX/utils/import-dependencies-1.0',
            'leaflet': '{FENIX_CDN}/js/leaflet/0.7.3/leaflet',
            'jquery.power.tip': '{FENIX_CDN}/js/jquery.power.tip/1.2.0/jquery.powertip.min',
            'jquery-ui': '{FENIX_CDN}/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
            'jquery.i18n.properties': '{FENIX_CDN}/js/jquery/1.0.9/jquery.i18n.properties-min',
            'jquery.hoverIntent': '{FENIX_CDN}/js/jquery.hoverIntent/1.8.0/jquery.hoverIntent.min',

            'fenix-ui-map': '{FENIX_CDN}/js/fenix-ui-map/0.1.0/fenix-ui-map.min',
            'fenix-ui-map-config': '{FENIX_CDN}/js/fenix-ui-map/0.1.0/fenix-ui-map-config'
        },

        shim: {
            'jquery-ui': ['jquery'],
            'jquery.power.tip': ['jquery'],
            'jquery.i18n.properties': ['jquery'],
            'chosen': ['jquery'],
            'jquery.hoverIntent': ['jquery'],
            'fenix-ui-map': {
                deps: [
                    'jquery',
                    'jquery-ui',
                    'leaflet',
                    'fenix-ui-map-config',
                    'jquery.power.tip',
                    'jquery.i18n.properties',
                    'import-dependencies',
                    'jquery.hoverIntent',
                    'chosen'
                ]
            },
            "amplify": {
                "deps": ["jquery"]
            }
        }
    };

    return config;
});