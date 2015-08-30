/*global define*/
define(['jquery',
        'handlebars',
        'text!faostat_ui_options_manager/html/templates.html',
        'i18n!faostat_ui_options_manager/nls/translate',
        'faostat_commons',
        'wds_client',
        'bootstrap',
        'sweetAlert',
        'amplify'], function ($, Handlebars, templates, translate, FAOSTATCommons, WDSClient) {

    'use strict';

    function OPTS_MGR() {

        this.CONFIG = {

            w: null,
            lang: 'en',
            prefix: 'faostat_ui_options_manager_',
            placeholder_id: 'faostat_ui_options_manager',
            url_wds_crud: 'http://fenixapps2.fao.org/wds_5.1/rest/crud'

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

    OPTS_MGR.prototype.destroy = function () {

    };

    return OPTS_MGR;

});