/*global require, window, $, amplify*/
var CDN = "//fenixrepo.fao.org/cdn/faostat",
    SUBMODULE = "../../submodules",
    locale = "@@locale",
    testLocale = "@@" + "locale";
if (locale === testLocale) {
    locale = 'en';
}
var config = {

    /* Set the config for the i18n. */
    locale: locale,
    waitSeconds: 20,
    baseUrl: './src/js',
    paths: {

        // alias to the application
        nls: "../../i18n",
        config: "../../config",
        json: "../../json",

        //'faostat-ui/nls': "../../i18n/",
        //'faostat-ui/config': "../../config/",
        //'faostat-ui': "./",

        // TODO: switch to submodule? */
        'fs-t-c': './lib/table',
        'fs-dt-c': './lib/datatable',

        jquery: CDN + '/js/jquery/2.2.3/jquery.min',
        bootstrap: CDN + "/js/bootstrap/3.3.4/js/bootstrap.min",
        underscore: CDN + "/js/underscore/1.7.0/underscore.min",
        "underscore.string": CDN + "/js/underscore.string/3.2.2/underscore.string.min",
        backbone: CDN + "/js/backbone/1.1.2/backbone.min",
        handlebars: CDN + "/js/handlebars/4.0.5/handlebars.min",
        chaplin: CDN + "/js/chaplin/1.1.1/chaplin.min",
        domReady: CDN + "/js/requirejs/plugins/domready/2.0.1/domReady", // not used
        i18n: CDN + "/js/requirejs/plugins/i18n/2.0.4/i18n",
        text: CDN + '/js/requirejs/plugins/text/2.0.12/text',
        rsvp: CDN + '/js/rsvp/3.0.17/rsvp', // not used
        amplify: CDN + '/js/amplify/1.1.2/amplify.min',
        select2: CDN + '/js/select2/3.5.4/select2.min',
        loglevel: CDN + '/js/loglevel/1.4.0/loglevel',
        moment: CDN + '/js/moment/2.9.0/moment-with-locales.min',
        outdatedbrowser: CDN + '/js/outdatedbrowser/1.1.1/outdatedbrowser.min',
        swiper: CDN + '/js/swiper/3.3.1/dist/js/swiper.min',
        waves: CDN + '/js/node-waves/0.7.5/waves.min',
        modernizr: CDN + '/js/modernizr/3.3.1/modernizr-custom',
        'jquery.lazyload': CDN + '/js/jquery.lazyload/1.9.7/jquery.lazyload.min',

        typeahead: CDN + '/js/bootstrap-typeahead/0.11.1/typeahead.bundle.custom',
        bloodhound: CDN + '/js/bloodhound/0.11.1/bloodhound.min',
        bootpag: CDN + '/js/bootpag/1.0.7/jquery.bootpag.min', // not used
        instafilta: CDN + '/js/instafilta/1.4.4/instafilta.min',
        jstree: CDN + '/js/jstree/3.3.2/dist/jstree.min',

        nprogress: CDN + '/js/nprogress/0.2.0/nprogress',

        'toastr': CDN + '/js/toastr/2.1.2/build/toastr.min',

        q: CDN + '/js/q/1.1.2/q',
        'jquery.rangeSlider': CDN + '/js/jquery.rangeslider/5.7.0/jQDateRangeSlider-min',
        'jquery-ui': CDN + '/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
        'ion.rangeSlider': CDN + '/js/ion.rangeSlider/2.1.2/js/ion-rangeSlider/ion.rangeSlider.min',

        'jquery.visible': CDN + '/js/jquery.visible/1.2.0/jquery.visible.min',

        jbPivot: '../../submodules/faostat-ui-pivot/dist/js/jbPivot',
        pivot_exporter: '../../submodules/faostat-ui-pivot/src/js/PivotExporter',
        swal: CDN + '/js/sweet-alert/0.5.0/sweet-alert.min',
        numeral: CDN + '/js/numeral/1.5.3/min/numeral.min',

        'draggabilly': CDN + '/js/draggabilly/2.1.0/dist/draggabilly.pkgd.min',
        'packery': CDN + '/js/packery/1.4.3/dist/packery.pkgd.min',

        // Export
        FileSaver: CDN + '/js/FileSaver/1.1.2/FileSaver.min',
        Blob: CDN + '/js/blob/1.0/Blob',
        tableExport: CDN + '/js/tableExport.jquery.plugin/1.0/tableExport.min',


        // TODO: move to CDN
        /* FAOSTAT API's client. */
        faostatapiclient: 'FAOSTATAPIClient.min',
        //list: '//fenixrepo.fao.org/cdn/js/list/1.1.1/list.min',
        //list_pagination: '//raw.githubusercontent.com/javve/list.pagination.js/v0.1.1/dist/list.pagination.min',

        // boostrap plugins
        'bootstrap-table': CDN + '/js/bootstrap-table/1.9.1/bootstrap-table.min',
        //'bootstrap-treeview': CDN + '/js/boostrap-treeview/1.2.0/bootstrap-treeview.min',
        'hopscotch': CDN + '/js/hopscotch/0.2.6/dist/js/hopscotch.min',
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

        // aos
        aos: CDN + '/js/aos/2.0.4/dist/aos',

        // holmes
        //holmes: '//raw.githubusercontent.com/Haroenv/holmes/gh-pages/js/holmes',
        //microlight: '//raw.githubusercontent.com/Haroenv/holmes/gh-pages/js/microlight',

        // Maps
        // Leaflet
        'leaflet': CDN + '/js/leaflet/0.7.7/leaflet',
        //'import-dependencies':CDN + '/js/FENIX/utils/import-dependencies-1.0',
        //'jquery.power.tip': CDN + '/js/jquery.powertip/1.2.0/jquery.powertip.min',
        //'jquery-ui': CDN + '/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
        'jquery.i18n.properties': CDN + '/js/jquery/1.0.9/jquery.i18n.properties-min',
        //'jquery.hoverIntent': CDN + '/js/jquery.hoverIntent/1.8.0/jquery.hoverIntent.min',
        //'chosen': CDN + '/js/chosen/1.2.0/chosen.jquery.min',

        // leaflet-image
        //'leaflet-image': '//api.tiles.mapbox.com/mapbox.js/plugins/leaflet-image/v0.0.4/leaflet-image',
        'leaflet-image': 'lib/leaflet-image',
        // fenix-ui-map
        'fenix-ui-map': '../../submodules/fenix-ui-map/dist/fenix-ui-map.min',
        //'fenix-ui-map-config': '../../submodules/fenix-ui-map/dist/fenix-ui-map-config',
        'fenix-ui-map-config': '../../config/submodules/fx-map/fenix-ui-map-config',



        // Charts
        'highcharts': CDN + '/js/highcharts/4.2.5/js/highcharts',
        'highstock': CDN + '/js/highstock/2.1.9/js/highstock',

        'highcharts-more': CDN + '/js/highcharts/4.2.5/js/highcharts-more',
        // highcharts plugins TODO: switch to CDN if they are going to be used
        'highcharts-treemap': CDN + '/js/highcharts/4.2.5/js/modules/treemap',
        'highcharts-heatmap': CDN + '/js/highcharts/4.2.5/js/modules/heatmap',
        'highcharts-export': CDN + '/js/highcharts/4.2.5/js/modules/exporting',
        'highcharts-regression':'//rawgithub.com/phpepe/highcharts-regression/master/highcharts-regression',


        // highchart client side exporting
        'highcharts-export-clientside': CDN + '/js/highcharts-export-clientside/1.1.4/highcharts-export-clientside',

        'canvas-tools': '//a----.github.io/highcharts-export-clientside/bower_components/highcharts/modules/canvas-tools',

        //'highcharts-export': '{FENIX_CDN}/js/highcharts/4.0.4/js/modules/exporting',
        'highcharts-export-csv': 'http://highslide-software.github.io/export-csv/export-csv',

        // PDFs
        'jspdf': CDN + '/js/jspdf/1.2.61/jspdf.min',
        'screenfull': CDN + '/js/screenfull/3.0.0/screenfull.min',


        "twitter": "//platform.twitter.com/widgets",

        // submodules

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

        /* Google Analytics */
        // "ga": "//www.google-analytics.com/analytics"
        // TODO: not sure about the version (it is taken from www.google-analytics.com/analytics)
        "ga": CDN + '/js/googleanalytics/0.3.7/analytics'

    },

    shim: {
        modernizr: {
            exports: 'Modernizr'
        },
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
        'bootstrap-tour': {
            deps: ["jquery", "bootstrap"],
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
        "gt_msg": ['jquery'],
        "gt_msg_grid": ['jquery', 'gt_msg'],
        faostatapiclient: {
            deps: ['jquery']
        },
        'jqueryui': {
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
        'leaflet-image': {
            deps: ['leaflet']
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
        /*'bootstrap-notify': {
         deps: ['jquery']
         }*/

        // maps
        'jquery-ui': ['jquery'],
        'jquery.power.tip': ['jquery'],
        'jquery.i18n.properties': ['jquery'],
        'fenix-ui-map': {
            deps: [
                'jquery',
                'jquery-ui',
                'leaflet',
                'fenix-ui-map-config',
                //'jquery.power.tip',
                'jquery.i18n.properties'
            ]
        },

        // charts
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
        "highcharts-treemap": {
            "deps": ["highcharts", "highcharts-heatmap"]
        },
        "highcharts-heatmap": {
            "deps": ["highcharts"]
        },
        "highcharts-more": {
            "deps": ["highcharts"]
        },
        "highcharts-export-clientside": {
            "deps": ["highcharts", "canvas-tools", 'jspdf']
        },
        "highcharts-regression": {
            "deps": ["highcharts"]
        },
        "datatables.bs": {
            "deps": ["jquery", "bootstrap"],
            export: "DataTables"
        },
        "datatables.net": {
            "deps": ["jquery"],
        },
        "datatables.net-bs":{
            //export: "DataTables"
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
        }

    }
};


// Google Analytics
window.GoogleAnalyticsObject = "__ga__";
window.__ga__ = {
    //q: [["create", "UA-68486942-1", "auto"]],
    l: Date.now()
};

require.config(config);

/* Bootstrap the application. */
require([
    'jquery',
    'application',
    'routes',
    'config/Config',
    'globals/Common',
    'config/Events',
    'globals/GoogleAnalyticsManager',
    'loglevel',
    'waves',
    'nprogress',
    'faostatapiclient',
    'outdatedbrowser',
    'amplify'
], function ($, Application, routes, C, Common, E, GoogleAnalyticsManager, log, Waves, NProgress, API) {

    "use strict";

    NProgress.start();

    // outdatedBrowser. Has been moved here to avoid Google indexing it.
    $('body').append('<div id="outdated"><h6>Your browser is out of date!</h6><p>Update your browser to view this website correctly. <a id="btnUpdateBrowser" href="http://outdatedbrowser.com/">Update my browser now </a></p> <p class="last"><a href="#" id="btnCloseUpdateBrowser" title="Close">&times;</a></p></div>');
    outdatedBrowser({
        bgColor: '#f25648',
        color: '#ffffff',
        lowerThan: 'transform',
        languagePath: ''
    });

    // store locale
    Common.setLocale(locale);
    Common.setLocaleAPI(locale);

    // add language
    $('body').addClass(locale);

    // init wave effect
    Waves.init();

    // setting global log level
    log.setLevel(C.LOGLEVEL);

    // config api
    API.config({
        base_url: C.URL_API,
        lang: Common.getLocaleAPI(),
        log: C.API_LOG
    });

    if (C.DATASOURCE !== null) {
        API.config({
            datasource: C.DATASOURCE
        });
    }

    // bootstrap the application
    var app = new Application({
        routes: routes,
        root: C.CHAPLINJS_PROJECT_ROOT,
        scrollTo: C.CHAPLINJS_SCROLL_TO,
        pushState: C.CHAPLINJS_PUSH_STATE,
        controllerSuffix: C.CHAPLINJS_CONTROLLER_SUFFIX
    });

});