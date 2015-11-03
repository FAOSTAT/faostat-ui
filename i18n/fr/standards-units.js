/*global define*/
define(['jquery', 'i18n!nls/standards'], function ($, Standards) {

    'use strict';

    return $.extend(true, {}, Standards, {

        title: 'Standard Units and Symbols used in FAOSTAT',
        code_title: 'Abbreviation',
        label_title: 'Title',
        sort_by_title: 'Sort By Title'
        
    });
});