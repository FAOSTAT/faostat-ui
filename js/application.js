/* global define, require */
define(['jquery',
        'require',
        'backbone',
        'text!config/faostat.json'], function($, Require, Backbone, faostat_config) {

    'use strict';

    function FAOSTAT4() {

        this.CONFIG = {
            menu: {
                lang: 'en',
                prefix: 'faostat_download_',
                datasource: 'faostatdb'
            },
            placeholder_id: 'faostat_ui_content'
        };

    }

    FAOSTAT4.prototype.init = function(config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang !== null ? this.CONFIG.lang : 'en';

        /* Cast FAOSTAT configuration file to JSON. */
        faostat_config = $.parseJSON(faostat_config);

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
                '(/):lang(/)download(/):group(/):domain(/):section(/)'  :   'download_group_domain_section',
                '(/):lang(/)analysis(/)'                                :   'analysis',
                '(/):lang(/)analysis(/):section(/)'                     :   'analysis_section',
                '(/):lang(/)analysis(/):section(/):module(/)'           :   'analysis_section_module',
                '(/):lang(/)browse(/)'                                  :   'browse',
                '(/):lang(/)browse(/):domain(/):code(/)'                :   'browse',
                '(/):lang(/)compare(/)'                                 :   'compare'
            },

            /* Generic routing. */
            route_module: function(module_name) {

                app_router.on('route:' + module_name, function (lang) {

                    /* Initiate language. */
                    _this.set_language(lang);

                    Require(['FAOSTAT_UI_MENU', 'FAOSTAT_UI_' + module_name.toUpperCase()], function (MENU, MODULE) {

                        /* Initiate the menu. */
                        var menu = new MENU();
                        menu.init(_this.CONFIG.menu);

                        /* Initiate the module. */
                        var module = new MODULE();
                        module.init({
                            lang: lang,
                            placeholder_id: _this.CONFIG.placeholder_id
                        });

                    });

                });

            }

        });

        /* Initiate router. */
        var app_router = new AppRouter();

        /* Define modules. */
        var modules = [
            'home',
            'download',
            'analysis'
        ];

        /* Route modules. */
        for (var module in modules) {
            app_router.route_module(modules[module]);
        }

        /* Download router. */
        _this.download_router(app_router);

        /* Analysis router. */
        _this.analysis_router(app_router);

        /* Analysis router. */
        _this.browse_router(app_router);

        /* Analysis router. */
        _this.compare_router(app_router);

        /* Initiate Backbone history. */
        Backbone.history.start();

    };

    FAOSTAT4.prototype.download_router = function(app_router) {

        /* This... */
        var _this = this;

        /* Open download on selected group. */
        app_router.on('route:download_group', function (lang, group) {

            /* Initiate language. */
            _this.set_language(lang);

            Require(['FAOSTAT_UI_MENU', 'FAOSTAT_UI_DOWNLOAD'], function (MENU, DWLD) {

                /* Initiate the menu. */
                var menu = new MENU();
                menu.init(_this.CONFIG.menu);

                /* Download configuration. */
                var dwld_config = {
                    lang: lang,
                    group: group,
                    domain: null,
                    section: 'metadata',
                    datasource: _this.CONFIG.datasource,
                    placeholder_id: _this.CONFIG.placeholder_id
                };

                /* Propagate central configuration. */
                dwld_config = $.extend(true, {}, dwld_config, faostat_config.download);

                /* Initiate the download. */
                var dwld = new DWLD();
                dwld.init(dwld_config);

            });

        });

        /* Open download on selected group and domain. */
        app_router.on('route:download_group_domain_section', function (lang, group, domain, section) {

            /* Initiate language. */
            _this.set_language(lang);

            Require(['FAOSTAT_UI_MENU', 'FAOSTAT_UI_DOWNLOAD'], function (MENU, DWLD) {

                /* Initiate the menu. */
                var menu = new MENU();
                menu.init(_this.CONFIG.menu);

                /* Download configuration. */
                var dwld_config = {
                    lang: lang,
                    group: group,
                    domain: domain,
                    section: section,
                    datasource: _this.CONFIG.datasource,
                    placeholder_id: _this.CONFIG.placeholder_id
                };

                /* Propagate central configuration. */
                dwld_config = $.extend(true, {}, dwld_config, faostat_config.download);

                /* Initiate the download. */
                var dwld = new DWLD();
                dwld.init(dwld_config);

            });

        });

    };

    FAOSTAT4.prototype.analysis_router = function(app_router) {

        /* This... */
        var _this = this;

        /* Show analysis. */
        app_router.on('route:analysis', function (lang) {

            /* Initiate language. */
            _this.set_language(lang);

            /* Re-route to default section. */
            Backbone.history.navigate('/' + _this.CONFIG.lang + '/analysis/statistical_analysis', {trigger: false});

        });

        /* Show analysis section. */
        app_router.on('route:analysis_section', function (lang, section) {

            /* Initiate language. */
            _this.set_language(lang);

            Require(['FAOSTAT_UI_MENU', 'FAOSTAT_UI_ANALYSIS'], function (MENU, ANALYSIS) {

                /* Initiate the menu. */
                var menu = new MENU();
                menu.init(_this.CONFIG.menu);

                /* Module configuration. */
                var analysis_config = {
                    lang: lang,
                    section: section,
                    module: null,
                    datasource: _this.CONFIG.datasource,
                    placeholder_id: _this.CONFIG.placeholder_id
                };

                /* Propagate central configuration. */
                analysis_config = $.extend(true, {}, analysis_config, faostat_config.analysis);

                /* Initiate the download. */
                var analysis = new ANALYSIS();
                analysis.init(analysis_config);

            });

        });

        /* Show analysis module. */
        app_router.on('route:analysis_section_module', function (lang, section, module) {

            /* Initiate language. */
            _this.set_language(lang);

            /* Initiate menu and tiles manager. */
            Require(['FAOSTAT_UI_MENU', 'FENIX_UI_TILES_MANAGER'], function (MENU, TILES_MGR) {

                /* Initiate the menu. */
                var menu = new MENU();
                menu.init(_this.CONFIG.menu);

                /* Initiate tiles manager. */
                var mgr = new TILES_MGR();

                /* Fetch RequireJS module's ID. */
                var id = mgr.CONFIG.tiles_configuration[section + '_' + module].require;

                /* Load module. */
                Require([id], function (MODULE) {

                    /* Module configuration. */
                    var module_config = {
                        lang: lang,
                        placeholder_id: _this.CONFIG.placeholder_id
                    };

                    /* Propagate central configuration. */
                    module_config = $.extend(true, {}, module_config, faostat_config.analysis[id]);

                    /* Initiate module. */
                    var module = new MODULE();
                    module.init(module_config);

                });


            });

        });

    };

    FAOSTAT4.prototype.browse_router = function(app_router) {

        /* This... */
        var _this = this;

        /* Show analysis. */
        app_router.on('route:browse', function (lang, section, code) {

            /* Re-route to default section. */
            //Backbone.history.navigate('/' + _this.CONFIG.lang + '/browse/domain/Q', {trigger: false});

            Require(['FAOSTAT_UI_MENU', 'FAOSTAT_UI_BROWSE'], function (MENU, MODULE) {

                /* Initiate the menu. */
                var menu = new MENU();
                menu.init(_this.CONFIG.menu);

                /* Download configuration. */
                var config = {
                    lang: lang,
                    code: code,
                    section: section,
                    datasource: _this.CONFIG.datasource,
                    placeholder_id: _this.CONFIG.placeholder_id
                };

                if ( _this.module !== null && _this.module !== undefined) {
                    _this.module.destroy();
                }

                /* Propagate central configuration. */
                config = $.extend(true, {}, config, faostat_config.browse);

                _this.module = new MODULE();
                _this.module.init(config);
            });
        });
    };


    FAOSTAT4.prototype.compare_router = function(app_router) {

        /* This... */
        var _this = this;

        /* Show analysis. */
        app_router.on('route:compare', function (lang, section, code) {

            /* Re-route to default section. */
            //Backbone.history.navigate('/' + _this.CONFIG.lang + '/browse/domain/Q', {trigger: false});

            Require(['FAOSTAT_UI_MENU', 'faostat-ui-compare'], function (MENU, MODULE) {

                /* Initiate the menu. */
                var menu = new MENU();
                menu.init(_this.CONFIG.menu);

                /* Download configuration. */
                var config = {
                    lang: lang,
                    datasource: _this.CONFIG.datasource,
                    placeholder_id: _this.CONFIG.placeholder_id
                };

                if ( _this.module !== null && _this.module !== undefined) {
                    _this.module.destroy();
                }

                /* Propagate central configuration. */
                var config = $.extend(true, {}, config, faostat_config.compare);

                _this.module = new MODULE();
                _this.module.init(config);
            });
        });
    };


    FAOSTAT4.prototype.set_language = function(lang) {
        lang = (lang !== null) ? lang : 'en';
        require.config({'locale': lang});
        var locale = localStorage.getItem('locale');
        localStorage.setItem('locale', lang);
        if (locale !== lang) {
            localStorage.setItem('locale', lang);
            location.reload();
        }
    };

    return FAOSTAT4;

});