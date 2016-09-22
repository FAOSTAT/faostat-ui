/*global define*/
define(function () {

    'use strict';

    return {

        NOT_AUTHORIZED: "fx.fenix.security.not_authorized",

        STATE_CHANGE: 'fx.fenix.state.change',
        MENU_UPDATE: 'fx.fenix.menu.change',

        NOTIFICATION_INFO: 'fs.notification.info',
        NOTIFICATION_WARNING: 'fs.notification.warning',
        NOTIFICATION_ERROR: 'fs.notification.error',
        NOTIFICATION_ACCEPT: 'fs.notification.accept',

        WAITING_SHOW : 'fs.waiting.show',
        WAITING_HIDE: 'fs.waiting.hide',

        LOADING_SHOW: 'fs.loading.show',
        LOADING_HIDE: 'fs.loading.hide',

        SEARCH_BOX_SHOW: 'fs.site.search_box.show',
        SEARCH_BOX_HIDE: 'fs.site.search_box.hide',

        GOOGLE_ANALYTICS_PAGE_VIEW: 'fs.google_analytics.page_view',
        GOOGLE_ANALYTICS_EVENT: 'fs.google_analytics.event',

        // Don't know if should be here..
        ON_FILTER_CHANGE: 'fs.filter_change.event',
        ON_FILTER_INVALID_SELECTION: 'fs.filter_change.invalid_selection.event',

        EXPORT_DATA: 'fs.export_data.event',
        EXPORT_TABLE_HTML: 'fs.export_table_html.event',
        EXPORT_MATRIX_DATA: 'fs.export_data_matrix.event',

        // MAP/CHART resize:
        WINDOW_RESIZE: 'fs.window.resize.event',

        // Selectors
        DOWNLOAD_SELECTION_CHANGE: 'fs.download.selection.event',

        // Metadata
        METADATA_SHOW: 'fs.metadata.show.event',

        // GO_TO
        SCROLL_TO_SELECTOR: 'fs.scroll.selector.event',

        GLOSSARY_SHOW: 'fs.glossary.show.event',
        DEFINITION_DOMAIN_SHOW: 'fs.definitions.domain.show.event',
        
        CONNECTION_PROBLEM: 'fs.connection.problem',

        ONBOARDING_DOWNLOAD: 'fs.onboarding.download'

    };
});
