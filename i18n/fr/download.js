/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        related_documents: "Related Documents",
        suggest_bulk_downloads:  "Selection is too large. <br> Please use the bulk downloads.",
        suggest_bulk_downloads_or_table: "Selection is too large. <br> Please use the bulk downloads or standard table.",
        search_for_a_domain: "Search for a Domain e.g. crops, food security, fertilizers",
        "back_to_domains_list": "Back to domains' list",
        "download_data": "Download Data",
        "visualize_data": "Visualize Data",
        "last_update": "Last Update",
        "full_metadata": "Full Metadata",
        "contacts_email": "Contacts Email",
        "show_data": "Show Data",
        "where_is_the_data": "Where is the data?",
        "show_data_info_message": "Please make a selection above and press <i>Show Data</i>"

    });

});