/*global define*/
define(['jquery',
        'handlebars',
        'text!faostat_ui_options_manager/html/templates.hbs',
        'i18n!faostat_ui_options_manager/nls/translate',
        'faostat_commons',
        'wds_client',
        'FENIX_UI_DOWNLOAD_OPTIONS',
        'bootstrap',
        'sweetAlert',
        'amplify'], function ($, Handlebars, templates, translate, FAOSTATCommons, WDSClient, DownloadOptions) {

    'use strict';

    function OPTS_MGR() {

        this.CONFIG = {

            w: null,
            lang: 'en',
            prefix: 'faostat_ui_options_manager_',
            placeholder_id: 'faostat_ui_options_manager',
            url_wds_crud: 'http://fenixapps2.fao.org/wds_5.1/rest/crud',
            windows: {}

        };

    }

    OPTS_MGR.prototype.init = function (config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang !== null ? this.CONFIG.lang : 'en';

        /* Store FAOSTAT language. */
        this.CONFIG.lang_faostat = FAOSTATCommons.iso2faostat(this.CONFIG.lang);

        /* Initiate the WDS client. */
        this.CONFIG.w = new WDSClient({
            datasource: this.CONFIG.datasource,
            serviceUrl: this.CONFIG.url_wds_crud
        });

    };

    OPTS_MGR.prototype.add_options_window = function (id, window_config) {

        /* Variables. */
        var that = this,
            options_window,
            i,
            key;

        /* Initiate the options window. */
        window_config.prefix = id + '_';
        options_window = new DownloadOptions();
        options_window.init(window_config);
        options_window.show_as_modal_window();

        /* Register the window. */
        this.CONFIG.windows[id] = options_window;

        /* Subscribe to window' events. */
        /*global amplify*/
        amplify.subscribe(id + '_event', function (data) {
            for (i = 0; i < Object.keys(that.CONFIG.windows).length; i += 1) {
                key = Object.keys(that.CONFIG.windows)[i];
                if (key !== id) {
                    that.CONFIG.windows[key].init(data);
                    that.CONFIG.windows[key].apply_configuration();
                }
            }
        });

    };

    OPTS_MGR.prototype.get_options_window = function (id) {
        return this.CONFIG.windows[id];
    };

    OPTS_MGR.prototype.destroy = function () {
        var i,
            key;
        for (i = 0; i < Object.keys(this.CONFIG.windows).length; i += 1) {
            key = Object.keys(this.CONFIG.windows)[i];
            this.CONFIG.windows[key].destroy();
        }
    };

    return OPTS_MGR;

});