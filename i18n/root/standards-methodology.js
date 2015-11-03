/*global define*/
define(['jquery', 'i18n!nls/standards'], function ($, Standards) {

    'use strict';

    return $.extend(true, {}, Standards, {

        title: 'Methodologies used in FAOSTAT',
        code_title: 'Abbreviation',
        label_title: 'Title',
        sort_by_title: 'Sort By Title',
        methodology_list: 'Methodology',
        select_methodology: 'Select a methodology on the left to view details',
        note_title: 'Note',
        reference_title: 'Reference',
        coverage_title: 'Coverage',
        collection_title: 'Collection',
        estimation_title: 'Estimation'
    });
});