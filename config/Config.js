/*global define, document*/
define([
    'jquery',
    'loglevel',
    'underscore.string',
    'amplify'
], function ($, log, _s) {

    'use strict';

    return {

        "DATASOURCE": "production",
        "LOGLEVEL": "trace", // trace/debug/info/warn/error/silent

        // Google Analytics ID
        "GOOGLE_ANALYTICS_ID": "UA-68486942-2",

        // URLs
        "URL_FEEDBACK_SYSTEM": "http://fenixapps.fao.org/feedbacksystem/",
        "URL_FAOSTAT_DATABASE_ZIP": "http://fenix.fao.org/faostat/ftp/FAOSTAT.zip",
        "URL_BULK_DOWNLOADS_BASEPATH": "http://fenix.fao.org/faostat/bulkdownloads/",
        "URL_FAOSTAT_DOCUMENTS_BASEPATH": 'http://fenix.fao.org/faostat/documents/',
        "URL_RELEASE_CALENDAR": 'http://fenix.fao.org/faostat/releasecalendar/Default.aspx',

        // EMAIL and TELEPHONE
        "EMAIL_FAO_STATISTICS": "FAO-statistics@fao.org",
        "TELEPHONE_FAO_STATISTICS": "+39 06 570 55303",

        //Chaplin JS configuration
        CHAPLINJS_CONTROLLER_SUFFIX: '-controller',
        CHAPLINJS_PROJECT_ROOT: '',
        CHAPLINJS_PUSH_STATE: false,
        CHAPLINJS_SCROLL_TO: true,
        CHAPLINJS_APPLICATION_TITLE: "FAOSTAT",

        DATE_UPDATE: "@@date_update",
        VERSION: "@@version"

    };

});
