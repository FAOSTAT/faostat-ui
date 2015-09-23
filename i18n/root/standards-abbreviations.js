/*global define*/
define(['jquery', 'i18n!nls/standards'], function ($, Standards) {

    'use strict';

    return $.extend(true, {}, Standards, {

        title: 'Abbreviations List',
        code_title: 'Acronym',
        label_title: 'Definition',
        sort_by_title: 'Sort By Definition'
        
    });
});