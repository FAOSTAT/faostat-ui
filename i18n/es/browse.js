/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        "tree_title": "FAOSTAT Domains",
        "browse_by_domain": "By Domain",
        "browse_by_country": "By Country/Region",
        "rankings": "Rankings",

        "map_footer": "Las denominaciones empleadas en los mapas y la forma en que aparecen presentados los datos no implican, por parte de la FAO, juicio alguno sobre la condición jurídica de países, territorios o zonas marítimas, ni respecto de la delimitación de sus fronteras. Sudán del Sur declaró su independencia el 9 de julio de 2011. Debido a la disponibilidad de datos, la evaluación presentada en el mapa para Sudán y Sudán del Sur refleja la situación hasta el año 2011 para la antigua Sudán."

    });
});