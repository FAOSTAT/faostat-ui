/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
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
             _) {

    'use strict';

    var s,
        state,
        DownloadView;

    s = {

        TREE: "#tree",

        METADATA: "metadata_container",
        METADATA_TAB: "a[href='#metadata']",

        INTERACTIVE_DOWNLOAD: "interactive_download",
        INTERACTIVE_DOWNLOAD_SELECTORS: "interactive_download_selectors",
        INTERACTIVE_DOWNLOAD_TAB: "a[href='#interactive_download']",

        BULK_DOWNLOADS: "bulk_downloads",
        BULK_DOWNLOADS_TAB: "a[href='#bulk_downloads']",

        DOWNLOAD_OUTPUT_AREA: "#downloadOutputArea",

        DOWNLOAD_OPTIONS_CSV_BUTTON: '#download_options_csv_button',
        DOWNLOAD_OPTIONS_EXCEL_BUTTON: '#download_options_excel_button',
        PREVIEW_BUTTON: '#preview_button',

        PREVIEW_OPTIONS_PLACEHOLDER: 'preview_options_placeholder',
        DOWNLOAD_OPTIONS_PLACEHOLDER: 'download_options_placeholder'
    },

        // TODO: Could be useful to pass to a FSM (i.e. for the FBS etc)
        state = {
            section: null,
            code: null
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

            this.configurePage();
        },

        initVariables: function () {

            this.$tree = this.$el.find(s.TREE);

            this.$metadata = this.$el.find(s.METADATA);
            this.$metadata_tab = this.$el.find(s.METADATA_TAB);

            // TODO fix the mix of ids?
            // TODO in theory should be the "main content"? not only the selectors?
            this.$interactive = this.$el.find("#" + s.INTERACTIVE_DOWNLOAD_SELECTORS);
            this.$interactive_tab = this.$el.find(s.INTERACTIVE_DOWNLOAD_TAB);


            // TODO fix the mix of ids?
            this.$bulk = this.$el.find("#" + s.BULK_DOWNLOADS);
            this.$bulk_tab = this.$el.find(s.BULK_DOWNLOADS_TAB);

            this.$download_ouput_area = this.$el.find(s.DOWNLOAD_OUTPUT_AREA);

            // Preview buttons
            this.$download_options_csv_button = this.$el.find(s.DOWNLOAD_OPTIONS_CSV_BUTTON);
            this.$download_options_excel_button = this.$el.find(s.DOWNLOAD_OPTIONS_EXCEL_BUTTON);
            this.$preview_button = this.$el.find(s.PREVIEW_BUTTON);
        },

        initComponents: function () {

            var code = this.options.code,
                self = this;

            this.tree = new Tree();
            this.tree.init({
                placeholder_id: s.TREE,
                code: code,
                callback: {
                    // Render Section
                    onTreeRendered: _.bind(this.initiateSection, self),
                    onClick: function (callback) {
                        self.options.code = callback.id;

                        // change URL
                        self.changeURL(false)

                        // init view
                        self.initiateSection();
                    }
                }
            });

        },

        // It's used to clear all the old informations.
        initiateSection: function() {

            this.$interactive.empty();
            this.$metadata.empty();
            this.$bulk.empty();

            // init components
            // TODO: check if everything should be here
            this.pivot = new Pivot();
            this.metadata = new MetadataViewer();
            this.bulk_downloads = new BulkDownloads();
            this.options_manager = new OptionsManager();
            this.download_selectors_manager = new DownloadSelectorsManager();

            // render the right section
            this.renderSection();

            // TODO: update download internal breadcumb and tipo on download section

            // binding events
            this.bindEventListeners();
        },

        renderSection: function(isChangeURL) {

            var codeType = this.tree.getCodeType(),
                section = this.options.section,
                code = this.options.code;

            // show hide interactive tab if needed
            if (codeType === 'group') {
                this.$interactive_tab.parent('li').hide();
            }
            else {
                this.$interactive_tab.parent('li').show();
            }

            // show the right section
            if (section === 'metadata') {
                this.renderMetadata(code);
            }

            else if (section === 'bulk') {
                this.renderBulkDownloads(code);
            }

            else if (section === 'interactive' && codeType !== 'group') {
                this.renderInteractiveDownload(code);
            }

            else {
                // TODO: in theory it's a wrong section
                // Take default action
                this.renderMetadata(code);
            }

        },

        renderInteractiveDownload: function (code) {

            // TODO: changeURL (without refresh)

            this.$interactive_tab.tab('show');

            if (this.download_selectors_manager.isNotRendered()) {

                var selector_manager_id = s.INTERACTIVE_DOWNLOAD_SELECTORS,
                    code = code,
                    self = this;

                /* Selectors manager. */
                // TODO: destroy the old this.download_selectors_manager for memory management

                this.download_selectors_manager.init({
                    placeholder_id: selector_manager_id,
                    domain: code,
                    callback: {
                        onSelectionChange: function () {
                            // TODO: For memory management improvment should be the destroy of the pivot?
                            // for the listeners etc
                            self.$download_ouput_area.empty();
                        }
                    }
                });

                /* Initiate options manager. */
                this.options_manager.init({
                    callback: {
                        onCodesChange: function (isChecked) {
                            self.pivot.showCode(isChecked);
                        },
                        onFlagsChange: function (isChecked) {
                            self.pivot.showFlags(isChecked);
                        },
                        onUnitsChange: function (isChecked) {
                            self.pivot.showUnit(isChecked);
                        }
                    }
                });

                /* Add preview options. */
                this.options_manager.add_options_panel('preview_options', {
                    ok_button: true,
                    pdf_button: false,
                    excel_button: false,
                    csv_button: false,
                    lang: this.options.lang,
                    button_label: i18nLabels.preview_options_label,
                    header_label: i18nLabels.preview_options_label,
                    placeholder_id: s.PREVIEW_OPTIONS_PLACEHOLDER,
                    decimal_separators: true,
                    thousand_separators: true,
                    units_checked: true
                });

                /* Add download options. */
                this.options_manager.add_options_window('download_options', {
                    pdf_button: false,
                    lang: this.options.lang,
                    button_label: i18nLabels.download_as_label,
                    header_label: i18nLabels.download_as_label,
                    placeholder_id: s.DOWNLOAD_OPTIONS_PLACEHOLDER,
                    decimal_separators: true,
                    thousand_separators: true,
                    units_checked: true
                });


                /* Download as CSV. */
                this.$el.find(s.DOWNLOAD_OPTIONS_CSV_BUTTON).off();
                this.$el.find(s.DOWNLOAD_OPTIONS_CSV_BUTTON).click({
                    selector_mgr: this.download_selectors_manager,
                    options_manager: this.options_manager
                }, function (e) {
                    self.pivot_caller = 'CSV';
                    self.preview(e.data.selector_mgr, e.data.options_manager);
                });

                /* Download as Excel. */
                this.$el.find(s.DOWNLOAD_OPTIONS_EXCEL_BUTTON).off();
                this.$el.find(s.DOWNLOAD_OPTIONS_EXCEL_BUTTON).click({
                    selector_mgr: this.download_selectors_manager,
                    options_manager: this.options_manager
                }, function (e) {
                    self.pivot_caller = 'XLS';
                    self.preview(e.data.selector_mgr, e.data.options_manager);
                });

                /* Preview button. */
                this.$el.find(s.PREVIEW_BUTTON).off();
                this.$el.find(s.PREVIEW_BUTTON).click({
                    selector_mgr: this.download_selectors_manager,
                    options_manager: this.options_manager
                }, function (e) {
                    self.preview(e.data.selector_mgr, e.data.options_manager);
                });
            }

        },

        renderBulkDownloads: function (code) {

            // TODO: changeURL (without refresh)

            this.$bulk_tab.tab('show');

            if (this.bulk_downloads.isNotRendered()) {
                this.bulk_downloads.init({
                    placeholder_id: s.BULK_DOWNLOADS,
                    domain: code
                });
                this.bulk_downloads.create_flat_list();
            }
        },

        renderMetadata: function (code) {

            // TODO: changeURL (without refresh)
            this.$metadata_tab.tab('show');

            if (this.metadata.isNotRendered()) {
                this.metadata.init({
                    placeholder_id: s.METADATA,
                    domain: code,
                    callback: {
                        onMetadataRendered: function () {
                            // TODO: used a generic loading for all faostat?
                            $('#metadata_loading').css('display', 'none');
                        }
                    }
                });
            }
        },


        excel: function () {
            this.pivot.exportExcel();
            this.pivot_caller = null;
        },

        csv: function () {
            this.pivot.exportCSV();
            this.pivot_caller = null;
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
            data.limit = -1;
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
                qs += "@DomainCode = '" + this.options.code + "', ";
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
                amplify.publish(E.NOTIFICATION_WARNING, {
                    title: i18nLabels.warning,
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
                // TODO: Alert?
                throw 'Please consider the "Bulk Downloads" section if you are interested in retrieving all the values of this domain. ';
            }
        },

        // TODO: move to a common util place
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
            var hs, json, that = this;

            /* Headers. */
            hs = ['Domain Code', 'Domain', 'Country Code', 'Country', 'Element Code',
                'Element', 'Item Code', 'Item', 'Year', 'Unit',
                'Value', 'Flag', 'Flag Description'];

            /* Cast data, if needed. */
            json = response;
            if (typeof json === 'string') {
                json = $.parseJSON(response);
            }

            /* Show either the pivot, or a courtesy message. */
            if (json.length !== 0) {

                /* Add headers. */
                json.splice(0, 0, hs);

                /* Create OLAP. */
                dataConfig = _.extend(dataConfig, {aggregatorDisplay: pivotAggregators});
                dataConfig = _.extend(dataConfig, {rendererDisplay: pivotRenderers});
                dataConfig = _.extend(dataConfig, {
                    onDataLoaded: function () {
                        $('.gt-hd-split').html('↔');
                        if (that.pivot_caller === 'CSV') {
                            that.csv();
                        } else if (that.pivot_caller === 'XLS') {
                            that.excel();
                        }
                    }
                });
                // TODO: fix olap to render on selector
                this.pivot.render(this.$download_ouput_area.selector.replace('#', ''), json, dataConfig);

            } else {
                this.$download_ouput_area.html('<h1 class="text-center">' + i18nLabels.no_data_available + '</h1>');
            }

        },

        configurePage: function () {

        },

        changeURL: function(reload) {

            var section = this.options.section,
                lang = this.options.lang,
                code = this.options.code;

            //console.log(section, lang, code);

            if (reload) {

                // TODO: how to handle?

            }else {

                var url = Chaplin.utils.reverse(
                    section, [lang, code]
                );

                // TODO: Use Chaplin 'route' function
                console.warn('TODO: change Backbone binding');
                Backbone.history.navigate(url, {trigger:false});
            }

        },

        bindEventListeners: function () {

            var self = this;

            // NOTE: Added using data attribute (data-section) in the template.
            // this is used for the routing
            // force the off of the binding
            this.$el.find('a[data-toggle="tab"]').off();
            this.$el.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                self.options.section  = $(e.target).data('section');
                self.changeURL();
                self.renderSection();
            });

        },

        unbindEventListeners: function () {

            this.$el.find('a[data-toggle="tab"]').off();

        },

        dispose: function () {

            console.warn("TODO: dispose correctly");

            this.unbindEventListeners();

            // TODO: dispose of all the components
            //this.tree = new Tree();
            //this.pivot = new Pivot();
            //this.metadata = new MetadataViewer();
            //this.bulk_downloads = new BulkDownloads();
            //this.options_manager = new OptionsManager();
            //this.download_selectors_manager = new DownloadSelectorsManager();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return DownloadView;
});
