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
        development_goals: "2030年可持续发展议程》中的粮食与农业",
        development_goals_text: "2030年可持续发展议程》包括了17个可持续发展目标（SDGs），这些新的全球性目标在2016年1月帮助实现了千年发展目标。该SDGs将帮助塑造未来十五年的国家发展机会。<br><br>从消除贫困与饥饿到应对气候变化和维护我们的自然资源，粮食与农业是2030年议程的核心重点。",

        // Contacts
        rome: "Rome",
        italy: "Italy",
        info: "Info",

        explore_data: "Explore Data",
        explore_data_title: "Food and agriculture data",
        explore_data_text: "FAOSTAT provides free access to food and agriculture data for over 245 countries and territories and covers all FAO regional groupings <br> from 1961 to the most recent year available."

    });

});