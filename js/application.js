define(['jquery','backbone'], function($, Backbone) {

    'use strict';

    function FAOSTAT4() {

        var lang = 'en';

        this.CONFIG = {

            lang: lang,
            prefix: 'faostat_',

            download: {
                lang: lang,
                prefix: 'faostat_download_'
            },

            menu: {
                lang: lang,
                prefix: 'faostat_download_'
            }

        };

    }

    FAOSTAT4.prototype.init = function(config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang != null ? this.CONFIG.lang : 'E';

        /* This... */
        var _this = this;

        /* Define the router. */
        var AppRouter = Backbone.Router.extend({

            /* Define the routes. */
            routes: {
                ''                                  :   'home',
                '(/):lang(/)home(/)'                :   'home',
                '(/):lang(/)download(/)'            :   'download'
            },

            /* Overwrite language settings. */
            init_language: function (lang) {

                /* Initiate language. */
                lang = (lang != null) ? lang : 'en';
                require.config({'locale': lang});

                /* Initiate menu. */
                require(['FAOSTAT_UI_MENU'], function(MENU) {
                    var menu = new MENU();
                    menu.init(_this.CONFIG.menu);
                });

            },

            route_module: function(module_name) {
                app_router.on('route:' + module_name, function (lang) {
                    this.init_language(lang);
                    require(['FAOSTAT_UI_' + module_name.toUpperCase()], function (MODULE) {
                        var module = new MODULE();
                        module.init({
                            lang: lang,
                            placeholder_id: 'faostat_ui_content'
                        });
                    });
                });
            }

        });

        /* Initiate router. */
        var app_router = new AppRouter;

        /* Define modules. */
        var modules = [
            'home',
            'download'
        ];

        /* Route modules. */
        for (var module in modules)
            app_router.route_module(modules[module]);

        /* Initiate Backbone history. */
        Backbone.history.start();

    };

    return FAOSTAT4;

});