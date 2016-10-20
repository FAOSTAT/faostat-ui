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
        development_goals: "الأغذية والزراعة في جدول أعمال 2030 للتنمية المستدامة",
        development_goals_text: "جدول أعمال 2030 للتنمية المستدامة، يتضمن جدول الأعمال أهداف التنمية المستدامة السبعة عشر، وهي الأهداف العالمية الجديدة التي تعقب الأهداف الإنمائية للألفية في 1 كانون الثاني/يناير 2016. والأهداف الإنمائية المستدامة ستشكل سياسات التنمية الوطنية للسنوات ال 15 القادمة. ويكمن القضاء على الفقر والجوع والاستجابة لتغير المناخ والحفاظ على مواردنا الطبيعية والأغذية والزراعة في صميم جدول أعمال عام 2030.",

        // Contacts
        rome: "Rome",
        italy: "Italy",
        info: "Info",

        explore_data: "Explore Data",
        explore_data_title: "Food and agriculture data",
        explore_data_text: "FAOSTAT provides free access to food and agriculture data for over 245 countries and territories and covers all FAO regional groupings <br> from 1961 to the most recent year available."

    });

});