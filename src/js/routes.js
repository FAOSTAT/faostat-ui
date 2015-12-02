/*global define*/
define(['config/Routes'], function (ROUTE) {

    'use strict';

    return function (match) {

        match(':lang/home', 'home#show', {name: ROUTE.HOME});

        match(':lang/download/bulk/:code', 'download#show_bulk_downloads', {name: ROUTE.DOWNLOAD_BULK});
        match(':lang/download/metadata/:code', 'download#show_metadata', {name: ROUTE.DOWNLOAD_METADATA});
        match(':lang/download/interactive/:code', 'download#show_interactive_download', {name: ROUTE.DOWNLOAD_INTERACTIVE});

        //match(':lang/browse/domain', 'browse#show_browse_by_domain', {name: 'browse_by_domain'});
        match(':lang/browse/domain/:code', 'browse#show_browse_by_domain', {name: ROUTE.BROWSE_BY_DOMAIN_CODE});

        match(':lang/browse/country', 'browse#show_browse_by_country', {name: ROUTE.BROWSE_BY_COUNTRY});
        match(':lang/browse/country/:code', 'browse#show_browse_by_country', {name: ROUTE.BROWSE_BY_COUNTRY_CODE});

        //match(':lang/browse/rankings', 'browse#show_browse_rankings', {name: 'browse_rankings'});
        match(':lang/browse/rankings/:code', 'browse#show_browse_rankings', {name: ROUTE.BROWSE_RANKINGS_CODE});

        match(':lang/compare', 'compare#show', {name: ROUTE.COMPARE});

        match(':lang/standards', 'standards#show');
        match(':lang/standards/methodologies', 'standards#show_methodologies', {name: ROUTE.METHODOLOGIES});
        match(':lang/standards/units', 'standards#show_units', {name: ROUTE.UNITS});
        match(':lang/standards/abbreviations', 'standards#show_abbreviations', {name: ROUTE.ABBREVIATIONS});
        match(':lang/standards/glossary', 'standards#show_glossary', {name: ROUTE.GLOSSARY});
        match(':lang/standards/classifications', 'standards#show_classifications', {name: ROUTE.CLASSIFICATIONS});

        match('protected', 'protected#show');
        match('about', 'about#show');
        match('*anything', '404#show');

    };

});