/*global define*/
define(['jquery', 'loglevel', 'underscore.string'], function ($, log, _s) {

        'use strict';

            var host = document.location.hostname,
                DEFAULT = {

/*                    "DATASOURCE": function() {
                        var datasources = ["production", "test"];
                        return datasources[Math.floor(Math.random()*datasources.length)];
                    },*/
                    "DATASOURCE": "production",
                    "LOGLEVEL": "error", // trace/debug/info/warn/error

                    // Google Analytics ID
                    "GOOGLE_ANALYTICS_ID": "UA-68486942-1",

                    // URLs
                    "URL_PDF_BASEPATH": "http://faostat3.fao.org/modules/faostat-download-js/PDF/",
                    "URL_FEEDBACK_SYSTEM": "http://fenixapps.fao.org/feedbacksystem/",
                    "URL_COUNTRY_PROFILES": "http://faostat.fao.org/CountryProfiles/Country_Profile/default.aspx",
                    "URL_FAOSTAT_DATABASE_ZIP": "http://faostat3.fao.org/ftp-faostat/Bulk/FAOSTAT.zip",
                    "URL_BULK_DOWNLOADS_BASEPATH": "http://faostat.fao.org/Portals/_Faostat/Downloads/zip_files/",
                    "URL_METADATA_MODEL": 'http://faostat3.fao.org/mdfaostat/getmd/',
                    "URL_METADATA_DOMAIN": 'http://faostat3.fao.org/mdfaostat/getdomain/',
                    "URL_FAOSTAT_DOCUMENTS_BASEPATH": 'http://faostat3.fao.org/faostat-documents/',

                    // EMAIL and TELEPHONE
                    "EMAIL_FAO_STATISTICS": "FAO-statistics@fao.org",
                    "TELEPHONE_FAO_STATISTICS": "+39 06 570 55303",

                    //Chaplin JS configuration
                    CHAPLINJS_CONTROLLER_SUFFIX: '-controller',
                    CHAPLINJS_PROJECT_ROOT: '',
                    CHAPLINJS_PUSH_STATE: false,
                    CHAPLINJS_SCROLL_TO: false,
                    CHAPLINJS_APPLICATION_TITLE: "FAOSTAT"

                };

            // TODO: remove hardcoded local IP
            if (_s.contains(host, "localhost") || _s.contains(host, "168.202")) {
                return $.extend(true, {}, DEFAULT, {

                    // Configuration
                   // "GOOGLE_ANALYTICS_ID": "",
                    "LOGLEVEL": "trace" // trace/debug/info/warn/error

                });
            }

            return DEFAULT;


});
