/*global define*/
define(function () {

    'use strict';

    return function (match) {

        //match('', 'home#show');
        match('home/test', 'home#show', {name: 'home'});
        match('home', 'home#show', {name: 'home2'});

        match('download/bulk/:code', 'download#show_bulk_downloads', {name: 'bulk'});
        match('download/metadata/:code', 'download#show_metadata', {name: 'metadata'});
        match('download/interactive/:code', 'download#show_interactive_download', {name: 'interactive'});

        //match(':lang/browse/domain/:code', 'browse-by-domain#show');
        //match(':lang/browse/rankings/:code', 'browse#show');
        //match(':lang/browse/country/:code', 'browse#show');

        //match(':lang/compare', 'compare#show');

        match('standards', 'standards#show');
        match('standards/methodologies', 'standards#show_methodologies');
        match('standards/methodologies/:id', 'standards#show_methodology');
        match('standards/units', 'standards#show_units');
        match('standards/abbreviations', 'standards#show_abbreviations');


        match('protected', 'protected#show');
        match('about', 'about#show');
        match('*anything', '404#show');

    };

});