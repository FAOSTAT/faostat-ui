/*global require*/
require([
    './submodules/fenix-ui-common/js/Compiler',
    './submodules/fenix-ui-common/js/paths',
    './submodules/fenix-ui-menu/js/paths',
    './submodules/faostat-ui-tree/js/paths',
    './submodules/fenix-ui-map-creator/src/js/paths',
    './submodules/fenix-ui-chart-creator/src/js/paths',
    './submodules/fenix-ui-table-creator/src/js/paths',
    './submodules/fenix-ui-dashboard/src/js/paths',
    './submodules/fenix-ui-metadata-viewer/js/paths',
    './submodules/fenix-ui-reports/src/js/paths',
    './submodules/faostat-ui-bulk-downloads/src/js/paths',
    './submodules/faostat-ui-download-selectors-manager/src/js/paths',
    './submodules/fenix-ui-download-options/src/js/paths',
    './submodules/faostat-ui-menu/src/js/paths'
], function (Compiler, Common, Menu, Tree, MapCreator, ChartCreator, TableCreator, Dashboard, MetadataViewer, Reports,
             BulkDownloads, DownloadSelectorsManager, DownloadOptions, FAOSTATMenu) {

    'use strict';

    var submodules_path = '../../submodules/',
        commonConfig = Common,
        menuConfig = Menu,
        treeConfig = Tree,
        mapConfig = MapCreator,
        chartConfig = ChartCreator,
        tableConfig = TableCreator,
        metadataConfig = MetadataViewer,
        reportsConfig = Reports,
        dashboardConfig = Dashboard,
        bulkDownloadsConfig = BulkDownloads,
        downloadSelectorsManagerConfig = DownloadSelectorsManager,
        downloadOptionsConfig = DownloadOptions,
        faostatMenuConfig = FAOSTATMenu;

    menuConfig.baseUrl = submodules_path + '/fenix-ui-menu/js';
    treeConfig.baseUrl = submodules_path + '/faostat-ui-tree/js';
    commonConfig.baseUrl = submodules_path + 'fenix-ui-common/js';
    mapConfig.baseUrl = submodules_path + '/fenix-ui-map-creator/src/js';
    reportsConfig.baseUrl = submodules_path + '/fenix-ui-reports/src/js';
    chartConfig.baseUrl = submodules_path + '/fenix-ui-chart-creator/src/js';
    tableConfig.baseUrl = submodules_path + '/fenix-ui-table-creator/src/js';
    dashboardConfig.baseUrl = submodules_path + '/fenix-ui-dashboard/src/js';
    metadataConfig.baseUrl = submodules_path + '/fenix-ui-metadata-viewer/js';
    bulkDownloadsConfig.baseUrl = submodules_path + '/faostat-ui-bulk-downloads/src/js';
    downloadSelectorsManagerConfig.baseUrl = submodules_path + '/faostat-ui-download-selectors-manager/src/js';
    downloadOptionsConfig.baseUrl = submodules_path + '/fenix-ui-download-options/src/js';
    faostatMenuConfig.baseUrl = submodules_path + '/faostat-ui-menu/src/js';

    Compiler.resolve([commonConfig, menuConfig, treeConfig, mapConfig, chartConfig,
            tableConfig, dashboardConfig, metadataConfig, reportsConfig, bulkDownloadsConfig,
            downloadSelectorsManagerConfig, downloadOptionsConfig, faostatMenuConfig],
        {
            placeholders: {"FENIX_CDN": "//fenixrepo.fao.org/cdn"},

            config: {

                /* Set the config for the i18n. */
                i18n: {
                    locale: 'en'
                },

                /* The path where your JavaScripts are located. */
                baseUrl: './src/js',

                /* Specify the paths of vendor libraries. */
                paths: {
                    bootstrap: "{FENIX_CDN}/js/bootstrap/3.3.4/js/bootstrap.min",
                    underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
                    backbone: "{FENIX_CDN}/js/backbone/1.1.2/backbone.min",
                    handlebars: "{FENIX_CDN}/js/handlebars/2.0.0/handlebars",
                    chaplin: "{FENIX_CDN}/js/chaplin/1.0.1/chaplin.min",
                    domReady: "{FENIX_CDN}/js/requirejs/plugins/domready/2.0.1/domReady",
                    i18n: "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n",
                    text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
                    rsvp: '{FENIX_CDN}/js/rsvp/3.0.17/rsvp',
                    amplify: '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
                    nls: "../../i18n",
                    config: "../../config",
                    json: "../../json",
                    'fx-common/config/auth_users' : '../../config/auth_users.json',
                    wds_client: '../../submodules/fenix-ui-common/js/WDSClient'
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
                    }
                }
            }
        });

    /* Bootstrap the application. */
    require([
        'application',
        'routes',
        'config/Config',
        'domReady!'
    ], function (Application, routes, C) {
        var app = new Application({
            routes: routes,
            root: C.CHAPLINJS_PROJECT_ROOT,
            scrollTo: C.CHAPLINJS_SCROLL_TO,
            pushState: C.CHAPLINJS_PUSH_STATE,
            controllerSuffix: C.CHAPLINJS_CONTROLLER_SUFFIX
        });
    });
});