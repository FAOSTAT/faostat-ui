/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        // bulk downloads
        bulk_download: "Bulk Download",
        all_faostat_data: "All FAOSTAT Data",
        updated_on: "Updated on",

        // database updates
        database_updates: "Database Updates",

        // Statistical Yearbook
        fao_statistical_yearbooks: "FAO Statistical Yearbooks",
        fao_statistical_yearbooks_text: "The FAO Statistical Yearbook provides a selection of indicators on food and agriculture by country. <br><br> The first part of the book includes thematic spreads with data visualizations (graphs, charts, and maps) with basic text. The second part has country-level tables for a selected number of indicators.",

        // country indicators
        country_indicators: "Country Indicators",
        country_indicators_text: "Country indicators provide an overview of key indicators and charts by country.",

        // Rankings
        rankings: "Rankings",
        rankings_text: "Rankings indicators provide an overview of key indicators and charts by commodity.",

        // Food security in the 2030 Agenda for Sustainable Development
        development_goals: "Food security in the 2030 Agenda for Sustainable Development",
        development_goals_text: "The 2030 Agenda for Sustainable Development, including the 17 Sustainable Development Goals (SDGs), are new global objectives that succeeded the Millennium Development Goals on 1 January 2016. The SDGs will shape national development plans over the next 15 years. From ending poverty and hunger to responding to climate change and sustaining our natural resources, food and agriculture lies at the heart of the 2030 Agenda.",

        // Contacts
        rome: "Rome",
        italy: "Italy",
        info: "Info",

        explore_data: "Explore Data",
        explore_data_title: "Food and agriculture data",
        explore_data_text: "FAOSTAT provides free access to food and agriculture data for over 245 countries and territories and covers all FAO regional groupings <br> from 1961 to the most recent year available."

    });

});