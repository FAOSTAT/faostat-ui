/*global require, window */
var CDN = "//fenixrepo.fao.org/cdn/faostat",
    SUBMODULE = "../../submodules",
    locale = "@@locale",
    locale = (locale === "@@" + "locale")? "en" : locale;

require.config({

    /* Set the config for the i18n. */
    locale: locale,
    waitSeconds: 20,
    baseUrl: './src/js',
    paths: {

        // alias to the application
        nls: "../../i18n",
        config: "../../config",

        'fs-t-c': './lib/table',
        'fs-dt-c': './lib/datatable',

        jquery: CDN + '/js/jquery/2.2.3/jquery.min',
        bootstrap: CDN + "/js/bootstrap/3.3.4/js/bootstrap.min",
        underscore: CDN + "/js/underscore/1.7.0/underscore.min",
        "underscore.string": CDN + "/js/underscore.string/3.2.2/underscore.string.min",
        backbone: CDN + "/js/backbone/1.1.2/backbone.min",
        handlebars: CDN + "/js/handlebars/4.0.5/handlebars.min",
        chaplin: CDN + "/js/chaplin/1.1.1/chaplin.min",
        i18n: CDN + "/js/requirejs/plugins/i18n/2.0.4/i18n",
        text: CDN + '/js/requirejs/plugins/text/2.0.12/text',
        amplify: CDN + '/js/amplify/1.1.2/amplify.min',
        q: CDN + '/js/q/1.1.2/q',
        select2: CDN + '/js/select2/3.5.4/select2.min',
        loglevel: CDN + '/js/loglevel/1.4.0/loglevel',
        moment: CDN + '/js/moment/2.9.0/moment-with-locales.min',
        outdatedbrowser: CDN + '/js/outdatedbrowser/1.1.1/outdatedbrowser.min',
        swiper: CDN + '/js/swiper/3.3.1/dist/js/swiper.min',
        waves: CDN + '/js/node-waves/0.7.5/waves.min',
        'jquery.lazyload': CDN + '/js/jquery.lazyload/1.9.7/jquery.lazyload.min',
        bowser: CDN + '/js/bowser/1.4.6/src/bowser',
         'jquery.scrolling-tabs': './lib/jquery.scrolling-tabs/jquery.scrolling-tabs.min',

        // search
        typeahead: CDN + '/js/bootstrap-typeahead/0.11.1/typeahead.bundle.custom',
        bloodhound: CDN + '/js/bloodhound/0.11.1/bloodhound.min',
        bootpag: CDN + '/js/bootpag/1.0.7/jquery.bootpag.min',

        instafilta: CDN + '/js/instafilta/1.4.4/instafilta.min',
        jstree: CDN + '/js/jstree/3.3.2/dist/jstree.min',
        nprogress: CDN + '/js/nprogress/0.2.0/nprogress',
        'toastr': CDN + '/js/toastr/2.1.2/build/toastr.min',
        'jquery.rangeSlider': CDN + '/js/jquery.rangeslider/5.7.0/jQDateRangeSlider-min',
        'ion.rangeSlider': CDN + '/js/ion.rangeSlider/2.1.2/js/ion-rangeSlider/ion.rangeSlider.min',
        'jquery.visible': CDN + '/js/jquery.visible/1.2.0/jquery.visible.min',

        //pivot
        jbPivot: '../../submodules/faostat-ui-pivot/dist/js/jbPivot',
        pivot_exporter: '../../submodules/faostat-ui-pivot/src/js/PivotExporter',
        numeral: CDN + '/js/numeral/1.5.3/min/numeral.min',

        // Export
        FileSaver: CDN + '/js/FileSaver/1.1.2/FileSaver.min',
        Blob: CDN + '/js/blob/1.0/Blob',
        tableExport: CDN + '/js/tableExport.jquery.plugin/1.0/tableExport.min',

        sigma: 'https://cdnjs.cloudflare.com/ajax/libs/sigma.js/1.1.0/sigma.min',
        'sigma.parsers.json': 'https://cdnjs.cloudflare.com/ajax/libs/sigma.js/1.1.0/plugins/sigma.parsers.json.min',
        'sigma.plugins.dragNodes': 'https://cdnjs.cloudflare.com/ajax/libs/sigma.js/1.1.0/plugins/sigma.plugins.dragNodes.min',
        'sigma.plugins.relativeSize': 'https://cdnjs.cloudflare.com/ajax/libs/sigma.js/1.1.0/plugins/sigma.plugins.relativeSize.min',
        'sigma.plugins.animate': 'https://cdnjs.cloudflare.com/ajax/libs/sigma.js/1.1.0/plugins/sigma.plugins.animate.min',
        'sigma.plugins.neighborhoods': 'https://cdnjs.cloudflare.com/ajax/libs/sigma.js/1.1.0/plugins/sigma.plugins.neighborhoods.min',
        'sigma.layout.forceAtlas2': 'https://cdnjs.cloudflare.com/ajax/libs/sigma.js/1.1.0/plugins/sigma.layout.forceAtlas2.min',


        // TODO: move to CDN
        faostatapiclient: 'FAOSTATAPIClient.min',

        'bootstrap-table': CDN + '/js/bootstrap-table/1.9.1/bootstrap-table.min',
        'introjs': CDN + '/js/introjs/2.3.0/minified/intro.min',

        "datatables.net": CDN + '/js/DataTables/1.10.12/media/js/jquery.dataTables.min',
        "datatables.net-bs": CDN + '/js/DataTables/1.10.12/media/js/dataTables.bootstrap.min',
        'datatables-fixedcolumns': CDN + '/js/DataTables/1.10.12/extensions/FixedColumns/js/dataTables.fixedColumns.min',
        'datatables-fixedheader': CDN + '/js/DataTables/1.10.12/extensions/FixedHeader/js/dataTables.fixedHeader.min',
        'datatables-colreorder': CDN + '/js/DataTables/1.10.12/extensions/ColReorder/js/dataTables.colReorder.min',
        'datatables.net-buttons': CDN + '/js/DataTables/1.10.12/extensions/Buttons/js/dataTables.buttons.min',
        'datatables.net-buttons-bs': CDN + '/js/DataTables/1.10.12/extensions/Buttons/js/buttons.bootstrap.min',
        'datatables.net-buttons-html5': CDN + '/js/DataTables/1.10.12/extensions/Buttons/js/buttons.html5.min',
        'datatables-scroller': CDN + '/js/DataTables/1.10.12/extensions/Scroller/js/dataTables.scroller.min',

        // Maps
        'fenix-ui-map': '../../submodules/fenix-ui-map/dist/fenix-ui-map.min',
        'fenix-ui-map-config': '../../config/submodules/fx-map/fenix-ui-map-config',
        'jquery-ui': CDN + '/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
        'leaflet': CDN + '/js/leaflet/1.0.1/leaflet',
        'jquery.i18n.properties': CDN + '/js/jquery/1.0.9/jquery.i18n.properties-min',

        // Charts
        'highcharts': CDN + '/js/highcharts/5.0.0/js/highcharts',
        'highcharts-treemap': CDN + '/js/highcharts/5.0.0/js/modules/treemap',
        'highcharts-heatmap': CDN + '/js/highcharts/5.0.0/js/modules/heatmap',
        'highcharts-export': CDN + '/js/highcharts/5.0.0/js/modules/exporting',

        // PDFs
        'jspdf': CDN + '/js/jspdf/1.2.61/jspdf.min',
        'twitter': "//platform.twitter.com/widgets",

        // metadata viewer
        'fs-m-v/start': SUBMODULE + '/faostat-ui-metadata-viewer/src/js/start',
        'fs-m-v/html': SUBMODULE + '/faostat-ui-metadata-viewer/src/html',
        'fs-m-v/config': SUBMODULE + '/faostat-ui-metadata-viewer/config',
        'fs-m-v/nls': SUBMODULE + '/faostat-ui-metadata-viewer/nls',

        // menu
        FAOSTAT_UI_MENU: SUBMODULE + '/faostat-ui-menu/src/js/start',
        faostat_ui_menu: SUBMODULE + '/faostat-ui-menu/',

        // faostat-ui-download
        'fs-i-d/start': SUBMODULE + '/faostat-ui-download/src/js/start',
        'fs-i-d/html': SUBMODULE + '/faostat-ui-download/src/html',
        'fs-i-d/config': SUBMODULE + '/faostat-ui-download/src/js/config',
        'fs-i-d/nls': SUBMODULE + '/faostat-ui-download/nls',

        // faostat-ui-download-selectors-manager
        'fs-s-m/start': SUBMODULE + '/faostat-ui-download-selectors-manager/src/js/start',
        'fs-s-m/html': SUBMODULE + '/faostat-ui-download-selectors-manager/src/html',
        'fs-s-m/config': SUBMODULE + '/faostat-ui-download-selectors-manager/config',
        'fs-s-m/nls': SUBMODULE + '/faostat-ui-download-selectors-manager/nls',

        // faostat-ui-download-selector
        'fs-s/start': SUBMODULE + '/faostat-ui-download-selector/src/js/start',
        'fs-s/tab': SUBMODULE + '/faostat-ui-download-selector/src/js/tab',
        'fs-s/summary': SUBMODULE + '/faostat-ui-download-selector/src/js/summary',
        'fs-s/html': SUBMODULE + '/faostat-ui-download-selector/src/html',
        'fs-s/config': SUBMODULE + '/faostat-ui-download-selector/config',
        'fs-s/nls': SUBMODULE + '/faostat-ui-download-selector/nls',

        // faostat-ui-download-options
        'fs-d-o/start': SUBMODULE + '/faostat-ui-download-options/src/js/start',
        'fs-d-o/html': SUBMODULE + '/faostat-ui-download-options/src/html',
        'fs-d-o/config': SUBMODULE + '/faostat-ui-download-options/config',
        'fs-d-o/nls': SUBMODULE + '/faostat-ui-download-options/nls',

        // FAOSTAT_UI_TREE faostat-ui-tree
        FAOSTAT_UI_TREE: SUBMODULE + '/faostat-ui-tree/src/js/start',
        faostat_ui_tree: SUBMODULE + '/faostat-ui-trees/src/js',

        // FAOSTAT_UI_TABLE
        FAOSTAT_UI_PIVOT: SUBMODULE + '/faostat-ui-pivot/src/js/start',
        faostat_ui_pivot: SUBMODULE + '/faostat-ui-pivot/',

        // fenix-ui-dashboard (Dashboard)
        'fx-ds/start': SUBMODULE + '/fenix-ui-dashboard/src/js/start',
        'fx-ds/templates': SUBMODULE + '/fenix-ui-dashboard/src/js/templates',
        'fx-ds/config': SUBMODULE + '/fenix-ui-dashboard/config',
        'fx-ds': SUBMODULE + '/fenix-ui-dashboard/src/js',

        // fenix-ui-common
        'fx-common': SUBMODULE + '/fenix-ui-common/js',
        'fx-common/html': SUBMODULE + '/fenix-ui-common/html',
        'fx-common/config': SUBMODULE + '/fenix-ui-common/config',

        // fenix-ui-chart-creator
        'fx-c-c/start': SUBMODULE + '/fenix-ui-chart-creator/src/js/start',
        'fx-c-c/html': SUBMODULE + '/fenix-ui-chart-creator/src/html',
        'fx-c-c/config': SUBMODULE + '/fenix-ui-chart-creator/config',
        'fx-c-c/adapters': SUBMODULE + '/fenix-ui-chart-creator/src/js/adapters',
        'fx-c-c/templates': SUBMODULE + '/fenix-ui-chart-creator/src/js/templates',
        'fx-c-c/creators': SUBMODULE + '/fenix-ui-chart-creator/src/js/creators',
        'fx-c-c/nls': SUBMODULE + '/fenix-ui-chart-creator/nls',

        // fenix-ui-map-creator
        'fx-m-c/start': SUBMODULE + '/fenix-ui-map-creator/src/js/start',
        'fx-m-c/html': SUBMODULE + '/fenix-ui-map-creator/src/html',
        'fx-m-c/config/config':  '../../config/submodules/fx-map/config/config',
        'fx-m-c/config': SUBMODULE + '/fenix-ui-map-creator/config',
        'fx-m-c/config/adapters/FAOSTAT_fx_map':  '../../config/submodules/fx-map/config/adapters/FAOSTAT_fx_map',
        'fx-m-c/adapters': SUBMODULE + '/fenix-ui-map-creator/src/js/adapters',
        'fx-m-c/templates': SUBMODULE + '/fenix-ui-map-creator/src/js/templates',
        'fx-m-c/nls': SUBMODULE + '/fenix-ui-map-creator/i18n',

        // faostat-ui-report
        'fs-r-p/start': SUBMODULE + '/faostat-ui-report/src/js/start',
        'fs-r-p/html': SUBMODULE + '/faostat-ui-report/src/html',
        'fs-r-p/config': SUBMODULE + '/faostat-ui-report/config',
        'fs-r-p/nls': SUBMODULE + '/faostat-ui-report/nls',

        // faostat-ui-report-table
        'fs-r-t/start': SUBMODULE + '/faostat-ui-report-table/src/js/start',
        'fs-r-t/html': SUBMODULE + '/faostat-ui-report-table/src/html',
        'fs-r-t/config': SUBMODULE + '/faostat-ui-report-table/config',
        'fs-r-t/nls': SUBMODULE + '/faostat-ui-report-table/nls',

        // Google Analytics
        "ga": CDN + '/js/googleanalytics/0.3.7/analytics',
    },

    shim: {
        'jquery.lazyload': {
            deps: ["jquery"]
        },
        waves: {
            deps: ["jquery"]
        },
        swiper: {
            deps: ["jquery"]
        },
        amplify: {
            deps: ["jquery"]
        },
        "tableExport": {
            deps: ["jquery", 'FileSaver']
        },
        "FileSaver": {
            deps: ["jquery", 'Blob']
        },
        "bloodhound": {
            deps: ["jquery"],
            exports: "Bloodhound"
        },
        typeahead: {
            deps: ["jquery"]
        },
        bootpag: {
            deps: ["jquery", "bootstrap"]
        },
        bootstrap: {
            // jquery-ui is needed because overrides bootstrap e.g. tooltip
            deps: ["jquery", "jquery-ui"]
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        handlebars: {
            exports: 'Handlebars'
        },
        faostatapiclient: {
            deps: ['jquery']
        },
        jbPivot: {
            deps: ['jquery', 'jquery-ui']
        },
        'jquery.rangeSlider': {
            deps: ['jquery', 'jquery-ui']
        },
        'jquery.visible': {
            deps: ['jquery']
        },
        'ion.rangeSlider': {
            deps: ['jquery']
        },
        "ga": {
            exports: "__ga__"
        },
        jspdf: {
            exports: 'jsPDF'
        },
        instafilta: {
            deps: ['jquery']
        },
        // Maps
        'jquery-ui': ['jquery'],
        'jquery.i18n.properties': ['jquery'],
        'fenix-ui-map': {
            deps: [
                'jquery',
                'jquery-ui',
                'leaflet',
                'fenix-ui-map-config',
                'jquery.i18n.properties'
            ]
        },
        // Charts
        "highcharts": {
            "exports": "Highcharts",
            "deps": ["jquery"]
        },
        "highcharts-export": {
            "deps": ["highcharts"]
        },
        "highcharts-export-csv": {
            "deps": ["highcharts", "highcharts-export"]
        },
        "highcharts-heatmap": {
            "deps": ["highcharts"]
        },
        "highcharts-treemap": {
            "deps": ["highcharts"]
        },
        "datatables.bs": {
            "deps": ["jquery", "bootstrap"],
            "export": "DataTables"
        },
        "datatables.net": {
            "deps": ["jquery"]
        },
        "datatables.net-bs":{
            "deps": ["datatables.net"]
        },
        "datatables-fixedcolumns": {
            "deps": ["datatables.net"]
        },
        "datatables.net-buttons": {
            "deps": ["datatables.net"]
        },
        "datatables.net-buttons-bs": {
            "deps": ["datatables.net-buttons"]
        },
        "datatables.net-responsive-bs": {
            "deps": ["datatables-responsive", "datatables.net-buttons-html5"]
        },
        "datatables-responsive": {
            "deps": ["datatables.net"]
        },
        "datatables-scroller": {
            "deps": ["datatables.net"]
        },
        "jquery.scrolling-tabs": {
            "deps": ["jquery"]
        },
        "sigma": {
            "export": "sigma"
        },
        "sigma.parsers.json": {
            deps: ["sigma"]
        },
        "sigma.plugins.dragNodes": {
            deps: ["sigma"]
        },
        "sigma.plugins.relativeSize": {
            deps: ["sigma"]
        },
        "sigma.plugins.animate": {
            deps: ["sigma"]
        },
        "sigma.plugins.neighborhoods": {
            deps: ["sigma"]
        },
        "sigma.layout.forceAtlas2": {
            deps: ["sigma"]
        }
    }
});

// Google Analytics
window.GoogleAnalyticsObject = "__ga__";
window.__ga__ = {l: Date.now()};

// Bootstrap the application
require([
    'jquery',
    'application',
    'routes',
    'config/Config',
    'globals/Common',
    'nprogress'
], function ($, Application, routes, C, Common, NProgress) {

    "use strict";

    NProgress.start();

    // set locale
    Common.setLocale(locale);
    Common.setLocaleAPI(locale);

    // init application
    var app = new Application({
        routes: routes,
        root: C.CHAPLINJS_PROJECT_ROOT,
        scrollTo: C.CHAPLINJS_SCROLL_TO,
        pushState: C.CHAPLINJS_PUSH_STATE,
        controllerSuffix: C.CHAPLINJS_CONTROLLER_SUFFIX
    });

});