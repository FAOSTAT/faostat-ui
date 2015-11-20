/*global define, _:false, $, console, amplify, FM, setInterval, clearInterval, document, window*/
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
    'chaplin',
    'underscore',
    'globals/Common',
    'faostatapiclient',
    'pivot_exporter',
    'FAOSTAT_UI_TABLE',
    'fx-report',
    'FAOSTAT_UI_PIVOT',
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
             Chaplin,
             _,
             Common,
             FAOSTATAPIClient,
             PivotExporter,
             Table,
             FENIX_UI_REPORTS,
             FAOSTATPivot) {

    'use strict';

    var s = {

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
        DOWNLOAD_OPTIONS_CSV_INFO_BUTTON: '#download_options_csv_info_button',
        DOWNLOAD_OPTIONS_EXCEL_BUTTON: '#download_options_excel_button',
        DOWNLOAD_OPTIONS_METADATA_BUTTON: '#download_options_metadata_button',
        PREVIEW_BUTTON: '#preview_button',

        PREVIEW_OPTIONS_PLACEHOLDER: 'preview_options_placeholder',
        DOWNLOAD_OPTIONS_PLACEHOLDER: 'download_options_placeholder'

    };

    // TODO: Could be useful to pass to a FSM (i.e. for the FBS etc)
    var state = {
        section: null,
        code: null
    };

    var DownloadView = View.extend({

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

            // Google Analytics change page
            amplify.publish(E.GOOGLE_ANALYTICS_PAGE_VIEW, {});

            //update State
            amplify.publish(E.STATE_CHANGE, {download: 'download'});

            this.initVariables();

            this.initComponents();

            this.configurePage();
        },

        initVariables: function () {

            // added language
            // TODO: change parameter path/name?
            this.options.lang = Common.getLocale();

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

            /* Initiate FAOSTAT API's client. */
            this.api = new FAOSTATAPIClient();

            /* Initiate pivot exporter. */
            this.pivot_exporter = new PivotExporter({
                placeholder_id: 'downloadOutputArea',
                filename: 'FAOSTAT',
                url_csv2excel: 'http://fenixapps2.fao.org/api/v1.0/csv2excel/',
                url_output: 'http://fenixapps2.fao.org/api/v1.0/excels/'
            });

            /* Table settings. */
            this.page_size = 60;

            /* Preview settings. */
            this.size_limit = 1000;

        },

        initComponents: function () {

            var code = this.options.code,
                self = this;

            this.tree = new Tree();
            this.tree.init({
                lang: this.options.lang,
                placeholder_id: s.TREE,
                code: code,
                callback: {
                    // Render Section
                    onTreeRendered: _.bind(this.initiateSection, self),
                    onClick: function (callback) {
                        self.options.code = callback.id;

                        // change URL
                        //self.changeURL(false)
                        Common.changeURL(self.options.section, [self.options.code], false);

                        // init view
                        self.initiateSection();
                    }
                }
            });

        },

        // It's used to clear all the old informations.
        initiateSection: function () {

            this.$interactive.empty();
            this.$metadata.empty();
            this.$bulk.empty();

            // init components
            // TODO: check if everything should be here
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

        renderSection: function (isChangeURL) {

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
                    lang: this.options.lang,
                    placeholder_id: selector_manager_id,
                    domain: code,
                    callback: {
                        onSelectionChange: function () {
                            // TODO: For memory management improvement should be the destroy of the pivot?
                            // for the listeners etc
                            self.$download_ouput_area.empty();
                        }
                    }
                });

                /* Initiate options manager. */
                this.options_manager.init({
                    callback: {
                        onOutputTypeChange: function () {
                            $('#downloadOutputArea').empty();
                            self.preview_size();
                        },
                        onCodesChange: function (isChecked) {
                            if (isChecked) {
                                $('th[data-type="code"]').css('display', 'table-cell');
                                $('td[data-type="code"]').css('display', 'table-cell');
                            } else {
                                $('th[data-type="code"]').css('display', 'none');
                                $('td[data-type="code"]').css('display', 'none');
                            }
                        },
                        onFlagsChange: function (isChecked) {
                            if (isChecked) {
                                $('th[data-type="flag"]').css('display', 'table-cell');
                                $('td[data-type="flag"]').css('display', 'table-cell');
                                $('th[data-type="flag_label"]').css('display', 'table-cell');
                                $('td[data-type="flag_label"]').css('display', 'table-cell');
                            } else {
                                $('th[data-type="flag"]').css('display', 'none');
                                $('td[data-type="flag"]').css('display', 'none');
                                $('th[data-type="flag_label"]').css('display', 'none');
                                $('td[data-type="flag_label"]').css('display', 'none');
                            }
                        },
                        onUnitsChange: function (isChecked) {
                            if (isChecked) {
                                $('th[data-type="unit"]').css('display', 'table-cell');
                                $('td[data-type="unit"]').css('display', 'table-cell');
                            } else {
                                $('th[data-type="unit"]').css('display', 'none');
                                $('td[data-type="unit"]').css('display', 'none');
                            }
                        },
                        onDecimalNumbersChange: function () {
                            self.preview_size();
                        },
                        onDecimalSeparatorChange: function () {
                            self.preview_size();
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
                    units_checked: true,
                    codes_value: true
                });

                /* Add download options. */
                this.options_manager.add_options_window('download_options', {
                    pdf_button: false,
                    lang: this.options.lang,
                    button_label: i18nLabels.download_as_label,
                    header_label: i18nLabels.download_as_label,
                    placeholder_id: s.DOWNLOAD_OPTIONS_PLACEHOLDER,
                    decimal_separators: false,
                    thousand_separators: false,
                    units_checked: true,
                    excel_button: false,
                    metadata_button: true,
                    codes_value: true
                });


                /* Download as CSV. */
                this.$el.find(s.DOWNLOAD_OPTIONS_CSV_BUTTON).off();
                this.$el.find(s.DOWNLOAD_OPTIONS_CSV_BUTTON).click(function (e) {
                    self.pivot_caller = 'CSV';
                    self.preview_size();
                });

                /* CSV info. */
                this.$el.find(s.DOWNLOAD_OPTIONS_CSV_INFO_BUTTON).off();
                this.$el.find(s.DOWNLOAD_OPTIONS_CSV_INFO_BUTTON).click(function (e) {
                    var url;
                    switch (self.options.lang) {
                    case 'fr':
                        url = 'https://fr.wikipedia.org/wiki/Comma-separated_values';
                        break;
                    case 'es':
                        url = 'https://es.wikipedia.org/wiki/CSV';
                        break;
                    default:
                        url = 'https://en.wikipedia.org/wiki/Comma-separated_values';
                        break;
                    }
                    window.open(url, '_blank');
                });

                /* Download as Excel. */
                this.$el.find(s.DOWNLOAD_OPTIONS_EXCEL_BUTTON).off();
                this.$el.find(s.DOWNLOAD_OPTIONS_EXCEL_BUTTON).click(function (e) {
                    self.pivot_caller = 'XLS';
                    self.preview_size();
                });

                /* Metadata. */
                this.$el.find(s.DOWNLOAD_OPTIONS_METADATA_BUTTON).off();
                this.$el.find(s.DOWNLOAD_OPTIONS_METADATA_BUTTON).click(function (e) {
                    var url = 'http://fenixapps2.fao.org/fenixExport',
                        payload = {
                            input: {
                                config: {
                                    uid: self.options.code
                                }
                            },
                            output: {
                                config: {
                                    lang: self.options.lang.toString().toUpperCase(),
                                    fileName: $('#tree').find('.jstree-anchor.jstree-clicked').text().replace(/\s/g, '_') + '_Metadata.pdf'
                                }
                            }
                        },
                        fenix_export = new FENIX_UI_REPORTS();
                    fenix_export.init('metadataExport');
                    fenix_export.exportData(payload, url);
                });

                /* Preview button. */
                this.$el.find(s.PREVIEW_BUTTON).off();
                this.$el.find(s.PREVIEW_BUTTON).click(function (e) {
                    self.preview_size();
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
            this.pivot_exporter.excel();
        },

        csv: function () {
            this.pivot_exporter.csv();
        },

        preview_size: function (config) {

            var user_selection,
                dwld_options,
                data = {},
                that = config !== undefined ? config.context || this : this,
                data_size;

            try {

                user_selection = that.download_selectors_manager.get_user_selection();
                dwld_options = that.options_manager.get_options_window('preview_options').collect_user_selection(null);

                /* Validate user selection. */
                this.validate_user_selection(user_selection);

                /* Calculate the output size if the user selected PIVOT as output type. */
                if (dwld_options.output_type === 'PIVOT') {

                    data = $.extend(true, {}, data, user_selection);
                    data = $.extend(true, {}, data, dwld_options);
                    data.datasource = 'faostat';
                    data.domainCode = that.options.domain;
                    data.lang = that.options.lang;
                    data.limit = -1;

                    /* Add loading. */
                    amplify.publish(E.WAITING_SHOW, {});

                    this.api.datasize({
                        domain_code: that.options.code,
                        List1Codes: user_selection.list1Codes || null,
                        List2Codes: user_selection.list2Codes || null,
                        List3Codes: user_selection.list3Codes || null,
                        List4Codes: user_selection.list4Codes || null,
                        List5Codes: user_selection.list5Codes || null,
                        List6Codes: user_selection.list6Codes || null,
                        List7Codes: user_selection.list7Codes || null,
                        lang: that.options.lang
                    }).then(function (json) {

                        /* Parse query size. */
                        data_size = parseFloat(json.data[0].NoRecords);

                        /* Close waiting window. */
                        amplify.publish(E.WAITING_HIDE, {});

                        /* Query size exceeds the limit. */
                        if (data_size > that.size_limit) {
                            amplify.publish(E.NOTIFICATION_WARNING, {
                                title: i18nLabels.warning,
                                text: 'The size of your query exceeds the limit. Please consider to download data through the Bulk Downloads section, or switch to the Table output type.'
                            });
                        } else {
                            that.preview(config);
                        }

                    }).fail(function () {

                        /* Close waiting window. */
                        amplify.publish(E.WAITING_HIDE, {});

                        amplify.publish(E.NOTIFICATION_WARNING, {
                            title: i18nLabels.warning,
                            text: 'The size of your query exceeds the limit. Please consider to download data through the Bulk Downloads section, or switch to the Table output type.'
                        });

                    });

                } else {
                    that.preview(config);
                }

            } catch (e) {

                /* Close waiting window. */
                amplify.publish(E.WAITING_HIDE, {});

                amplify.publish(E.NOTIFICATION_WARNING, {
                    title: i18nLabels.warning,
                    text: e.responseText
                });

            }

        },

        preview: function (config) {

            var user_selection,
                dwld_options,
                data = {},
                that = config !== undefined ? config.context || this : this;

            try {

                user_selection = that.download_selectors_manager.get_user_selection();
                dwld_options = that.options_manager.get_options_window('preview_options').collect_user_selection(null);

                /* Validate user selection. */
                this.validate_user_selection(user_selection);

                data = $.extend(true, {}, data, user_selection);
                data = $.extend(true, {}, data, dwld_options);
                data.datasource = 'faostat';
                data.domainCode = that.options.domain;
                data.lang = that.options.lang;
                data.limit = -1;

                /* Add loading. */
                amplify.publish(E.WAITING_SHOW, {});

                this.api.data({
                    domain_code: that.options.code,
                    List1Codes: user_selection.list1Codes || null,
                    List2Codes: user_selection.list2Codes || null,
                    List3Codes: user_selection.list3Codes || null,
                    List4Codes: user_selection.list4Codes || null,
                    List5Codes: user_selection.list5Codes || null,
                    List6Codes: user_selection.list6Codes || null,
                    List7Codes: user_selection.list7Codes || null,
                    lang: that.options.lang,
                    page_size: that.page_size,
                    page_number: config !== undefined ? config.page_number || 1 : 1,
                    group_by: null,
                    decimal_places: 2
                }).then(function (json) {
                    that.show_preview(json);
                });

            } catch (e) {
                amplify.publish(E.NOTIFICATION_WARNING, {
                    title: i18nLabels.warning,
                    text: e
                });
            }

        },

        map_codes: function (data_response) {
            var map = {},
                i,
                j,
                d = data_response.data,
                m = data_response.metadata,
                code_label_map = {},
                header_codelabel_map = {};
            try {
                for (i = 0; i < m.dsd.length; i += 1) {
                    if (m.dsd[i].dimension_id !== undefined) {
                        if (m.dsd[i].type === 'code' || m.dsd[i].type === 'flag') {
                            if (code_label_map[m.dsd[i].dimension_id] === undefined) {
                                code_label_map[m.dsd[i].dimension_id] = {};
                            }
                            if (code_label_map[m.dsd[i].dimension_id].code === undefined) {
                                code_label_map[m.dsd[i].dimension_id].code = m.dsd[i].key;
                            }
                        }
                        if (m.dsd[i].type === 'label' || m.dsd[i].type === 'flag_label') {
                            if (code_label_map[m.dsd[i].dimension_id] === undefined) {
                                code_label_map[m.dsd[i].dimension_id] = {};
                            }
                            if (code_label_map[m.dsd[i].dimension_id].label === undefined) {
                                code_label_map[m.dsd[i].dimension_id].label = m.dsd[i].key;
                            }
                        }
                    }
                }
            } catch (e) {
                console.debug(e);
            }
            console.debug(code_label_map);
            for (i = 0; i < m.dsd.length; i += 1) {
                if (m.dsd[i].dimension_id !== undefined) {
                    if (m.dsd[i].type === 'label' || m.dsd[i].type === 'flag_label') {
                        header_codelabel_map[m.dsd[i].label] = {
                            code: code_label_map[m.dsd[i].dimension_id].code,
                            label: code_label_map[m.dsd[i].dimension_id].label
                        };
                    }
                }
            }
            console.debug(header_codelabel_map);
            for (i = 0; i < d.length; i += 1) {
                for (j = 0; j < Object.keys(header_codelabel_map).length; j += 1) {
                    var code_idx = header_codelabel_map[Object.keys(header_codelabel_map)[j]].code;
                    var label_idx = header_codelabel_map[Object.keys(header_codelabel_map)[j]].label;
                    map[d[i][label_idx]] = d[i][code_idx];
                }
            }
            console.debug(map);
            this.label2code_map = map;
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
            var i,
                selectAll;

            /* Check there's at least one selection for each box. */
            for (i = 0; i < this.download_selectors_manager.CONFIG.rendered_boxes.length; i += 1) {
                if (user_selection['list' + (i + 1) + 'Codes'].length < 1) {
                    throw 'Please make at least one selection for "' + $('#tab_headers__' + i + ' li:first-child').text().trim() + '".';
                }
            }

            /* Check whether he user used 'Select All' for every box. */
            for (i = 1; i <= this.download_selectors_manager.CONFIG.rendered_boxes.length; i += 1) {
                if (selectAll === undefined) {
                    selectAll = $('#content__' + i + '_0').jstree().get_json('#', {"flat": true}).length === user_selection['list' + i + 'Codes'].length;
                } else {
                    selectAll = selectAll && $('#content__' + i + '_0').jstree().get_json('#', {"flat": true}).length === user_selection['list' + i + 'Codes'].length;
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
            var downloadOutputArea = $('#downloadOutputArea'),
                timer,
                test,
                that = this,
                metadata,
                table,
                dwld_options = this.options_manager.get_options_window('preview_options').collect_user_selection(null),
                user_selection,
                pivot_table;

            /* Render either the table or the pivot. */
            switch (this.options_manager.get_options_window('preview_options').get_output_type()) {

            case 'TABLE':
                table = new Table();
                try {
                    table.init({
                        placeholder_id: 'downloadOutputArea',
                        data: response.data,
                        metadata: response.metadata,
                        show_units: dwld_options.units_value,
                        show_flags: dwld_options.flags_value,
                        show_codes: dwld_options.codes_value,
                        decimal_places: dwld_options.decimal_numbers_value,
                        decimal_separator: dwld_options.decimal_separator_value,
                        thousand_separator: dwld_options.thousand_separator_value,
                        page_size: this.page_size,
                        onPageClick: this.preview,
                        context: this
                    });
                } catch (e) {
                    console.debug(e);
                }
                break;

            case 'PIVOT':

                pivot_table = new FAOSTATPivot();
                pivot_table.init({
                    placeholder_id: 'downloadOutputArea',
                    data: response.data,
                    dsd: response.metadata.dsd
                });

                break;

            }

            /* Close waiting window. */
            amplify.publish(E.WAITING_HIDE, {});

            /* Export CSV or Excel, if required. */
            switch (this.options_manager.get_options_window('preview_options').get_output_type()) {

            case 'PIVOT':
                if (this.pivot_caller === 'CSV') {
                    timer = setInterval(function () {
                        test = downloadOutputArea.html();
                        if (test !== '') {
                            clearInterval(timer);
                            that.pivot_exporter.csv();
                        }
                    }, 100);
                } else if (this.pivot_caller === 'XLS') {
                    timer = setInterval(function () {
                        test = downloadOutputArea.html();
                        if (test !== '') {
                            clearInterval(timer);
                            metadata = '"Datasource", "FAOSTAT"\n"Domain Name", "';
                            metadata += $("#" + that.options.code + " a").text();
                            metadata += '"\n"Retrieved", ' + new Date();
                            that.pivot_exporter.excel(metadata);
                        }
                    }, 100);
                }
                break;
            case 'TABLE':
                if (this.pivot_caller === 'CSV') {
                    user_selection = that.download_selectors_manager.get_user_selection();
                    try {
                        this.api.data({
                            domain_code: that.options.code,
                            List1Codes: user_selection.list1Codes || null,
                            List2Codes: user_selection.list2Codes || null,
                            List3Codes: user_selection.list3Codes || null,
                            List4Codes: user_selection.list4Codes || null,
                            List5Codes: user_selection.list5Codes || null,
                            List6Codes: user_selection.list6Codes || null,
                            List7Codes: user_selection.list7Codes || null,
                            lang: that.options.lang,
                            group_by: null,
                            output_type: 'csv'
                        }).then(function (csv) {
                            //console.debug(csv);
                        }).fail(function (error) {
                            var csvString = error.responseText,
                                a = document.createElement('a'),
                                filename = $('#tree').find('.jstree-anchor.jstree-clicked').text().replace(/\s/g, '_') + '_' + (new Date()).getTime() + '.csv';
                            a.href        = 'data:text/csv;charset=utf-8;base64,' + window.btoa(csvString);
                            a.target      = '_blank';
                            a.download    = filename;
                            document.body.appendChild(a);
                            a.click();
                        });
                    } catch (e) {
                        console.debug(e);
                    }
                }
                break;

            }

        },

        pivot_value_formatter: function (V) {
            var res = null;
            if (typeof V === 'number') {
                res = V.toFixed(2);
            }
            return res;
        },

        create_table_headers: function (dsd) {
            var headers = [], i, lbl;
            for (i = 0; i < dsd.length; i += 1) {
                headers.push('tmp');
            }
            for (i = 0; i < dsd.length; i += 1) {
                lbl = dsd[i].label;
                if (lbl === 'Unit Description') {
                    lbl = 'Unit';
                }
                headers[Number(dsd[i].index)] = lbl;
            }
            for (i = dsd.length; i >= 0; i -= 1) {
                if (headers[i] === 'tmp') {
                    headers.shift();
                }
            }
            return headers;
        },

        configurePage: function () {

        },

        bindEventListeners: function () {

            var self = this;

            // NOTE: Added using data attribute (data-section) in the template.
            // this is used for the routing
            // force the off of the binding
            this.$el.find('a[data-toggle="tab"]').off();
            this.$el.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                self.options.section = $(e.target).data('section');
                Common.changeURL(self.options.section, [self.options.code], false);
                self.renderSection();
            });

        },

        unbindEventListeners: function () {

            this.$el.find('a[data-toggle="tab"]').off();

        },

        dispose: function () {

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
