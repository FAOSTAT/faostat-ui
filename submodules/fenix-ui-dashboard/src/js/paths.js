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

        // third party libs
        'jquery': 'http://fenixapps.fao.org/repository/js/jquery/2.1.1/jquery.min',
        'amplify': 'http://fenixapps.fao.org/repository/js/amplify/1.1.2/amplify.min',
        'bootstrap': 'http://fenixapps.fao.org/repository/js/bootstrap/3.2/js/bootstrap.min',
        'underscore': 'http://fenixapps.fao.org/repository/js/underscore/1.7.0/underscore.min',
        //'underscore': 'http://fenixapps.fao.org/repository/js/lodash/2.4.1/lodash',
        'backbone': 'http://fenixapps.fao.org/repository/js/backbone/1.1.2/backbone.min',
        'handlebars': 'http://fenixapps.fao.org/repository/js/handlebars/2.0.0/handlebars',
        'text': 'http://fenixapps.fao.org/repository/js/requirejs/plugins/text/2.0.12/text',
        'chaplin': 'http://fenixapps.fao.org/repository/js/chaplin/1.0.1/chaplin.min',
        'packery': 'http://fenixapps.fao.org/repository/js/packery/dist/packery.pkgd',
        'draggabilly': 'http://fenixapps.fao.org/repository/js/packery/bower_components/draggabilly/dist/draggabilly.pkgd'


    },
            shim: {
                bootstrap: {
                    deps: ['jquery']
                },
                underscore: {
                    exports: '_'
                },
                "jquery.i18n.properties": {
                    deps: ['jquery']
                },
                pnotify: {
                    deps: ['bootstrap']
                },

                backbone: {
                    deps: ['underscore', 'jquery'],
                    exports: 'Backbone'
                },
                handlebars: {
                    exports: 'Handlebars'
                },

                amplify: {
                    deps: ["jquery"],
                    exports: "amplify"
                }
            }
        };

    return config;
});