/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        home_welcome_title : 'Welcome to the FAOSTAT prototype',

        featured_links: 'Featured Links',
        whats_new: "What's new in FAOSTAT?",
        coming_up: "Coming Up",

        // info box
        info_box_title: "FAO Statistical Pocketbook 2015",
        info_box_text: "This publication is part of the FAO Statistical Yearbook suite of products. <br><br> The first part of the book includes thematic spreads with data visualizations (graphs, charts, and maps) with basic text. <br><br>  The second part has country-level tables for a selected number of indicators.",
        info_box_link: "<a target='_blank' href='http://www.fao.org/economic/ess/ess-publications/ess-yearbook/en/#.VlXSE3arSG-'>Pocketbook</a>",

        // featured links
        faostat_database_download: 'Download all FAOSTAT Data',

        // partners
        partners: 'Partners',

        // database updates
        database_updates: "Database Updates",

        release_calendar: "Release Calendar",

        // chart
        chart_title: 'Highlights',
        chart_subtitle: 'Number of undernourished declining',
        chart_measurement_unit: 'Millions of people',

        // contact us
        contact_us: 'Contact Us',
        department_ess: 'Economic and Social Development Department',
        address_fao: 'Viale delle Terme di Caracalla 00153 Rome, Italy',

        download: "Télécharger",
        browse: "Explorer"

    });

});