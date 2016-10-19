/*global define*/
define(['config/Routes'], function (ROUTE) {

    'use strict';

    return function (match) {

        match('', 'home#redirect');
        match('home', 'home#show', {name: ROUTE.HOME});

        match('country', 'browse-by-country#show', {name: ROUTE.BROWSE_BY_COUNTRY});
        match('country/:code', 'browse-by-country#show', {name: ROUTE.BROWSE_BY_COUNTRY_CODE});

        match('rankings/:code', 'browse-rankings#show', {name: ROUTE.BROWSE_RANKINGS_CODE});

        match('compare', 'compare#show', {name: ROUTE.COMPARE});

        //match('standards', 'standards#show');
        //match('methodologies', 'standards-methodology#show_methodologies', {name: ROUTE.METHODOLOGIES});
        //match('units', 'standards-units#show_units', {name: ROUTE.UNITS});
        //match('abbreviations', 'standards-abbreviations#show_abbreviations', {name: ROUTE.ABBREVIATIONS});
        //match('glossary', 'standards-glossary#show_glossary', {name: ROUTE.GLOSSARY});
       // match('classifications', 'standards-classifications#show_classifications', {name: ROUTE.CLASSIFICATIONS});

        match('definitions', 'definitions#show', {name: ROUTE.DEFINITIONS});
        match('definitions/:code', 'definitions-by-type#show', {name: ROUTE.DEFINITIONS_BY_TYPE});

        match('indicators', 'indicators#show', {name: ROUTE.INDICATORS});
        //match('indicators/:code', 'indicators#show', {name: ROUTE.INDICATORS_CODE});

        match('search/:query', 'search#show', {name: ROUTE.SEARCH_QUERY});
        match('faq', 'faq#show', {name: ROUTE.FAQ});

        match('status', 'status#show', {name: ROUTE.FAOSTAT_STATUS});
        match('status/configuration', 'configuration#show', {name: ROUTE.FAOSTAT_CONFIGURATION});

        match('data', 'data#show', {name: ROUTE.DATA});

        match('data/:code/metadata', 'download-metadata#show_metadata', {name: ROUTE.DOWNLOAD_METADATA});
        match('data/:code', 'download#show_interactive_download', {name: ROUTE.DOWNLOAD_INTERACTIVE});
        match('data/:code/report', 'download-report#show_report', {name: ROUTE.DOWNLOAD_REPORT});
        match('data/:code/visualize', 'download-browse#show_browse', {name: ROUTE.BROWSE_BY_DOMAIN_CODE});
        //match('data/about/:code', 'download#show_about', {name: ROUTE.DOWNLOAD_ABOUT});
        //match('data/about/:code', 'download#show_about', {name: ROUTE.DOWNLOAD_ABOUT});
        //match('data/bulk/:code', 'download#show_bulk_downloads', {name: ROUTE.DOWNLOAD_BULK});
        //match('data/metadata/:code', 'download#show_metadata', {name: ROUTE.DOWNLOAD_METADATA});
        //match('protected', 'protected#show');
        //match('about', 'about#show');
        match('*anything', '404#show');

    };

});