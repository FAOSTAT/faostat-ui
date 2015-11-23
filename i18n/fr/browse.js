/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        "tree_title": "FAOSTAT Domains",
        "browse_by_domain": "By Domain",
        "browse_by_country": "By Country/Region",
        "rankings": "Rankings",

        "map_footer": "Les appellations employées et la présentation des données sur la carte n'impliquent de la part de la FAO aucune prise de position quant au statut juridique ou constitutionnel des pays, territoires ou zones maritimes, ni quant au tracé de leurs frontières ou limites. Le Soudan du Sud a déclaré son indépendance le 9 Juillet 2011. Pour des raisons de disponibilité des données, l’évaluation montrée sur la carte à la fois pour le Soudan et le Soudan du Sud, refléte la situation comme elle l’etait jusqu’en 2011 pour l’ex Soudan."

    });
});