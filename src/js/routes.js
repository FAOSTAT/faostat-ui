/*global define*/
define(function () {

    'use strict';

    return function (match) {
        match('', 'home#show');
        match('home', 'home#show');
        match(':lang/download/bulk/:domain', 'download#show_bulk');
        match(':lang/download/metadata/:domain', 'download#show_metadata');
        match(':lang/download/interactive/:domain', 'download#show_interactive');
        match('browse', 'browse#show');
        match('protected', 'protected#show');
        match('about', 'about#show');
        match('*anything', '404#show');
    };

});