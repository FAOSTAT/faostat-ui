define([], function() {

    'use strict';

    function APP() {

        var lang = 'E';
        var domain = 'GT';
        var prefix = 'faostat_download_';

        this.CONFIG = {

            lang: lang,

            tree: {
                lang: lang,
                placeholder_id: 'left_placeholder'
            },

            bulk: {
                lang: lang,
                domain: domain,
                placeholder_id: 'bulk_downloads_placeholder'
            },

            download_options: {
                lang: lang,
                prefix: prefix + 'download_',
                placeholder_id: 'download_options_placeholder'
            },

            preview_options: {
                lang: lang,
                ok_button: true,
                csv_button: false,
                pdf_button: false,
                excel_button: false,
                prefix: prefix + 'preview_',
                button_label: 'Preview Options',
                header_label: 'Preview Options',
                placeholder_id: 'preview_options_placeholder'
            },

            metadata: {
                lang: lang,
                domain: domain,
                view_type: 'accordion',
                placeholder_id: 'metadata_placeholder'
            },

            selector_mgr: {
                lang: 'E',
                domain: domain,
                prefix: 'faostat_selectors_',
                datasource: 'faostatdb',
                placeholder_id: 'selectors_placeholder'
            }

        };

    }

    APP.prototype.init = function(config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang != null ? this.CONFIG.lang : 'E';

        /* This... */
        var _this = this;

        /* Initiate components. */
        require(['FAOSTAT_TREE',
                 'FAOSTAT_BULK_DOWNLOADS',
                 'FAOSTAT_DOWNLOAD_OPTIONS',
                 'FENIX_UI_METADATA_VIEWER',
                 'FAOSTAT_DOWNLOAD_SELECTORS_MANAGER'], function(TREE, BULK, OPTIONS, METADATDA, SELECTOR_MGR) {

            /* Initiate tree. */
            var tree = new TREE();
            tree.init(_this.CONFIG.tree);

            /* Bind UI creation on domain leaf click. */
            tree.onDomainClick(function(id) {
                _this.load_faostat_domain_ui(id)
            });

        });

    };

    APP.prototype.load_faostat_domain_ui = function(domain_code) {

        /* This... */
        var _this = this;

        require(['FAOSTAT_BULK_DOWNLOADS',
                 'FAOSTAT_DOWNLOAD_OPTIONS',
                 'FENIX_UI_METADATA_VIEWER',
                 'FAOSTAT_DOWNLOAD_SELECTORS_MANAGER'], function(BULK, OPTIONS, METADATDA, SELECTOR_MGR) {

            /* Bulk downloads. */
            var bulk = new BULK();
            bulk.init(_this.CONFIG.bulk);
            _this.CONFIG.bulk.domain = domain_code;
            bulk.create_flat_list();

            /* Download options. */
            var download_options = new OPTIONS();
            download_options.init(_this.CONFIG.download_options);
            download_options.show_as_modal_window();
            download_options.onDownload({
                foo: 'bar'
            },function(user_selection, data) {
                switch (user_selection.output_format) {
                    default:
                        console.log(user_selection.output_format);
                        console.log(user_selection);
                        console.log(data);
                        break;
                }
            });

            /* Preview options. */
            var preview_options = new OPTIONS();
            preview_options.init(_this.CONFIG.preview_options);
            preview_options.show_as_modal_window();

            /* Metadata. */
            var metadata = new METADATDA();
            _this.CONFIG.metadata.domain = domain_code;
            metadata.init(_this.CONFIG.metadata);

            /* Download selectors manager. */
            var selector_mgr = new SELECTOR_MGR();
            _this.CONFIG.selector_mgr.domain = domain_code;
            selector_mgr.init(_this.CONFIG.selector_mgr);

        });

    };

    return APP;

});