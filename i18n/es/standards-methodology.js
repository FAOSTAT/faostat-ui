/*global define*/
define(['jquery', 'i18n!nls/standards'], function ($, Standards) {

    'use strict';

    return $.extend(true, {}, Standards, {

        title: 'Methodologies used in FAOSTAT',
        select_methodology: 'Select a methodology on the left to view details',
        search_methodology: 'Search for a Methodology',
        methodology: 'Methodology'

    });
});