/*global define*/
define(['jquery', 'i18n!nls/standards'], function ($, Standards) {

    'use strict';

    return $.extend(true, {}, Standards, {

        select_methodology: 'Seleccionar una metodología de la izquierda para ver los detalles',
        search_methodology: 'Search for a Methodology',

        estimation_title: 'Estimación',
        coverage_title: 'Coverage',
        collection_title: 'Cobertura',
        reference_title: 'Referencia',
        note_title: 'Nota'

    });
});