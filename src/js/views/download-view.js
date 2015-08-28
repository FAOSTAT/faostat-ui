/*global define, _:false, $, console, amplify, FM*/
define([
    'views/base/view',
    'config/Config',
    'config/Events',
    'text!templates/download/download.hbs',
    'i18n!nls/download',
    'fx-common/WDSClient',
    'FAOSTAT_UI_TREE',
    'FENIX_UI_METADATA_VIEWER',
    'FAOSTAT_UI_BULK_DOWNLOADS',
    'FAOSTAT_UI_DOWNLOAD_SELECTORS_MANAGER',
    'FENIX_UI_DOWNLOAD_OPTIONS',
    'pivot',
    'pivotRenderers',
    'pivotAggregators',
    'pivotConfig',
    'sweetAlert',
    'underscore',
    'amplify'
], function (View,
             C,
             E,
             template,
             i18nLabels,
             WDSClient,
             Tree,
             MetadataViewer,
             BulkDownloads,
             DownloadSelectorsManager,
             DownloadOptions,
             pivot,
             pivotRenderers,
             pivotAggregators,
             dataConfig,
             swal,
             _) {

    'use strict';

    var s,
        DownloadView;

    s = {

        TREE: "#tree",
        METADATA: "metadata",
        INTERACTIVE_DOWNLOAD: "interactive_download_selectors",
        BULK_DOWNLOADS: "bulk_downloads"

    };

    DownloadView = View.extend({

        autoRender: true,

        className: 'download',

        template: template,

        initialize: function (options) {
            this.options = options;
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {download: 'download'});

            this.initVariables();

            this.initComponents();

            this.bindEventListeners();

            this.configurePage();
        },

        initVariables: function () {

            this.$tree = this.$el.find(s.TREE);
            this.$interactive_download = this.$el.find(s.INTERACTIVE_DOWNLOAD);
            this.$metadata = this.$el.find(s.METADATA);
            this.bulk_downloads = this.$el.find(s.BULK_DOWNLOADS);

        },

        initComponents: function () {

            /* Tree. */
            this.tree = new Tree();
            this.tree.init({
                placeholder_id: s.TREE,
                code: this.options.domain
            });

            /* Render Bulk Downloads. */
            if (this.options.section === 'bulk') {
                this.bulk_downloads = new BulkDownloads();
                this.bulk_downloads.init({
                    placeholder_id: s.BULK_DOWNLOADS,
                    domain: this.options.domain
                });
                this.bulk_downloads.create_flat_list();
                $('.nav-tabs a[href="#bulk_downloads"]').tab('show');
            }

            /* Render Interactive Download. */
            if (this.options.section === 'interactive') {

                /* Selectors manager. */
                this.download_selectors_manager = new DownloadSelectorsManager();
                this.download_selectors_manager.init({
                    placeholder_id: s.INTERACTIVE_DOWNLOAD,
                    domain: this.options.domain
                });
                $('.nav-tabs a[href="#interactive_download"]').tab('show');

                /* Preview options. */
                var preview_options_config = {
                    ok_button: true,
                    pdf_button: false,
                    excel_button: false,
                    csv_button: false,
                    lang: this.options.lang,
                    button_label: 'Preview Options',
                    header_label: 'Preview Options',
                    prefix: '_' + 'preview_',
                    placeholder_id: 'preview_options_placeholder',
                    decimal_separators: true,
                    thousand_separators: true
                };
                var preview_options = new DownloadOptions();
                preview_options.init(preview_options_config);
                preview_options.show_as_modal_window();

                /* Download options. */
                var download_options_config = {
                    lang: this.options.lang,
                    button_label: 'Download As...',
                    header_label: 'Download As...',
                    prefix: '_' + 'download_',
                    placeholder_id: 'download_options_placeholder',
                    decimal_separators: true,
                    thousand_separators: true
                };
                var download_options = new DownloadOptions();
                download_options.init(download_options_config);
                download_options.show_as_modal_window();

                /* Preview button. */
                var that = this;
                $('#preview_button').click({
                    selector_mgr: this.download_selectors_manager,
                    preview_options: preview_options
                }, function (e) {
                    that.preview(e.data.selector_mgr, e.data.preview_options);
                });

            }

            /* Render Metadata. */
            if (this.options.section === 'metadata') {
                this.metadata = new MetadataViewer();
                this.metadata.init({
                    placeholder_id: s.METADATA
                });
                $('.nav-tabs a[href="#metadata"]').tab('show');
            }

        },

        preview: function (selector_mgr, preview_options) {
            var user_selection = selector_mgr.get_user_selection();
            var dwld_options = preview_options.collect_user_selection();
            var data = {};
            var that = this;
            data = $.extend(true, {}, data, user_selection);
            data = $.extend(true, {}, data, dwld_options);
            data.datasource = 'faostat';
            data.domainCode = this.options.domain;
            data.lang = this.options.lang_faostat;
            data.limit = 50;

            var w = new WDSClient({
                //serviceUrl: C.WDS_URL,
                datasource: 'faostatdb',
                outputType : C.WDS_OUTPUT_TYPE
            });

            w.retrieve({
                outputType: 'array',
                payload: {
                    query: "EXECUTE Warehouse.dbo.usp_GetDataTEST @DomainCode = 'QC', @lang = 'E'," +
                           "@List1Codes = '(''2'')', @List2Codes = '(''2510'')', @List3Codes = '(''15'')', @List4Codes = '(''2000'')'," +
                           "@List5Codes = '', @List6Codes = '', @List7Codes = ''," +
                           "@NullValues = false, @Thousand = ',', @Decimal = '.', @DecPlaces = 2," +
                           "@Limit = 50"
                },
                success: that.show_preview
            });
        },

        show_preview: function (response) {

            /* Headers. */
            var hs = ['Domain Code', 'Domain', 'Area Code', 'Area', 'Element Code',
                      'Element', 'Item Code', 'Item', 'Year', 'Unit',
                      'Value', 'Flag', 'Flag Description'];

            /* Cast data, if needed. */
            var json = response;
            if (typeof json === 'string') {
                json = $.parseJSON(response);
            }
            json.splice(0, 0, hs);

            console.debug(json);

            /* Create OLAP. */
            dataConfig = _.extend(dataConfig, {aggregatorDisplay: pivotAggregators});
            dataConfig = _.extend(dataConfig, {rendererDisplay: pivotRenderers});
            var faostat_pivot = new pivot();
            faostat_pivot.render('downloadOutputArea', json, dataConfig);
        },

        configurePage: function () {

        },

        bindEventListeners: function () {

        },

        unbindEventListeners: function () {

        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return DownloadView;
});
