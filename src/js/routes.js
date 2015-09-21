/*global define*/
define(function () {

    'use strict';

    return function (match) {

        match('', 'home#show');
        match('home', 'home#show');

        match(':lang/download/bulk/:domain', 'download#show_bulk_downloads');
        match(':lang/download/metadata/:domain', 'download#show_metadata');
        match(':lang/download/interactive/:domain', 'download#show_interactive_download');

        match(':lang/browse/domain/:domain', 'browse-by-domain#show');
        match(':lang/browse/rankings/:domain', 'browse#show');
        match(':lang/browse/country/:domain', 'browse#show');

        match(':lang/compare', 'compare#show');

        match(':lang/standards', 'standards#show');
        match(':lang/standards/methodologies', 'standards#show_methodologies');

        match('protected', 'protected#show');
        match('about', 'about#show');
        match('*anything', '404#show');
    };

});