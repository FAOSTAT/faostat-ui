/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        about: 'About',
        related_documents: 'Related Documents',
        go_to_section: 'Go To Section',

        faostat_domains: 'FAOSTAT Domains',
        preview_options_label: 'Preview Options',
        download_as_label: 'Download as...',
        preview: 'Preview Data',
        welcome_page: 'About',
        report: 'Report',

        interactive_download_welcome: 'Use this section to create a custom query to extract data from the current domain. Please use the selectors below to filter the data according to your needs. Press the <var>Preview</var> button to have an overview of your selection. Use the <var>Preview Options</var> button to customize the final output. Click on <var>Download CSV</var> to get the data CSV format. Please consider to visit the <var>Bulk Downloads</var> sections if you need all the data contained in this domain.',
        report_download_welcome: 'Use this section to create a custom report from the current domain. Please use the selectors below to filter the data according to your needs. Press the <var>Preview</var> button to show the report. Use the <var>Download Report</var> to download the report table.',

        domains_list_description_bulk: "Click on the list below to go to the Domain Bulk download section",
        domains_list_description_interactive_download: "Click on the list below to go to the Domain Interactive Download section",
        domains_list_description_metadata: "Click on the list below to go to the Domain Metadata section",

        suggest_bulk_downloads:  "Selection is too large. Please use the bulk downloads.",
        suggest_bulk_downloads_or_table: "Selection is too large. Please use the bulk downloads or standard table.",

    });

});