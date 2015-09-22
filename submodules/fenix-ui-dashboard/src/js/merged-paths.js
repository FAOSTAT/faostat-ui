define(function () {
   var config = {
    paths:  {
        'fx-dashboard/start': './start',
        'fx-dashboard/controllers': './controllers',
        'fx-dashboard/models': './models',
        'fx-dashboard/templates': '../templates',
        'fx-dashboard/views': './views',
        'fx-dashboard/lib': './lib',
        'fx-dashboard/widgets': './widgets',
        'fx-dashboard/utils': './utils',
        'fx-dashboard/config': '../../config',

        // explicit references for TABLE CREATOR (needs to be dealt with in a better way)
        'fx-c-c' : '../../../fenix-ui-chart-creator/src/js',
        'fx-c-c/start' : '../../../fenix-ui-chart-creator/src/js/start',
        'fx-c-c/html' : '../../../fenix-ui-chart-creator/src/html',
        'fx-c-c/config' : '../../../fenix-ui-chart-creator/config',
        'fx-c-c/adapters' : '../../../fenix-ui-chart-creator/src/js/adapters',
        'fx-c-c/templates' : '../../../fenix-ui-chart-creator/src/js/templates',

        // explicit references for TABLE CREATOR (needs to be dealt with in a better way)
        'fx-t-c' : '../../../fenix-ui-table-creator/src/js',
        'fx-t-c/start' : '../../../fenix-ui-table-creator/src/js/start',
        'fx-t-c/html' : '../../../fenix-ui-table-creator/src/html',
        'fx-t-c/config' : '../../../fenix-ui-table-creator/config',
        'fx-t-c/adapters' : '../../../fenix-ui-table-creator/src/js/adapters',
        'fx-t-c/templates' : '../../../fenix-ui-table-creator/src/js/templates',

        // explicit references for TABLE CREATOR (needs to be dealt with in a better way)
        'fx-filter/filtercontroller': '../../../fenix-ui-filter/src/js/Fx-filter-controller',
        'fx-filter/fluidgrid': '../../../fenix-ui-filter/src/js/Fx-fluid-grid',
        'fx-filter/containerfactory': '../../../fenix-ui-filter/src/js/Fx-filter-containerFactory',
        'fx-filter/componentfactory': '../../../fenix-ui-filter/src/js/Fx-filter-componentFactory',
        'fx-filter/filtermodule': '../../../fenix-ui-filter/src/js/Fx-filter-module',
        'fx-filter/container1': '../../../fenix-ui-filter/src/js/container_plugin/Fx-filter-container',
        'fx-filter/component1': '../../../fenix-ui-filter/src/js/component_plugin/Fx-filter-component1',
        'fx-filter/componentcreator': '../../../fenix-ui-filter/src/js/Fx-filter-component-creator',
        'fx-filter/widgetcommons': '../../../fenix-ui-filter/src/js/Fx-widgets-commons',
        'fx-filter/start': '../../../fenix-ui-filter/src/js/start',
        'fx-filter/utils': '../../../fenix-ui-filter/src/js/Fx-filter-utils',
        'fx-filter/config' : '../../../fenix-ui-filter/config',

        // third party libs
         'underscore': "http://fenixapps.fao.org/repository/js/underscore/1.7.0/underscore.min",
       //  underscore: 'http://underscorejs.org/underscore',
        'jquery': 'http://fenixapps.fao.org/repository/js/jquery/2.1.1/jquery.min',
        'amplify': 'http://fenixapps.fao.org/repository/js/amplify/1.1.2/amplify.min',
        'bootstrap': 'http://fenixapps.fao.org/repository/js/bootstrap/3.2/js/bootstrap.min',
        'lodash': 'http://fenixapps.fao.org/repository/js/lodash/2.4.1/lodash',
        'backbone': 'http://fenixapps.fao.org/repository/js/backbone/1.1.2/backbone.min',
        'handlebars': 'http://fenixapps.fao.org/repository/js/handlebars/2.0.0/handlebars',
        'text': 'http://fenixapps.fao.org/repository/js/requirejs/plugins/text/2.0.12/text',
       // 'chaplin': 'http://localhost:8080/uae/submodules/fenix-ui-dashboard/src/lib/chaplin/chaplin',
        'chaplin': 'http://fenixapps.fao.org/repository/js/chaplin/1.0.1/chaplin.min',
        'packery': 'http://fenixapps.fao.org/repository/js/packery/dist/packery.pkgd',
        'draggabilly': 'http://fenixapps.fao.org/repository/js/packery/bower_components/draggabilly/dist/draggabilly.pkgd',
        highcharts : 'http://code.highcharts.com/highcharts',
        jqwidgets: 'http://fenixapps.fao.org/repository/js/jqwidgets/3.1/jqx-all',
        moment: "http://fenixapps.fao.org/repository/js/moment/2.9.0/moment.min"
    },
            shim: {
                bootstrap: {
                    deps: ['jquery']
                },
                underscore: {
                    exports: '_'
                },
              /**  lodash: {
                    exports: '_'
                },  **/
                "jquery.i18n.properties": {
                    deps: ['jquery']
                },
                pnotify: {
                    deps: ['bootstrap']
                },

                backbone: {
                    deps: ['underscore', 'jquery'],// deps: ['underscore', 'jquery'],
                    exports: 'Backbone'
                },
                handlebars: {
                    exports: 'Handlebars'
                },
                jqwidgets: {
                    "deps": ["jquery"]
                },
                highcharts: {
                    "exports": "Highcharts",
                    "deps": ["jquery"]
                },
                amplify: {
                    deps: ["jquery"],
                    exports: "amplify"
                }
            }
        };

    return config;
});