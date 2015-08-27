/*global define*/
define(function () {

    'use strict';

    return function (match) {
        match('', 'home#show');
        match('home', 'home#show');
        match('download/bulk/:domain', 'download#show_bulk');
        match('download/metadata/:domain', 'download#show_metadata');
        match('download/interactive/:domain', 'download#show_interactive');
        match('browse', 'browse#show');
        match('protected', 'protected#show');
        match('about', 'about#show');
        match('*anything', '404#show');
    };

});