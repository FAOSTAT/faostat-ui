/*global define*/
define(['jquery',
        'handlebars',
        'text!faostat_ui_bulk_downloads/html/templates.hbs',
        'faostat_commons',
        'wds_client',
        'i18n!faostat_ui_bulk_downloads/nls/translate',
        'bootstrap',
        'sweetAlert'], function ($, Handlebars, templates, FAOSTATCommons, WDSClient, translate) {

    'use strict';

    function BULK() {

        this.CONFIG = {
            lang: 'E',
            domain: null,
            lang_faostat: 'E',
            datasource: 'faostat',
            placeholder_id: 'placeholder',
            url_rest: 'http://fenixapps2.fao.org/wds_5.2/rest',
            url_bulk_downloads: 'http://fenixapps2.fao.org/wds_5.2/rest',
            bulk_downloads_root: 'http://faostat.fao.org/Portals/_Faostat/Downloads/zip_files/',
            url_wds_crud: 'http://fenixapps2.fao.org/wds_5.2/rest/crud'
        };

    }

    BULK.prototype.init = function (config) {

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

    BULK.prototype.create_flat_list = function () {

        /* this... */
        var that = this,
            i,
            name,
            size,
            dynamic_data;

        /* Initiate the WDS client. */
        this.CONFIG.w = new WDSClient({
            datasource: this.CONFIG.datasource,
            serviceUrl: this.CONFIG.url_wds_crud
        });

        /* Fetch available bulk downloads. */
        this.CONFIG.w.get_services_client({

            service_name: 'bulkdownloads',

            parameters: {
                datasource: this.CONFIG.datasource,
                lang_faostat: this.CONFIG.lang_faostat,
                domain: this.CONFIG.domain
            },

            wds_url: this.CONFIG.url_rest,

            success: function (json) {

                /* Courtesy message when no bulk download is available. */
                if (json.length === 0) {

                    /* Render the list. */
                    $('#' + that.CONFIG.placeholder_id).html('<h1 class="text-center">' + translate.courtesy + '</h1>');

                } else {

                    /* Create flat list. */
                    var s = '',
                        source = $(templates).filter('#dropdown_item').html(),
                        template = Handlebars.compile(source);
                    for (i = 0; i < json.length; i += 1) {
                        name = json[i][3].replace(/\_/g, ' ');
                        name = name.substring(0, name.indexOf('('));
                        size = json[i][3].substring(1 + json[i][3].lastIndexOf('('), json[i][3].length - 1);
                        dynamic_data = {
                            item_url: that.CONFIG.bulk_downloads_root + json[i][2],
                            item_text: name,
                            item_size: size
                        };
                        s += template(dynamic_data);
                    }

                    /* Render the list. */
                    $('#' + that.CONFIG.placeholder_id).html(s);

                }

            }

        });

    };

    return BULK;

});