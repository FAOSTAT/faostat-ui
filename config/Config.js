/*global define, document*/
define(['jquery'], function ($) {

    'use strict';
    

    return {

        "URL_API": "http://fenixservices.fao.org/faostat/api/v1/",
        "API_LOG": false,

        "LOGLEVEL": "trace", // trace/debug/info/warn/error/silent

        // Google Analytics ID
        "GOOGLE_ANALYTICS_ID": "UA-68486942-2",

        // URLs
        "URL_FAOSTAT_DOCUMENTS_BASEPATH": 'http://fenixservices.fao.org/faostat/static/documents/',
        "URL_RELEASE_CALENDAR": 'http://fenixservices.fao.org/faostat/static/releasecalendar/Default.aspx',

        "JIRA_COLLECTOR": {
            "ENABLED": true,
            "URL": "https://jira.fao.org/ciok/s/en_US-8e74xy/787/3/1.1.2/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?collectorId=cb5d8c3f"
        },

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
