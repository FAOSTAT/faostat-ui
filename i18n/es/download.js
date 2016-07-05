/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        related_documents: "Related Documents",
        selection_too_large:  "Selection is too large.",
        suggest_bulk_downloads:  "Please use the <strong>Bulk Downloads</strong> or reduce the selection.",
        suggest_bulk_downloads_or_table: "Please use the <strong>Bulk Downloads or Standard Table.</strong>",
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