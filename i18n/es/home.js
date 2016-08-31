/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        // bulk downloads
        bulk_download: "Todos los datos",
        all_faostat_data: "All FAOSTAT Data",
        updated_on: "Updated on",

        // database updates
        database_updates: "Actualizaciones de la base de datos",

        // Statistical Yearbook
        fao_statistical_yearbooks: "Anuarios estadísticos de la FAO",
        fao_statistical_yearbooks_text: "L'Annuaire statistique de la FAO fournit une sélection d'indicateurs par pays sur l'alimentation et l'agriculture. <br><br> The first part of the book includes thematic spreads with data visualizations (graphs, charts, and maps) with basic text. The second part has country-level tables for a selected number of indicators.",

        // country indicators
        country_indicators_text: "Country indicators provide an overview of key indicators and charts by country.",

        // Rankings
        rankings_text: "Rankings indicators provide an overview of key indicators and charts by commodity.",

        // Food security in the 2030 Agenda for Sustainable Development
        development_goals: "La alimentación y la agricultura en la Agenda 2030 para el Desarrollo Sostenible",
        development_goals_text: "La Agenda 2030 para el Desarrollo Sostenible, incluyendo los 17 Objetivos de Desarrollo Sostenible (ODS) son los nuevos objetivos que sucederán a los Objetivos de Desarrollo del Milenio a partir del primero de enero de 2016. Los ODS darán forma a los planes nacionales de desarrollo nacional por los próximos 15 años. Erradicar la pobreza y el hambre, combatir el cambio climático y proteger nuestros recursos naturales, la alimentación y la agricultura están en el centro de la Agenda de 2030.",

        // Contacts
        rome: "Roma",
        italy: "Italia",
        info: "Info",

        explore_data: "Explore Data",
        explore_data_title: "Food and agriculture data",
        explore_data_text: "FAOSTAT provides free access to food and agriculture data for over 245 countries and 35 regional areas from 1961 to the most recent year available."

    });

});