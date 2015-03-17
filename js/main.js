require(['../js/modules/fenix-ui-common/js/Compiler',
         '../js/modules/faostat-tree/js/paths',
         '../js/modules/faostat-bulk-downloads/js/paths',
         '../js/modules/faostat-download-options/js/paths',
         '../js/modules/fenix-ui-metadata-viewer/js/paths',
         '../js/modules/faostat-download-selectors-manager/js/paths',
         '../js/modules/faostat-download-selectors-manager/js/modules/faostat-download-selector/js/paths'
        ], function(Compiler, TREE, BULK, OPTIONS, METADATA, SELECTORS_MGR, SELECTOR) {

    var treeConfig = TREE;
    treeConfig['baseUrl'] = 'js/modules/faostat-tree/js';

    var bulkConfig = BULK;
    bulkConfig['baseUrl'] = 'js/modules/faostat-bulk-downloads/js';

    var optionsConfig = OPTIONS;
    optionsConfig['baseUrl'] = 'js/modules/faostat-download-options/js';

    var metadataConfig = METADATA;
    metadataConfig['baseUrl'] = 'js/modules/fenix-ui-metadata-viewer/js';

    var downloadSelectorsManagerConfig = SELECTORS_MGR;
    downloadSelectorsManagerConfig['baseUrl'] = 'js/modules/faostat-download-selectors-manager/js';

    var downloadSelectorConfig = SELECTOR;
    downloadSelectorConfig['baseUrl'] = 'js/modules/faostat-download-selectors-manager/js/modules/faostat-download-selector/js';

    Compiler.resolve([treeConfig, bulkConfig, optionsConfig, metadataConfig, downloadSelectorsManagerConfig, downloadSelectorConfig],
        {
            placeholders: {
               FENIX_CDN: '//fenixapps.fao.org/repository'
            },
            config: {
                locale: 'en',
                baseUrl: './',
                paths: {
                    jquery: '{FENIX_CDN}/js/jquery/2.1.1/jquery.min',
                    amplify : '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
                    jstree: '{FENIX_CDN}/js/jstree/3.0.8/dist/jstree.min',
                    i18n: '{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n',
                    handlebars: '{FENIX_CDN}/js/handlebars/2.0.0/handlebars',
                    text: '{FENIX_CDN}/js/requirejs/plugins/text/2.0.12/text',
                    sweetAlert: '{FENIX_CDN}/js/sweet-alert/0.4.2/sweet-alert',
                    bootstrap: '{FENIX_CDN}/js/bootstrap/3.3.2/js/bootstrap.min',
                    domReady: '{FENIX_CDN}/js/requirejs/plugins/domready/2.0.1/domReady'
                },
                shim: {
                    handlebars: {
                        exports: 'Handlebars'
                    },
                    amplify: {
                        deps: ['jquery'],
                        exports: 'amplifyjs'
                    }
                }
            }
        }
    );

    require(['js/application'], function(APP) {

        /* Initiate components. */
        var app = new APP();

        /* Initiate the application. */
        app.init();

    });

});