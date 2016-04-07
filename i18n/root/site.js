/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        fao: 'Food and Agriculture Organization of the United Nations',
        statistics_division: 'Statistics Division',
        feedback_system: 'Feedback System',
        territorial_notes: 'Country / Territorial Notes',
        territorial_notes_info: 'A dispute exists between the Governments of Argentina and the United Kingdom of Great Britain and Northern Ireland concerning sovereignty over the Falkland Islands (Malvinas).',

        menu: 'Menu',
        help_us: 'Help Us',

        // fao_links
        fao_links: 'FAO Links',
        division_ess: 'Statistics Division (ESS)',
        department_es: 'Economic and Social Development Department',
        countrystat: 'CountrySTAT',
        acquastat: 'AcquaSTAT',
        fisheries_and_aquaculture: 'Fisheries and Acquaculture',
        forestry: 'Forestry',

        toggle_navigation: 'toggle_navigation',
        home: 'Home',
        browse: 'Browse Data',
        download: 'Download Data',
        compare: 'Compare Data',
        search: 'Search Data',
        analysis: 'Analysis',
        mes: 'Methods & Standards',
        fao_label: 'Food and Agriculture Organization of the United Nations',
        ess_label: 'Statistics Division'

    });

});