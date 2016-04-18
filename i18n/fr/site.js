/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        fao: 'Food and Agriculture Organization of the United Nations',
        statistics_division: 'Statistics Division',
        feedback_system: 'Système De Feedbacks ',
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

        home: 'Accueil',
        browse: 'Explorer Données',
        indicators: 'Indicators',
        download: 'Télécharger Données',
        compare: 'Comparer Données',
        search: 'Rechercher Données',
        mes: 'Méthodes & Standards',
        fao_label: 'Food and Agriculture Organization of the United Nations',
        ess_label: 'Statistics Division'

    });

});