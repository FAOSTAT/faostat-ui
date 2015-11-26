/*global define*/
define(function () {

        'use strict';

        return {

            // Configuration
            "DATASOURCE": "production",
            "GOOGLE_ANALYTICS_ID": "UA-68486942-1",

            "LOGLEVEL": "trace", // trace/debug/info/warn/error

            // URLs
            "URL_PDF_BASEPATH": "http://faostat3.fao.org/modules/faostat-download-js/PDF/",
            "URL_FEEDBACK_SYSTEM": "http://fenixapps.fao.org/feedbacksystem/",
            "URL_COUNTRY_PROFILES": "http://faostat.fao.org/CountryProfiles/Country_Profile/default.aspx",
            "URL_FAOSTAT_DATABASE_ZIP": "http://faostat3.fao.org/ftp-faostat/Bulk/FAOSTAT.zip",

            // EMAIL and TELEPHONE
            "EMAIL_FAO_STATISTICS": "FAO-statistics@fao.org",
            "TELEPHONE_FAO_STATISTICS": "+39 06 570 55303",


            //Chaplin JS configuration
            CHAPLINJS_CONTROLLER_SUFFIX: '-controller',
            CHAPLINJS_PROJECT_ROOT: '',
            CHAPLINJS_PUSH_STATE: false,
            CHAPLINJS_SCROLL_TO: false,
            CHAPLINJS_APPLICATION_TITLE: "FENIX Web App",

            //Top Menu configuration
            TOP_MENU_CONFIG: 'config/submodules/fx-menu/top_menu.json',
            TOP_MENU_TEMPLATE: 'fx-menu/templates/blank-fluid.html',
            TOP_MENU_SHOW_BREADCRUMB : true,
            TOP_MENU_SHOW_BREADCRUMB_HOME : true,
            TOP_MENU_SHOW_FOOTER: true,
            TOP_MENU_AUTH_MODE_HIDDEN_ITEMS: ['login'],
            TOP_MENU_PUBLIC_MODE_HIDDEN_ITEMS :['protected', 'logout'],

            SECURITY_NOT_AUTHORIZED_REDIRECTION_LINK : "home",

            SOCIAL_LINK_FACEBOOK : "https://facebook.com",
            SOCIAL_LINK_TWITTER : "https://twitter.com",
            SOCIAL_LINK_YOUTUBE : "https://youtube.com"

        };
    });
