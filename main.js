/*global require*/
require([
    './submodules/fenix-ui-common/js/Compiler',
    './submodules/fenix-ui-common/js/paths',
    './submodules/faostat-ui-tree/src/js/paths',
    './submodules/fenix-ui-map-creator/src/js/paths',
    './submodules/fenix-ui-chart-creator/src/js/paths',
    './submodules/fenix-ui-dashboard/src/js/paths',
    './submodules/faostat-ui-metadata-viewer/js/paths',
    './submodules/fenix-ui-reports/src/js/paths',
    './submodules/faostat-ui-bulk-downloads/src/js/paths',
    './submodules/faostat-ui-download-selectors-manager/src/js/paths',
    './submodules/faostat-ui-menu/src/js/paths',
    './submodules/faostat-ui-options-manager/src/js/paths',
    './submodules/json-editor-faostat-theme/src/js/paths',
    './submodules/faostat-ui-download-options/src/js/paths',
    './submodules/faostat-ui-download-selector/src/js/paths',
    './submodules/faostat-ui-table/src/js/paths',
    './submodules/faostat-ui-pivot/src/js/paths',
    './submodules/faostat-ui-download/src/js/paths'
], function (Compiler, Common, Tree, MapCreator, ChartCreator, Dashboard, MetadataViewer, Reports,
             BulkDownloads, DownloadSelectorsManager, FAOSTATMenu, OptionsManager, FAOSTATTheme,
             DownloadOptions, DownloadSelector, Table, Pivot,
             Download) {

    'use strict';

    var submodules_path = '../../submodules/',
        commonConfig = Common,
        treeConfig = Tree,
        mapConfig = MapCreator,
        chartConfig = ChartCreator,
        metadataConfig = MetadataViewer,
        reportsConfig = Reports,
        dashboardConfig = Dashboard,
        bulkDownloadsConfig = BulkDownloads,
        downloadSelectorsManagerConfig = DownloadSelectorsManager,
        faostatMenuConfig = FAOSTATMenu,
        optionsManagerConfig = OptionsManager,
        faostatThemeConfig = FAOSTATTheme,
        downloadOptionsConfig = DownloadOptions,
        downloadSelectorConfig = DownloadSelector,
        tableConfig = Table,
        pivotConfig = Pivot,
        downloadConfig = Download;

    treeConfig.baseUrl = submodules_path + '/faostat-ui-tree/src/js';
    commonConfig.baseUrl = submodules_path + 'fenix-ui-common/js';
    mapConfig.baseUrl = submodules_path + '/fenix-ui-map-creator/src/js';
    reportsConfig.baseUrl = submodules_path + '/fenix-ui-reports/src/js';
    chartConfig.baseUrl = submodules_path + '/fenix-ui-chart-creator/src/js';
    dashboardConfig.baseUrl = submodules_path + '/fenix-ui-dashboard/src/js';
    metadataConfig.baseUrl = submodules_path + '/faostat-ui-metadata-viewer/js';
    bulkDownloadsConfig.baseUrl = submodules_path + '/faostat-ui-bulk-downloads/src/js';
    downloadSelectorsManagerConfig.baseUrl = submodules_path + '/faostat-ui-download-selectors-manager/src/js';
    faostatMenuConfig.baseUrl = submodules_path + '/faostat-ui-menu/src/js';
    optionsManagerConfig.baseUrl = submodules_path + '/faostat-ui-options-manager/src/js';
    faostatThemeConfig.baseUrl = submodules_path + '/json-editor-faostat-theme/src/js';
    downloadOptionsConfig.baseUrl = submodules_path + '/faostat-ui-download-options/src/js';
    downloadSelectorConfig.baseUrl = submodules_path + '/faostat-ui-download-selector/src/js';
    tableConfig.baseUrl = submodules_path + '/faostat-ui-table/src/js';
    pivotConfig.baseUrl = submodules_path + '/faostat-ui-pivot/src/js';
    downloadConfig.baseUrl = submodules_path + '/faostat-ui-download/src/js';

    Compiler.resolve([commonConfig, mapConfig, chartConfig,
            dashboardConfig, metadataConfig, reportsConfig, bulkDownloadsConfig,
            downloadSelectorsManagerConfig, faostatMenuConfig,
            optionsManagerConfig, treeConfig, faostatThemeConfig, downloadOptionsConfig,
            downloadSelectorConfig,
            tableConfig, pivotConfig, downloadConfig],
        {
            placeholders: {"FENIX_CDN": "//fenixrepo.fao.org/cdn"},

            config: {

                waitSeconds: 20,

                /* Set the config for the i18n. */
                //i18n: {
                //    locale: 'es'
                //},

                //locale: 'es',


                /* The path where your JavaScripts are located. */
                baseUrl: './src/js',

                /* Specify the paths of vendor libraries. */
                paths: {
                    bootstrap: "{FENIX_CDN}/js/bootstrap/3.3.4/js/bootstrap.min",
                    underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
                    backbone: "{FENIX_CDN}/js/backbone/1.1.2/backbone.min",
                    handlebars: "{FENIX_CDN}/js/handlebars/4.0.5/handlebars.min",
                    chaplin: "{FENIX_CDN}/js/chaplin/1.0.1/chaplin.min",
                    domReady: "{FENIX_CDN}/js/requirejs/plugins/domready/2.0.1/domReady",
                    i18n: "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n",
                    text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
                    rsvp: '{FENIX_CDN}/js/rsvp/3.0.17/rsvp',
                    amplify: '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
                    select2: '{FENIX_CDN}/js/select2/3.5.4/select2.min',
                    loglevel: '{FENIX_CDN}/js/loglevel/1.4.0/loglevel',

                    nls: "../../i18n",
                    config: "../../config",
                    json: "../../json",
                    'fx-common/config/auth_users' : '../../config/auth_users.json',

                    // TODO: remove it (download dependency)
                    wds_client: '../../submodules/fenix-ui-common/js/WDSClient',


                    q: '{FENIX_CDN}/js/q/1.1.2/q',
                    'jquery.rangeSlider': '{FENIX_CDN}/js/jquery.rangeslider/5.7.0/jQDateRangeSlider-min',
                    'jquery-ui': '{FENIX_CDN}/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',

                    //jbPivot: '{FENIX_CDN}/js/jbpivot/0.1.0/jbPivot',
                    jbPivot: '../../submodules/faostat-ui-pivot/dist/js/jbPivot',
                    pivot_exporter: '../../submodules/faostat-ui-pivot/src/js/PivotExporter',
                    swal: '{FENIX_CDN}/js/sweet-alert/0.5.0/sweet-alert.min',
                    numeral: '{FENIX_CDN}/js/numeral/1.5.3/min/numeral.min',
                    // TODO: move to CDN

                    /* FAOSTAT API's client. */
                    faostatapiclient:           'FAOSTATAPIClient',
                    list: '//fenixrepo.fao.org/cdn/js/list/1.1.1/list.min',
                    //list_pagination: '//raw.githubusercontent.com/javve/list.pagination.js/v0.1.1/dist/list.pagination.min',

                    // TODO: switch to submodule? */
                    'fs-t-c': 'lib/table',

                    // boostrap bplugins
                    'bootstrap-table': '{FENIX_CDN}/js/bootstrap-table/1.9.1/bootstrap-table.min',
                    'bootstrap-treeview': '{FENIX_CDN}/js/boostrap-treeview/1.2.0/bootstrap-treeview.min',

                    /* Google Analytics */
                    "ga": "//www.google-analytics.com/analytics"
                },

                shim: {
                    bootstrap: {
                        deps: ["jquery"]
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
                    "ga": {
                        exports: "__ga__"
                    }
                }
            }
        });

    // TODO: handle the multilanguage in a proper way

    // Google Analytics
    window.GoogleAnalyticsObject = "__ga__";
    window.__ga__ = {
        //q: [["create", "UA-68486942-1", "auto"]],
        l: Date.now()
    };

    var getQueryString = function ( field, url ) {
        var href = url ? url : window.location.href;
        var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        var string = reg.exec(href);
        return string ? string[1] : null;
    };


    var getLocale = function ( url ) {
        var href = url ? url : window.location.href;
        var langString = href.substring(href.indexOf('#')+1, href.length -1);
        langString = langString.substring(0, langString.indexOf('/')).replace('/', '');
        return (langString.length == 2)? langString.toLocaleLowerCase(): null;
    };

    //var locale = getQueryString('locale') || 'en';
    var locale = getLocale() || 'en';
    require.config({'locale': locale});

    /* Bootstrap the application. */
    require([
        'application',
        'routes',
        'config/Config',
        'globals/Common',
        'config/Events',
        'globals/GoogleAnalyticsManager',
        'loglevel',
        'amplify',
        'domReady!'
    ], function (Application, routes, C, Common, E, GoogleAnalyticsManager, log) {

        Common.setLocale(requirejs.s.contexts._.config.locale);

/*        // Mapping GoogleAnalyticsManager
        amplify.publish(E.GOOGLE_ANALYTICS_PAGE_VIEW, GoogleAnalyticsManager.pageView);
        amplify.publish(E.GOOGLE_ANALYTICS_EVENT, GoogleAnalyticsManager.event);
        */

        // setting global LOGLEVEL level
        log.setLevel(C.LOGLEVEL);

        // TODO: use locale or lang?
        //amplify.store( 'locale', requirejs.s.contexts._.config.locale);
        //amplify.store( 'lang', requirejs.s.contexts._.config.locale);

        var app = new Application({
            routes: routes,
            root: C.CHAPLINJS_PROJECT_ROOT,
            scrollTo: C.CHAPLINJS_SCROLL_TO,
            pushState: C.CHAPLINJS_PUSH_STATE,
            controllerSuffix: C.CHAPLINJS_CONTROLLER_SUFFIX
        });

    });


});