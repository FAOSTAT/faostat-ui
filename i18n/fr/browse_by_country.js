/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, I18N) {

    'use strict';

    return $.extend(true, {}, I18N, {

        back_to_country_list: "Retour aux pays",
        country_list: "Liste de pays",
        demographics: "Démographiques",
        inputs: "Intrants",
        undernourishment: "Malnutrition",
        food_availability: "Disponibilité de nourriture",
        food_access: "Accès à la nourriture",
        food_utilization: "Utilisation de la nourriture",
        land: "Terre",
        economic_and_political_stability: "Stabilité économique et politique",
        production: "Production",
        emissions: "Émissions",
        economy: "Economie",
        fao_statistical_yearbook_summary: 'Annuaire statistique de la FAO - Pays',
        fao_statistical_yearbook_summary_world:  'Annuaire statistique de la FAO - Monde',
        world: "Monde",
        regions: "Régions"

    });

});