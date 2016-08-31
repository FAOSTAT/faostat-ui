/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        // bulk downloads
        bulk_download: "Données Complètes",
        all_faostat_data: "All FAOSTAT Data",
        updated_on: "Updated On",

        // database updates
        database_updates: "Mise à jour de la base de données",

        // Statistical Yearbook
        fao_statistical_yearbooks: "Annuaire statistique de la FAO",
        fao_statistical_yearbooks_text: "L’Annuaire statistique de la FAO fournit une sélection d’indicateurs par pays sur l’alimentation et l’agriculture. <br><br> The first part of the book includes thematic spreads with data visualizations (graphs, charts, and maps) with basic text. The second part has country-level tables for a selected number of indicators.",

        // country indicators
        country_indicators_text: "Country indicators provide an overview of key indicators and charts by country.",

        // Rankings
        rankings_text: "Rankings indicators provide an overview of key indicators and charts by commodity.",

        // Food security in the 2030 Agenda for Sustainable Development
        development_goals: "L’alimentation et l’agriculture dans le Programme de développement durable à l’horizon 2030",
        development_goals_text: "Le Programme de développement durable à l’horizon 2030 inclut 17 Objectifs de développement durable (ODD) devenus les nouveaux objectifs mondiaux qui ont succédé aux Objectifs du Millénaire pour les développement le 1er janvier 2016. Les ODD détermineront les politiques nationales de développement pour les 15 prochaines années. De l’élimination de la pauvreté et de la faim, aux réponses face aux changements climatiques et à l’exploitation de nos ressources naturelles, l’alimentation et l’agriculture sont au cœur du Programme 2030.",

        // Contacts
        rome: "Rome",
        italy: "Italie",
        info: "Info",

        explore_data: "Explore Data",
        explore_data_title: "Food and agriculture data",
        explore_data_text: "FAOSTAT provides free access to food and agriculture data for over 245 countries and 35 regional areas from 1961 to the most recent year available."

    });

});