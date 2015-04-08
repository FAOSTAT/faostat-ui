define(['jquery','backbone'], function($, Backbone) {

    'use strict';

    function FAOSTAT4() {

        var lang = 'en';

        this.CONFIG = {

            lang: lang,
            prefix: 'faostat_',
            datasource: 'faostat',

            download: {
                lang: lang,
                prefix: 'faostat_download_'
            },

            menu: {
                lang: lang,
                prefix: 'faostat_download_',
                datasource: 'faostatdb'
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
                ''                                                      :   'home',
                '(/):lang(/)'                                           :   'home',
                '(/):lang(/)home(/)'                                    :   'home',
                '(/):lang(/)download(/)'                                :   'download',
                '(/):lang(/)download(/):group(/)'                       :   'download_group',
                '(/):lang(/)download(/):group(/):domain(/):section(/)'  :   'download_group_domain_section'
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

        /* Open download on selected group. */
        app_router.on('route:download_group', function (lang, group) {

            /* Initiate language. */
            lang = (lang != null) ? lang : 'en';
            require.config({'locale': lang});

            require(['FAOSTAT_UI_MENU', 'FAOSTAT_UI_DOWNLOAD'], function (MENU, DWLD) {

                /* Initiate the menu. */
                var menu = new MENU();
                menu.init(_this.CONFIG.menu);

                /* Initiate the download. */
                var dwld = new DWLD();
                dwld.init({
                    lang: lang,
                    group: group,
                    domain: null,
                    section: 'metadata',
                    datasource: _this.CONFIG.datasource,
                    placeholder_id: 'faostat_ui_content'
                });

            });

        });

        /* Open download on selected group and domain. */
        app_router.on('route:download_group_domain_section', function (lang, group, domain, section) {

            /* Initiate language. */
            lang = (lang != null) ? lang : 'en';
            require.config({'locale': lang});

            require(['FAOSTAT_UI_MENU', 'FAOSTAT_UI_DOWNLOAD'], function (MENU, DWLD) {

                /* Initiate the menu. */
                var menu = new MENU();
                menu.init(_this.CONFIG.menu);

                /* Initiate the download. */
                var dwld = new DWLD();
                dwld.init({
                    lang: lang,
                    group: group,
                    domain: domain,
                    section: section,
                    datasource: _this.CONFIG.datasource,
                    placeholder_id: 'faostat_ui_content'
                });

            });

        });

        /* Show Analysis. */
        //app_router.on('route:analysis_section_module', function (lang, section, module) {
        //
        //});

        /* Initiate Backbone history. */
        Backbone.history.start();

    };

    return FAOSTAT4;

});