/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

            title: 'Download Data',
            tree_title: 'FAOSTAT Domains',
            metadata_label: 'Metadata',
            interactive_download_label: 'Interactive Download',
            bulk_downloads_label: 'Bulk Download',
            download_as_label: 'Download as...',
            preview_options_label: 'Preview Options',
            preview_label: 'Preview',
            error: 'Error',
            warning: 'Please Note',
            preview_courtesy_message: 'Please use the <kbd>Preview</kbd> button to enable the options.',

        });
});
