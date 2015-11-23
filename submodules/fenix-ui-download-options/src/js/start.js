/*global define*/
define(['jquery',
        'handlebars',
        'text!fenix_ui_download_options/html/templates.hbs',
        'i18n!fenix_ui_download_options/nls/translate',
        'bootstrap',
        'sweetAlert',
        'amplify'], function ($, Handlebars, templates, translate) {

    'use strict';

    function OPTIONS() {

        this.CONFIG = {

            mode: 'window',

            lang: 'E',
            placeholder_id: 'placeholder',
            user_selection: {},
            prefix: 'fenix_',

            excel_button: true,
            metadata_button: false,
            pdf_button: true,
            ok_button: false,
            csv_button: true,

            decimal_separators: true,
            thousand_separators: true,
            decimal_numbers: true,
            show_options: true,
            output_type: true,

            pdf_button_id: 'pdf_button_id',
            csv_button_id: 'csv_button_id',
            excel_button_id: 'excel_button_id',
            metadata_button_id: 'metadata_button_id',
            decimal_separator_id: 'decimal_separator',
            thousand_separator_id: 'thousand_separator',
            decimal_numbers_id: 'decimal_numbers',
            flags_id: 'flags',
            codes_id: 'codes',
            units_id: 'units',
            null_values_id: 'null_values',

            button_label: translate.download_as,
            header_label: translate.button,

            decimal_numbers_value: 2,
            decimal_separator_value: '.',
            thousand_separator_value: ',',
            flags_value: true,
            codes_value: true,
            units_value: true,
            null_values_value: false,

            table_value: true,
            pivot_value: false,

            callback: {
                onDecimalSeparatorChange: null,
                onDecimalNumbersChange: null,
                onCodesChange: null,
                onFlagsChange: null,
                onOutputTypeChange: null,
                onUnitsChange: null
            }

        };

    }

    OPTIONS.prototype.init = function (config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang !== null ? this.CONFIG.lang : 'E';

    };

    OPTIONS.prototype.apply_configuration = function () {

        /* Variables. */
        var that = this,
            partial_source,
            source,
            template,
            dynamic_data,
            html;

        /* Render template according to the mode: window (default) or panel. */
        if (this.CONFIG.mode === 'window') {

            /* Register Handlebars's partial. */
            partial_source = $(templates).filter('#options_panel').html();
            Handlebars.registerPartial('options_panel', partial_source);

            /* Load button template. */
            source = $(templates).filter('#modal_window_button').html();
            template = Handlebars.compile(source);

        } else if (this.CONFIG.mode === 'panel') {

            /* Load panel template. */
            source = $(templates).filter('#options_panel').html();
            template = Handlebars.compile(source);

        }

        /* Inject values in the placeholders. */
        dynamic_data = {
            ok_button_label: 'OK',
            pdf_label: translate.pdf,
            csv_label: translate.csv,
            metadata_label: translate.metadata,
            ok: this.CONFIG.ok_button,
            show_label: translate.show,
            prefix: this.CONFIG.prefix,
            pdf: this.CONFIG.pdf_button,
            csv: this.CONFIG.csv_button,
            metadata: this.CONFIG.metadata_button,
            excel_label: translate.excel,
            flags_label: translate.flags,
            comma_label: translate.comma,
            codes_label: translate.codes,
            units_label: translate.units,
            period_label: translate.period,
            excel: this.CONFIG.excel_button,
            show_options: this.CONFIG.show_options,
            null_values_label: translate.null_values,
            decimal_numbers: this.CONFIG.decimal_numbers,
            decimal_numbers_label: translate.decimal_numbers,
            decimal_separators: this.CONFIG.decimal_separators,
            modal_window_button_label: this.CONFIG.button_label,
            modal_window_header_label: this.CONFIG.header_label,
            decimal_separator_label: translate.decimal_separator,
            thousand_separators: this.CONFIG.thousand_separators,
            thousand_separator_label: translate.thousand_separator,
            decimal_numbers_value: this.CONFIG.decimal_numbers_value,
            decimal_separator_comma_checked: this.CONFIG.decimal_separator_value === ',' ? 'checked' : '',
            decimal_separator_period_checked: this.CONFIG.decimal_separator_value === '.' ? 'checked' : '',
            thousand_separator_comma_checked: this.CONFIG.thousand_separator_value === ',' ? 'checked' : '',
            thousand_separator_period_checked: this.CONFIG.thousand_separator_value === '.' ? 'checked' : '',
            flags_checked: this.CONFIG.flags_value ? 'checked' : '',
            codes_checked: this.CONFIG.codes_value ? 'checked' : '',
            units_checked: this.CONFIG.units_value ? 'checked' : '',
            null_values_checked: this.CONFIG.null_values_value ? 'checked' : '',
            output_type: this.CONFIG.output_type,
            output_type_label: translate.output_type,
            table_label: translate.table,
            pivot_label: translate.pivot,
            output_type_table_checked: this.CONFIG.table_value === true ? 'checked' : '',
            output_type_pivot_checked: this.CONFIG.pivot_value === true ? 'checked' : ''
        };
        html = template(dynamic_data);
        $('#' + that.CONFIG.placeholder_id).html(html);

        /* Apply listeners. */
        this.apply_listeners();

    };

    OPTIONS.prototype.apply_listeners = function () {

        /* Variables. */
        var that = this;

        /* Listeners for radio button changes. */
        $('#' + this.CONFIG.prefix + 'codes').change(function () {
            if (that.CONFIG.callback.onCodesChange) {
                that.CONFIG.callback.onCodesChange($(this).is(':checked'));
            }
        });
        $('#' + this.CONFIG.prefix + 'unit').change(function () {
            if (that.CONFIG.callback.onUnitsChange) {
                that.CONFIG.callback.onUnitsChange($(this).is(':checked'));
            }
        });
        $('#' + this.CONFIG.prefix + 'flags').change(function () {
            if (that.CONFIG.callback.onFlagsChange) {
                that.CONFIG.callback.onFlagsChange($(this).is(':checked'));
            }
        });
        $('#' + this.CONFIG.prefix + 'output_type').change(function () {
            if (that.CONFIG.callback.onOutputTypeChange) {
                that.CONFIG.callback.onOutputTypeChange($(this).is(':checked'));
            }
        });
        $('#' + this.CONFIG.prefix + 'output_type_pivot').change(function () {
            if (that.CONFIG.callback.onOutputTypeChange) {
                that.CONFIG.callback.onOutputTypeChange($(this).is(':checked'));
            }
        });
        $('#' + this.CONFIG.prefix + 'decimal_numbers').change(function () {
            if (that.CONFIG.callback.onDecimalNumbersChange) {
                that.CONFIG.callback.onDecimalNumbersChange($(this).val());
            }
        });
        $('#' + this.CONFIG.prefix + 'decimal_separator').change(function () {
            if (that.CONFIG.callback.onDecimalSeparatorChange) {
                that.CONFIG.callback.onDecimalSeparatorChange($(this).is(':checked'));
            }
        });
        $('#' + this.CONFIG.prefix + 'decimal_separator_period').change(function () {
            if (that.CONFIG.callback.onDecimalSeparatorChange) {
                that.CONFIG.callback.onDecimalSeparatorChange($(this).is(':checked'));
            }
        });

        /* Link decimal and thousand separators. */
        if (this.CONFIG.decimal_separators && this.CONFIG.thousand_separators) {
            $("input:radio[name=" + that.CONFIG.prefix + "decimal_separator]").change(function () {
                if ($(this).val() === '.') {
                    $('#' + that.CONFIG.prefix + 'thousand_separator').prop('checked', true);
                    $('#' + that.CONFIG.prefix + 'thousand_separator_period').prop('checked', false);
                } else if ($(this).val() === ',') {
                    $('#' + that.CONFIG.prefix + 'thousand_separator').prop('checked', false);
                    $('#' + that.CONFIG.prefix + 'thousand_separator_period').prop('checked', true);
                }
            });
            $("input:radio[name=" + that.CONFIG.prefix + "thousand_separator]").change(function () {
                if ($(this).val() === '.') {
                    $('#' + that.CONFIG.prefix + 'decimal_separator').prop('checked', true);
                    $('#' + that.CONFIG.prefix + 'decimal_separator_period').prop('checked', false);
                } else if ($(this).val() === ',') {
                    $('#' + that.CONFIG.prefix + 'decimal_separator').prop('checked', false);
                    $('#' + that.CONFIG.prefix + 'decimal_separator_period').prop('checked', true);
                }
            });
        }

    };

    OPTIONS.prototype.show = function () {

        /* Variables. */
        var that = this;

        /* Apply configuration. */
        this.apply_configuration();

        /* Add listeners for change events. */
        $('#' + this.CONFIG.prefix + 'unit').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'codes').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'flags').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'null_values').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'decimal_numbers').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'decimal_separator').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'thousand_separator').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'decimal_separator_period').change(function () { that.option_changed_listener(); });
        $('#' + this.CONFIG.prefix + 'thousand_separator_period').change(function () { that.option_changed_listener(); });
        //$('#' + this.CONFIG.prefix + 'output_type').change(function () { that.option_changed_listener(); });

    };

    OPTIONS.prototype.show_as_modal_window = function () {
        this.CONFIG.mode = 'window';
        this.show();
    };

    OPTIONS.prototype.show_as_panel = function () {
        this.CONFIG.mode = 'panel';
        this.show();
    };

    OPTIONS.prototype.option_changed_listener = function () {
        /*global amplify*/
        amplify.publish(this.CONFIG.prefix + 'event', this.collect_user_selection());
    };

    /**
     * Function to collect the parameters exposed by this component.
     *
     * @param {String} output_format Format of the output: 'csv', 'xls', 'pdf', null
     * @returns {Object} An object describing the selection made by the user through this component.
     */
    OPTIONS.prototype.collect_user_selection = function (output_format) {
        this.CONFIG.user_selection.decimal_separator_value = $('input[name="' + this.CONFIG.prefix + 'decimal_separator"]:checked').val();
        this.CONFIG.user_selection.thousand_separator_value = this.CONFIG.user_selection.decimal_separator_value === '.' ? ',' : '.';
        this.CONFIG.user_selection.decimal_numbers_value = $('#' + this.CONFIG.prefix + 'decimal_numbers').val();
        this.CONFIG.user_selection.flags_value = $('#' + this.CONFIG.prefix + 'flags').is(':checked');
        this.CONFIG.user_selection.codes_value = $('#' + this.CONFIG.prefix + 'codes').is(':checked');
        this.CONFIG.user_selection.units_value = $('#' + this.CONFIG.prefix + 'unit').is(':checked');
        this.CONFIG.user_selection.null_values_value = $('#' + this.CONFIG.prefix + 'null_values').is(':checked');
        if (output_format) {
            this.CONFIG.user_selection.origin = output_format;
            this.CONFIG.user_selection.output_format = output_format;
        }
        this.CONFIG.user_selection.output_type = this.get_output_type();
        return this.CONFIG.user_selection;
    };

    OPTIONS.prototype.get_output_type = function () {
        var test = $('#' + this.CONFIG.prefix + 'output_type').is(':checked');
        return test ? 'TABLE' : 'PIVOT';
    };

    OPTIONS.prototype.get_radio_button = function (radio_button_code) {
        return $('#' + this.CONFIG.prefix + radio_button_code);
    };

    /**
     * This function execute an user-defined function by subscribing the AmplifyJS event. The user must provide a
     * callback function that takes two arguments: the first one is the object containing the user selection
     * collected by this component, while the second object contains the data to be downloaded/exported.
     *
     * @param {function} callback This function must take two objects as argument: user selection and data
     * @param {Object} callback_data Data to be downloaded/exported.
     */
    OPTIONS.prototype.onDownload = function (callback_data, callback) {
        amplify.subscribe(this.CONFIG.prefix + 'event', function (user_selection) {
            callback(user_selection, callback_data);
        });
    };

    return OPTIONS;

});