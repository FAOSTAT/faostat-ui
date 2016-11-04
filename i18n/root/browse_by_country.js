/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, I18N) {

    'use strict';

    return $.extend(true, {}, I18N, {

        back_to_country_list: "Back to countries",
        country_list: "Country List",
        demographics: "Demographics",
        inputs: "Inputs",
        undernourishment: "Undernourishment",
        food_availability: "Food availability",
        food_access: "Food access",
        food_utilization: "Food utilization",
        land: "Land",
        economic_and_political_stability: "Economic and political stability",
        production: "Production",
        emissions: "Emissions",
        economy: "Economy",
        fao_statistical_yearbook_summary: 'FAO Statistical Yearbook - Country',
        fao_statistical_yearbook_summary_world:  'FAO Statistical Yearbook - World',
        world: "World",
        regions: "Regions"

    });

});