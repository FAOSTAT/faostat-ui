/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        compare_data: "Comparar Datos",
        add_filter: "Añadir filtro",
        chart_title: "Serie temporal de los datos seleccionados",
        select_a_timerange: "Seleccione un intervalo de tiempo",
        filter_box_title: "(Filtro)"

    });
});