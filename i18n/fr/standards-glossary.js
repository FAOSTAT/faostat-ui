/*global define*/
define(['jquery', 'i18n!nls/standards'], function ($, Standards) {

    'use strict';

    return $.extend(true, {}, Standards, {

        title: 'Glossary List in FAOSTAT',
        code_title: 'Title',
        label_title: 'Definition',
        source_title: 'Source',
        sort_by_title: 'Sort By Title'
        
    });
});