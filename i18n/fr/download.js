/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        related_documents: "Related Documents",

        suggest_bulk_downloads:  "Selection is too large. <br> Please use the bulk downloads.",
        suggest_bulk_downloads_or_table: "Selection is too large. <br> Please use the bulk downloads or standard table.",

        search_for_a_domain: "Search for a Domain e.g. crops, food security, fertilizers"

    });

});