/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
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
    'FAOSTAT_UI_OPTIONS_MANAGER',
    'pivot',
    'pivotRenderers',
    'pivotAggregators',
    'pivotConfig',
    'chaplin',
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
             OptionsManager,
             Pivot,
             pivotRenderers,
             pivotAggregators,
             dataConfig,
             Chaplin,
             swal,
             _) {

    'use strict';

    var s,
        DownloadView;

    s = {

        TREE: "#tree",
        METADATA: "metadata_container",
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

            var that = this;
            this.tree = new Tree();
            this.pivot = new Pivot();
            this.metadata = new MetadataViewer();
            this.bulk_downloads = new BulkDownloads();
            this.options_manager = new OptionsManager();
            this.download_selectors_manager = new DownloadSelectorsManager();

            /* Tree. */
            this.tree.init({
                placeholder_id: s.TREE,
                code: this.options.domain,
                callback: {
                    onTreeRendered: this.update_breadcrumbs,
                    onClick: function (callback) {
                        Chaplin.utils.redirectTo('download#show_' + that.options.section, {lang: that.options.lang, domain: callback.id});
                    }
                }
            });

            /* Render Bulk Downloads. */
            if (this.options.section === 'bulk_downloads') {
                that.render_bulk_downloads();
            }

            /* Render Interactive Download. */
            if (this.options.section === 'interactive_download') {
                that.render_interactive_download();
            }

            /* Render Metadata. */
            if (this.options.section === 'metadata') {
                this.render_metadata();
            }

            /* onTabChange. */
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var target = $(e.target).attr('href');
                if (target.indexOf('metadata') > -1) {
                    that.render_metadata();
                    that.options.section = 'metadata';
                } else if (target.indexOf('interactive_download') > -1) {
                    that.render_interactive_download();
                    that.options.section = 'interactive_download';
                } else if (target.indexOf('bulk_downloads') > -1) {
                    that.render_bulk_downloads();
                    that.options.section = 'bulk_downloads';
                }
            });

        },

        render_interactive_download: function () {

            if (this.download_selectors_manager.isNotRendered()) {

                /* That... */
                var that = this;

                /* Selectors manager. */
                this.download_selectors_manager.init({
                    placeholder_id: s.INTERACTIVE_DOWNLOAD,
                    domain: this.options.domain
                });
                $('.nav-tabs a[href="#interactive_download"]').tab('show');

                /* Initiate options manager. */
                this.options_manager.init();

                /* Add preview options. */
                this.options_manager.add_options_window('preview_options', {
                    ok_button: true,
                    pdf_button: false,
                    excel_button: false,
                    csv_button: false,
                    lang: this.options.lang,
                    button_label: i18nLabels.preview_options_label,
                    header_label: i18nLabels.preview_options_label,
                    placeholder_id: 'preview_options_placeholder',
                    decimal_separators: true,
                    thousand_separators: true

                });

                /* Add download options. */
                this.options_manager.add_options_window('download_options', {
                    pdf_button: false,
                    lang: this.options.lang,
                    button_label: i18nLabels.download_as_label,
                    header_label: i18nLabels.download_as_label,
                    placeholder_id: 'download_options_placeholder',
                    decimal_separators: true,
                    thousand_separators: true
                });

                /* Disable download options until the pivot is generated. */
                $('#download_options_modal_window_button').prop('disabled', true);

                /* Download as CSV. */
                $('#download_options_csv_button').click({
                    selector_mgr: this.download_selectors_manager,
                    options_manager: this.options_manager
                }, function (e) {
                    console.debug('click: CSV');
                    that.csv(e.data.selector_mgr, e.data.options_manager);
                });

                /* Download as Excel. */
                $('#download_options_excel_button').click({
                    selector_mgr: this.download_selectors_manager,
                    options_manager: this.options_manager
                }, function (e) {
                    console.debug('click: Excel');
                    that.excel(e.data.selector_mgr, e.data.options_manager);
                });

                /* Preview button. */
                $('#preview_button').click({
                    selector_mgr: this.download_selectors_manager,
                    options_manager: this.options_manager
                }, function (e) {
                    that.preview(e.data.selector_mgr, e.data.options_manager);
                });

            }

        },

        render_bulk_downloads: function () {
            if (this.bulk_downloads.isNotRendered()) {
                this.bulk_downloads.init({
                    placeholder_id: s.BULK_DOWNLOADS,
                    domain: this.options.domain
                });
                this.bulk_downloads.create_flat_list();
                $('.nav-tabs a[href="#bulk_downloads"]').tab('show');
            }
        },

        render_metadata : function () {
            $('.nav-tabs a[href="#metadata"]').tab('show');
            if (this.metadata.isNotRendered()) {
                this.metadata.init({
                    placeholder_id: s.METADATA,
                    domain: this.options.domain,
                    callback: {
                        onMetadataRendered: function () {
                            $('#metadata_loading').css('display', 'none');
                        }
                    }
                });
            }
        },

        update_breadcrumbs: function (node_code) {
            var node,
                parent_code,
                parent_node;
            node = $('#tree').jstree().get_node(node_code.toUpperCase());
            $('#group_label').html('<a>' + node.text + '</a>');
            parent_code = node.parent;
            if (parent_code !== '#') {
                parent_node = $('#tree').jstree().get_node(parent_code.toUpperCase());
                $('#domain_label').html('> <a>' + parent_node.text + '</a>');
            }
        },

        excel: function (options_manager) {
            console.debug('download excel: start...');
            this.pivot.exportExcel();
            console.debug('download excel: done!');
        },

        csv: function (options_manager) {
            var dwld_options;
            dwld_options = this.options_manager.get_options_window('download_options').collect_user_selection();
            console.debug(dwld_options);
            console.debug('download csv: start...');
            this.pivot.exportCSV();
            console.debug('download csv: done!');
        },

        preview: function (selector_mgr, options_manager) {
            var user_selection,
                dwld_options,
                data = {},
                that = this,
                w;
            user_selection = selector_mgr.get_user_selection();
            dwld_options = options_manager.get_options_window('preview_options').collect_user_selection();
            data = $.extend(true, {}, data, user_selection);
            data = $.extend(true, {}, data, dwld_options);
            data.datasource = 'faostat';
            data.domainCode = this.options.domain;
            data.lang = this.options.lang_faostat;
            data.limit = 50;
            w = new WDSClient({
                datasource: 'faostatdb',
                outputType : C.WDS_OUTPUT_TYPE
            });
            w.retrieve({
                outputType: 'array',
                payload: {
                    query: this.create_query_string(user_selection)
                },
                success: that.show_preview,
                context: this
            });
        },

        create_query_string: function (user_selection) {
            try {
                this.validate_user_selection(user_selection);
                var count,
                    qs = "EXECUTE Warehouse.dbo.usp_GetDataTEST ";
                qs += "@DomainCode = '" + this.options.domain + "', ";
                qs += "@lang = '" + this.iso2faostat(this.options.lang) + "', ";
                for (count = 1; count < 8; count += 1) {
                    qs += this.encode_codelist(count, user_selection["list" + count + "Codes"]);
                    if (count < 8) {
                        qs += ", ";
                    }
                }
                qs += "@NullValues = false, ";
                qs += "@Thousand = ',', ";
                qs += "@Decimal = '.', ";
                qs += "@DecPlaces = 2, ";
                qs += "@Limit = 50";
                return qs;
            } catch (e) {
                swal({
                    title: i18nLabels.warning,
                    type: 'warning',
                    text: e
                });
            }
        },

        validate_user_selection: function (user_selection) {

            /* Variables. */
            var i, selectAll;

            /* Check there's at least one selection for each box. */
            for (i = 1; i <= this.download_selectors_manager.CONFIG.rendered_boxes.length; i += 1) {
                if (user_selection['list' + i + 'Codes'].length < 1) {
                    throw 'Please make at least one selection for "' + $('#tab_headers__' + i + ' li:first-child').text().trim() + '".';
                }
            }

            /* Check whether he user used 'Select All' for every box. */
            for (i = 1; i <= this.download_selectors_manager.CONFIG.rendered_boxes.length; i += 1) {
                if (selectAll === undefined) {
                    selectAll = $('#content__' + i + '_0').jstree().get_json('#', { "flat" : true }).length === user_selection['list' + i + 'Codes'].length;
                } else {
                    selectAll = selectAll && $('#content__' + i + '_0').jstree().get_json('#', { "flat" : true }).length === user_selection['list' + i + 'Codes'].length;
                }
            }
            if (selectAll) {
                throw 'Please consider the "Bulk Downloads" section if you are interested in retrieving all the values of this domain. ';
            }
        },

        iso2faostat: function (iso) {
            switch (iso.toLowerCase()) {
            case 'fr':
                return 'F';
            case 'es':
                return 'S';
            default:
                return 'E';
            }
        },

        encode_codelist: function (idx, codes) {
            var h, l = "";
            l += "@List" + idx + "Codes = ";
            if (codes.length > 0) {
                l += "'(";
                for (h = 0; h < codes.length; h += 1) {
                    l += "'" + codes[h] + "'";
                    if (h < codes.length - 1) {
                        l += ",";
                    }
                }
                l += ")'";
            } else {
                l += "''";
            }
            return l;
        },

        show_preview: function (response) {

            /* Variables. */
            var that = this,
                hs,
                json;

            /* Headers. */
            hs = ['Domain Code', 'Domain', 'Country Code', 'Country', 'Element Code',
                  'Element', 'Item Code', 'Item', 'Year', 'Unit',
                  'Value', 'Flag', 'Flag Description'];

            /* Cast data, if needed. */
            json = response;
            if (typeof json === 'string') {
                json = $.parseJSON(response);
            }
            json.splice(0, 0, hs);

            /* Create OLAP. */
            dataConfig = _.extend(dataConfig, {aggregatorDisplay: pivotAggregators});
            dataConfig = _.extend(dataConfig, {rendererDisplay: pivotRenderers});
            this.pivot.render('downloadOutputArea', json, dataConfig);

            /* Bind preview options. */
            this.options_manager.get_options_window('preview_options').get_radio_button('flags').change(function () {
                that.pivot.showFlags($(this).is(':checked'));
            });
            this.options_manager.get_options_window('preview_options').get_radio_button('unit').change(function () {
                that.pivot.showUnit($(this).is(':checked'));
            });
            this.options_manager.get_options_window('preview_options').get_radio_button('codes').change(function () {
                that.pivot.showCode($(this).is(':checked'));
            });

            /* Bind download options. */
            this.options_manager.get_options_window('download_options').get_radio_button('flags').change(function () {
                that.pivot.showFlags($(this).is(':checked'));
            });
            this.options_manager.get_options_window('download_options').get_radio_button('unit').change(function () {
                that.pivot.showUnit($(this).is(':checked'));
            });
            this.options_manager.get_options_window('download_options').get_radio_button('codes').change(function () {
                that.pivot.showCode($(this).is(':checked'));
            });

            /* Enable download options. */
            $('#download_options_modal_window_button').prop('disabled', false);

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
