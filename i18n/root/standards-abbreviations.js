/*global define*/
define(['jquery', 'i18n!nls/standards'], function ($, Standards) {

    'use strict';

    return $.extend(true, {}, Standards, {
        
        code_title: 'Acronym',
        label_title: 'Definition'
        
    });
});