/*global define*/
define(['config/Routes'], function (ROUTE) {

    'use strict';

    return function (match) {

        match(':lang/home', 'home#show', {name: ROUTE.HOME});

/*        match(':lang/download/bulk/:code', 'download#show_bulk_downloads', {name: ROUTE.DOWNLOAD_BULK});
        match(':lang/download/metadata/:code', 'download#show_metadata', {name: ROUTE.DOWNLOAD_METADATA});
        match(':lang/download/interactive/:code', 'download#show_interactive_download', {name: ROUTE.DOWNLOAD_INTERACTIVE});
        match(':lang/download/about/:code', 'download#show_about', {name: ROUTE.DOWNLOAD_ABOUT});
        match(':lang/download/report/:code', 'download#show_report', {name: ROUTE.DOWNLOAD_REPORT});*/


        //match(':lang/browse/domain', 'browse#show_browse_by_domain', {name: 'browse_by_domain'});
        //match(':lang/browse/domain/:code', 'browse#show_browse_by_domain', {name: ROUTE.BROWSE_BY_DOMAIN_CODE});

        match(':lang/country', 'browse-by-country#show', {name: ROUTE.BROWSE_BY_COUNTRY});
        match(':lang/country/:code', 'browse-by-country#show', {name: ROUTE.BROWSE_BY_COUNTRY_CODE});

        //match(':lang/browse/rankings', 'browse#show_browse_rankings', {name: 'browse_rankings'});
        match(':lang/rankings/:code', 'browse-rankings#show', {name: ROUTE.BROWSE_RANKINGS_CODE});

        match(':lang/compare', 'compare#show', {name: ROUTE.COMPARE});

        //match(':lang/standards', 'standards#show');
        match(':lang/methodologies', 'standards-methodology#show_methodologies', {name: ROUTE.METHODOLOGIES});
        match(':lang/units', 'standards-units#show_units', {name: ROUTE.UNITS});
        match(':lang/abbreviations', 'standards-abbreviations#show_abbreviations', {name: ROUTE.ABBREVIATIONS});
        match(':lang/glossary', 'standards-glossary#show_glossary', {name: ROUTE.GLOSSARY});
        match(':lang/classifications', 'standards-classifications#show_classifications', {name: ROUTE.CLASSIFICATIONS});

        match(':lang/definitions', 'definitions#show', {name: ROUTE.DEFINITIONS});
        match(':lang/definitions/:code', 'definitions-by-type#show', {name: ROUTE.DEFINITIONS_BY_TYPE});

        match(':lang/indicators', 'indicators#show', {name: ROUTE.INDICATORS});
        //match(':lang/indicators/:code', 'indicators#show', {name: ROUTE.INDICATORS_CODE});

        match(':lang/search/:query', 'search#show', {name: ROUTE.SEARCH_QUERY});
        match(':lang/faq', 'faq#show', {name: ROUTE.FAQ});

        match(':lang/status', 'status#show', {name: ROUTE.FAOSTAT_STATUS});
        match(':lang/status/configuration', 'configuration#show', {name: ROUTE.FAOSTAT_CONFIGURATION});

        match(':lang/data', 'data#show', {name: ROUTE.DATA});

        match(':lang/data/:code/metadata', 'download-metadata#show_metadata', {name: ROUTE.DOWNLOAD_METADATA});
        match(':lang/data/:code', 'download#show_interactive_download', {name: ROUTE.DOWNLOAD_INTERACTIVE});
        match(':lang/data/:code/report', 'download-report#show_report', {name: ROUTE.DOWNLOAD_REPORT});
        match(':lang/data/:code/visualize', 'download-browse#show_browse', {name: ROUTE.BROWSE_BY_DOMAIN_CODE});
        //match(':lang/data/about/:code', 'download#show_about', {name: ROUTE.DOWNLOAD_ABOUT});
        //match(':lang/data/about/:code', 'download#show_about', {name: ROUTE.DOWNLOAD_ABOUT});
        //match(':lang/data/bulk/:code', 'download#show_bulk_downloads', {name: ROUTE.DOWNLOAD_BULK});
        // match(':lang/data/metadata/:code', 'download#show_metadata', {name: ROUTE.DOWNLOAD_METADATA});
        match('protected', 'protected#show');
        match('about', 'about#show');
        match('*anything', '404#show');

    };

});