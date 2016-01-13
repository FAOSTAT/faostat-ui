/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        about: 'About',
        interactive_download_title: 'Interactive Download',
        bulk_downloads_title: 'Bulk Downloads',
        metadata_title: 'Metadata',
        related_documents: 'Related Documents',
        no_docs_available: 'No documents avaiable for',
        go_to_section: 'Go To Section'

    });

});