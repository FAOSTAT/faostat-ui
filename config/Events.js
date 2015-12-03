/*global define*/
define(function () {

    'use strict';

    return {

        NOT_AUTHORIZED: "fx.fenix.security.not_authorized",

        STATE_CHANGE: 'fx.fenix.state.change',
        MENU_UPDATE: 'fx.fenix.menu.change',

        NOTIFICATION_INFO: 'fs.notification.info',
        NOTIFICATION_WARNING: 'fs.notification.warning',
        NOTIFICATION_ACCEPT: 'fs.notification.accept',

        WAITING_SHOW : 'fs.waiting.show',
        WAITING_HIDE: 'fs.waiting.hide',

        LOADING_SHOW: 'fs.loading.show',
        LOADING_HIDE: 'fs.loading.hide',

        GOOGLE_ANALYTICS_PAGE_VIEW: 'fs.google_analytics.page_view',
        GOOGLE_ANALYTICS_EVENT: 'fs.google_analytics.event',

        // Don't know if should be here..
        ON_FILTER_CHANGE: 'fs.filter_change.event',

        EXPORT_DATA: 'fs.export_data.event',

        // MAP:
        MAP_REFRESH: 'fs.map.invalidate_size.event'

    };
});
