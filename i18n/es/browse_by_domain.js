/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, I18N) {

    'use strict';

    return $.extend(true, {}, I18N, {

        tab_ghg_main: "1961-actualidad",
        projections: "Proyecciones",
        missing_view: "No existen todavía gráficos disponibles para este dominio.<br>Lamentamos cualquier inconveniente que esto pueda causar <br>.",
        tab_macro_indicators_value_usd: "Valor (USD)",
        tab_macro_indicators_share: "Proporción del PIB",
        em_total_ghg: "Total GEI",
        em_co2 : "CO<sub>2</sub>",
        em_n2o : "N<sub>2</sub>O",
        em_ch4 : "CH<sub>4</sub>"

    });

});