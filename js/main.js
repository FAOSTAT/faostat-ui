require(['../submodules/fenix-ui-common/js/Compiler',
         '../submodules/faostat-ui-commons/js/paths',
         '../submodules/faostat-ui-menu/js/paths',
         '../submodules/faostat-ui-home/js/paths',
         '../submodules/faostat-ui-download/js/paths',
         '../submodules/faostat-ui-tree/js/paths'
        ], function(Compiler, Commons, MENU, HOME, DWLD, TREE) {

    var commonsConfig = Commons;
    commonsConfig['baseUrl'] = 'submodules/faostat-ui-commons/js';

    var menuConfig = MENU;
    menuConfig['baseUrl'] = 'submodules/faostat-ui-menu/js';

    var homeConfig = HOME;
    homeConfig['baseUrl'] = 'submodules/faostat-ui-home/js';

    var downloadConfig = DWLD;
    downloadConfig['baseUrl'] = 'submodules/faostat-ui-download/js';

    var treeConfig = TREE;
    treeConfig['baseUrl'] = 'submodules/faostat-ui-tree/js';

    Compiler.resolve([commonsConfig, menuConfig, homeConfig, downloadConfig, treeConfig],
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
                    domReady: '{FENIX_CDN}/js/requirejs/plugins/domready/2.0.1/domReady',
                    backbone: 'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
                    underscore: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.2/underscore-min'
                },
                shim: {
                    backbone: {
                        deps: ['jquery', 'underscore'],
                        exports: 'Backbone'
                    },
                    bootstrap: ['jquery'],
                    handlebars: {
                        exports: 'Handlebars'
                    },
                    underscore: {
                        exports: '_'
                    },
                    highcharts: ['jquery'],
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