/*global define, document*/
define([
    'jquery',
    'loglevel',
    'underscore.string',
    'amplify'
], function ($, log, _s) {

    'use strict';

    var host = document.location.hostname,
        href = document.location.href,
        DEFAULT = {

            /*"DATASOURCE": function() {
             var datasources = ["production", "test"];
             return datasources[Math.floor(Math.random()*datasources.length)];
             },*/
            "DATASOURCE": "production",
            "LOGLEVEL": "silent", // trace/debug/info/warn/error/silent

            // Google Analytics ID
            "GOOGLE_ANALYTICS_ID": "UA-68486942-1",

            // URLs
            //"URL_PDF_BASEPATH": "http://faostat3.fao.org/modules/faostat-download-js/PDF/",
            "URL_FEEDBACK_SYSTEM": "http://fenixapps.fao.org/feedbacksystem/",
            //"URL_COUNTRY_PROFILES": "http://faostat.fao.org/CountryProfiles/Country_Profile/default.aspx",
            "URL_FAOSTAT_DATABASE_ZIP": "http://faostat3.fao.org/ftp-faostat/FAOSTAT.zip",
            "URL_BULK_DOWNLOADS_BASEPATH": "http://faostat3.fao.org/faostat-bulkdownloads/",
            "URL_FAOSTAT_DOCUMENTS_BASEPATH": 'http://faostat3.fao.org/faostat-documents/',
            "URL_RELEASE_CALENDAR": ' http://faostat3.fao.org/releasecalendar/Default.aspx',

            // EMAIL and TELEPHONE
            "EMAIL_FAO_STATISTICS": "FAO-statistics@fao.org",
            "TELEPHONE_FAO_STATISTICS": "+39 06 570 55303",

            //Chaplin JS configuration
            CHAPLINJS_CONTROLLER_SUFFIX: '-controller',
            CHAPLINJS_PROJECT_ROOT: '',
            CHAPLINJS_PUSH_STATE: false,
            CHAPLINJS_SCROLL_TO: true,
            CHAPLINJS_APPLICATION_TITLE: "FAOSTAT"

        };

    // Demo
    if (_s.contains(href, "/demo/")) {

        return $.extend(true, {}, DEFAULT, {

            // Configuration
            // "DATASOURCE": "test",
            "DATASOURCE": "production",
            "GOOGLE_ANALYTICS_ID": "UA-68486942-3"

        });

    }

    // Internal
    if (_s.contains(href, "/internal/")) {

        return $.extend(true, {}, DEFAULT, {

            // Configuration
            "DATASOURCE": "test",
            "GOOGLE_ANALYTICS_ID": "UA-68486942-4",
            "URL_BULK_DOWNLOADS_BASEPATH": "http://168.202.3.183:8080/bulkdownloadFile/zip_files/",
            "URL_FAOSTAT_DOCUMENTS_BASEPATH": "http://168.202.3.183:8080/FAOSTATFiles/"

        });

    }

    // Dev localhost
    // TODO: remove hardcoded local IP
    if (_s.contains(host, "localhost") || _s.contains(host, "168.202")) {

        return $.extend(true, {}, DEFAULT, {

            // Configuration
            "DATASOURCE": "test",
            //"DATASOURCE": "production",
            "GOOGLE_ANALYTICS_ID": "UA-68486942-2",
            "LOGLEVEL": "trace",
            "URL_BULK_DOWNLOADS_BASEPATH": "http://168.202.3.183:8080/bulkdownloadFile/zip_files/",
            "URL_FAOSTAT_DOCUMENTS_BASEPATH": "http://168.202.3.183:8080/FAOSTATFiles/"

        });
    }

    // Dev
    if (_s.contains(href, "/dev/")) {

        var o = {

            // Configuration
            "GOOGLE_ANALYTICS_ID": "UA-68486942-2",
            "LOGLEVEL": "trace"
        };

        if (_s.contains(href, "/db3/")) {
            o.DATASOURCE = "db3";
        }

        if (_s.contains(href, "/db4/")) {
            o.DATASOURCE = "db4";
        }

        if (_s.contains(href, "/latest/")) {
            o.DATASOURCE = "production";
        }

        // temporary versionin
        if (_s.contains(href, "/v")) {
            o.DATASOURCE = "production";
            o.LOGLEVEL = "silent";
        }

        o = $.extend(true, {}, DEFAULT, o);

        if (!_s.contains(href, "/v")) {
            $('body')
                .prepend('<div class="alert alert-warning alert-dismissible fade in" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>' +
                    'FAOSTAT is in <strong>DEV</strong> mode. Using <strong>' + o.DATASOURCE.toUpperCase() + '</strong> datasource' +
                    '</div>');
        }

        return o;
    }

    return DEFAULT;

});
