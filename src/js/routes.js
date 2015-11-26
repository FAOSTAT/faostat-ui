/*global define*/
define(function () {

    'use strict';

    var ROUTE = {

        BROWSE_BY_COUNTRY: "browse_by_country",
        BROWSE_BY_COUNTRY_CODE: "browse_by_country_code"

    };

    return function(match) {

        //match('', 'home#show');
        //match('home/test', 'home#show', {name: 'home'});
        match(':lang/home', 'home#show', {name: 'home'});

        match(':lang/download/bulk/:code', 'download#show_bulk_downloads', {name: 'bulk'});
        match(':lang/download/metadata/:code', 'download#show_metadata', {name: 'metadata'});
        match(':lang/download/interactive/:code', 'download#show_interactive_download', {name: 'interactive'});


        //match(':lang/browse/domain', 'browse#show_browse_by_domain', {name: 'browse_by_domain'});
        match(':lang/browse/domain/:code', 'browse#show_browse_by_domain', {name: 'browse_by_domain_code'});

        match(':lang/browse/country', 'browse#show_browse_by_country', {name: ROUTE.BROWSE_BY_COUNTRY});
        match(':lang/browse/country/:code', 'browse#show_browse_by_country', {name: ROUTE.BROWSE_BY_COUNTRY_CODE});

        //match(':lang/browse/rankings', 'browse#show_browse_rankings', {name: 'browse_rankings'});
        match(':lang/browse/rankings/:code', 'browse#show_browse_rankings', {name: 'browse_rankings_code'});


        match(':lang/compare', 'compare#show');


        match(':lang/standards', 'standards#show');
        match(':lang/standards/methodologies', 'standards#show_methodologies', {name: 'methodologies'});
        //match(':lang/standards/methodologies/:id', 'standards#show_methodology', {name: 'bulk'});
        match(':lang/standards/units', 'standards#show_units', {name: 'units'});
        match(':lang/standards/abbreviations', 'standards#show_abbreviations', {name: 'abbreviations'});
        match(':lang/standards/glossary', 'standards#show_glossary', {name: 'glossary'});
        match(':lang/standards/classifications', 'standards#show_classifications', {name: 'classifications'});


        match('protected', 'protected#show');
        match('about', 'about#show');
        match('*anything', '404#show');

    };

});