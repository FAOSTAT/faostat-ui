/*global define*/
define(function () {

    'use strict';

    return function (match) {

        //match('', 'home#show');
        match('home/test', 'home#show', {name: 'home'});
        match(':lang/home', 'home#show', {name: 'home2'});

        match(':lang/download/bulk/:code', 'download#show_bulk_downloads', {name: 'bulk'});
        match(':lang/download/metadata/:code', 'download#show_metadata', {name: 'metadata'});
        match(':lang/download/interactive/:code', 'download#show_interactive_download', {name: 'interactive'});

        match(':lang/browse/domain/:code', 'browse-by-domain#show');
        match(':lang/browse/rankings/:code', 'browse#show');
        match(':lang/browse/country/:code', 'browse#show');

        match(':lang/compare', 'compare#show');

        match(':lang/standards', 'standards#show');
        match(':lang/standards/methodologies', 'standards#show_methodologies');
        match(':lang/standards/methodologies/:id', 'standards#show_methodology');
        match(':lang/standards/units', 'standards#show_units');
        match(':lang/standards/abbreviations', 'standards#show_abbreviations');


        match('protected', 'protected#show');
        match('about', 'about#show');
        match('*anything', '404#show');
    };

});