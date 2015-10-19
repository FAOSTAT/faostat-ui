/*global define*/
define(['jquery', 'i18n!nls/standards'], function ($, Standards) {

    'use strict';

    return $.extend(true, {}, Standards, {

        code_title: 'Code',
        label_title: 'Item Name',
        description_title: 'Description',
        sort_by_title: 'Sort By Item Name',
        classification: 'Classification',
        select_classification: 'Select a Domain on the left to view the classification details'
        
    });
});