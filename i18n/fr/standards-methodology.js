/*global define*/
define(['jquery', 'i18n!nls/standards'], function ($, Standards) {

    'use strict';

    return $.extend(true, {}, Standards, {
        
        select_methodology: 'Sélectionnez un domaine sur la gauche pour voir les détails.',
        search_methodology: 'Search for a Methodology',

        estimation_title: 'Estimation',
        coverage_title: 'Coverage',
        collection_title: 'Collection',
        reference_title: 'Reference',
        note_title: 'Note'

    });
});