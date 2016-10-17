/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        /*
        "compare_data": "Comparer Données",
        "add_filter": "Add Filter",
        "chart_title": "Timeseries on selected data",
        "select_a_timerange": "Select a timerange",
        "filter_box_title": "(Filter Box)"
        */

        compare_data: "Comparer les données",
        add_filter: "Ajouter un filtre",
        chart_title: "Timeseries sur les données sélectionnées",
        select_a_timerange: "Sélectionner une série de temps",
        filter_box_title: "(Boîte à filtre)"

    });
});