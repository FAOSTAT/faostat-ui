define(function () {

    'use strict';

    var DashboardEventsCatalog = {
        CHART_READY : 'fx.component.chart.ready',
        TABLE_READY : 'fx.component.table.ready',
        REFRESH_GRID_ITEM: 'fx.component.dashboard.refresh.grid.item',
        RESIZE_GRID_ITEM: 'fx.component.dashboard.resize.grid.item',
        GRID_ITEM_RE_SIZED: 'fx.component.dashboard.grid.item.resized',
        WIDGET_COLLECTION_READY: 'fx.component.dashboard.collection.ready'
    };

    return DashboardEventsCatalog;
});
