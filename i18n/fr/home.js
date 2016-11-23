/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        // bulk downloads
        bulk_download: "Données complètes",
        all_faostat_data: "Données de FAOSTAT",
        updated_on: "mis à jour le",

        // database updates
        database_updates: "Mises à jour de la base de données",

        // Statistical Yearbook
        fao_statistical_yearbooks: "Annuaire statistique de la FAO",
        fao_statistical_yearbooks_text: "L’Annuaires statistique de la FAO fournit une sélection d’indicateurs par pays sur l’alimentation et l’agriculture. <br><br> La première partie inclue des écarts thématiques avec des visualisations de données (graphiques, tableaux et cartes) avec un texte de base. La seconde partie comprend des tableaux à niveau régional pour un nombre d’indicateurs sélectionnés",

        // country indicators
        country_indicators_text: "Les indicateurs de pays fournissent un apercu d’indicateurs clés et les tableaux par pays.",

        // Rankings
        rankings: "Classements",
        rankings_text: "Les indicateurs de classements fournissent un apercu des indicateurs clés et des tableaux de comodity.",

        // Food security in the 2030 Agenda for Sustainable Development
        development_goals: "L’alimentation et l’agriculture dans le Programme de développement durable à l’horizon 2030",
        development_goals_text: "Le Programme de développement durable à l’horizon 2030 inclut 17 Objectifs de développement durable (ODD) devenus les nouveaux objectifs mondiaux qui ont succédé aux Objectifs du Millénaire pour les développement le 1er janvier 2016. Les ODD détermineront les politiques nationales de développement pour les 15 prochaines années. De l’élimination de la pauvreté et de la faim, aux réponses face aux changements climatiques et à l’exploitation de nos ressources naturelles, l’alimentation et l’agriculture sont au cœur du Programme 2030.",

        // Contacts
        rome: "Rome",
        italy: "Italie",
        info: "Info",

        explore_data: "Exploration des données",
        explore_data_title: "Données de l’alimentation et de l’agriculture",
        explore_data_text: "FAOSTAT fournit un accès libre aux données concernant l’alimentation et l’agriculture pour plus de 245 pays et 35 régions depuis 1961 jusqu’à l’année disponible la plus récente."

    });

});