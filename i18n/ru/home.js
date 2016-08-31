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
        development_goals: "Продовольствие и сельское хозяйство в повестке дня в области устойчивого развития на период до 2030 года",
        development_goals_text: "Повестка дня в области устойчивого развития на период до 2030 года включает в себя 17 целей в области устойчивого развития (ЦУР), которые являются новыми международными целями, сменившими Цели в области развития 1 января 2016 года. ЦУР будут определять национальную политику в области развития в ближайшие 15 лет. Продовольствие и сельское хозяйство находятся в центре внимания данной повестки дня, начиная с ликвидации нищеты и голода до борьбы с изменением климата и сохранения природных ресурсов.",

        // Contacts
        rome: "Рим",
        italy: "Италия",
        info: "Информация",

        explore_data: "Explore Data",
        explore_data_title: "Food and agriculture data",
        explore_data_text: "FAOSTAT provides free access to food and agriculture data for over 245 countries and 35 regional areas from 1961 to the most recent year available."

    });

});