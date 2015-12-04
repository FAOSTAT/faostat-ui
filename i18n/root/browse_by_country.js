/*global define*/
define(['jquery', 'i18n!nls/browse'], function ($, I18N) {

    'use strict';

    return $.extend(true, {}, I18N, {

        filter_results: 'Search Country',
        sort_by_country: 'Sort by Country name',
        back_to_country_list: "Back to countries' list",
        country_list: "Country List"

    });

});