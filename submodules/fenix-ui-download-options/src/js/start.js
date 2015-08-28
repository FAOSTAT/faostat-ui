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

            lang: 'E',
            placeholder_id: 'placeholder',
            user_selection: {},
            prefix: 'fenix_',

            excel_button: true,
            pdf_button: true,
            ok_button: false,
            csv_button: true,

            decimal_separators: true,
            thousand_separators: true,
            decimal_numbers: true,
            show_options: true,

            pdf_button_id: 'pdf_button_id',
            csv_button_id: 'csv_button_id',
            excel_button_id: 'excel_button_id',
            decimal_separator_id: 'decimal_separator',
            thousand_separator_id: 'thousand_separator',
            decimal_numbers_id: 'decimal_numbers',
            flags_id: 'flags',
            codes_id: 'codes',
            units_id: 'units',
            null_values_id: 'null_values',

            button_label: translate.download_as,
            header_label: translate.button

        };

    }

    OPTIONS.prototype.init = function(config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang != null ? this.CONFIG.lang : 'E';

    };

    OPTIONS.prototype.show_as_modal_window = function() {

        /* this... */
        var _this = this;

        /* Load button template. */
        var source = $(templates).filter('#modal_window_button').html();
        var template = Handlebars.compile(source);
        var dynamic_data = {
            prefix: this.CONFIG.prefix,
            ok: this.CONFIG.ok_button,
            pdf: this.CONFIG.pdf_button,
            csv: this.CONFIG.csv_button,
            excel: this.CONFIG.excel_button,
            decimal_separators: this.CONFIG.decimal_separators,
            thousand_separators: this.CONFIG.thousand_separators,
            decimal_numbers: this.CONFIG.decimal_numbers,
            show_options: this.CONFIG.show_options,
            ok_button_label: 'OK',
            pdf_label: translate.pdf,
            csv_label: translate.csv,
            show_label: translate.show,
            excel_label: translate.excel,
            flags_label: translate.flags,
            comma_label: translate.comma,
            codes_label: translate.codes,
            units_label: translate.units,
            period_label: translate.period,
            null_values_label: translate.null_values,
            decimal_numbers_label: translate.decimal_numbers,
            modal_window_button_label: this.CONFIG.button_label,
            modal_window_header_label: this.CONFIG.header_label,
            decimal_separator_label: translate.decimal_separator,
            thousand_separator_label: translate.thousand_separator
        };
        var html = template(dynamic_data);
        $('#' + _this.CONFIG.placeholder_id).html(html);

        /* Link listeners to buttons. */
        $('#' + this.CONFIG.prefix + 'ok_button').click(function() {_this.download_listener(null);});
        $('#' + this.CONFIG.prefix + 'csv_button').click(function() {_this.download_listener('csv');});
        $('#' + this.CONFIG.prefix + 'pdf_button').click(function() {_this.download_listener('pdf');});
        $('#' + this.CONFIG.prefix + 'excel_button').click(function() {_this.download_listener('xls');});

    };

    /**
     * Function to collect the parameters exposed by this component.
     *
     * @param {String} output_format Format of the output: 'csv', 'xls', 'pdf', null
     * @returns {Object} An object describing the selection made by the user through this component.
     */
    OPTIONS.prototype.collect_user_selection = function(output_format) {
        this.CONFIG.user_selection.decimal_separator = $('#' + this.CONFIG.prefix + 'decimal_separator').val();
        this.CONFIG.user_selection.thousand_separator = $('#' + this.CONFIG.prefix + 'thousand_separator').val();
        this.CONFIG.user_selection.decimal_numbers = $('#' + this.CONFIG.prefix + 'decimal_numbers').val();
        this.CONFIG.user_selection.flags = $('#' + this.CONFIG.prefix + 'flags').is(':checked');
        this.CONFIG.user_selection.codes = $('#' + this.CONFIG.prefix + 'codes').is(':checked');
        this.CONFIG.user_selection.units = $('#' + this.CONFIG.prefix + 'units').is(':checked');
        this.CONFIG.user_selection.null_values = $('#' + this.CONFIG.prefix + 'null_values').is(':checked');
        this.CONFIG.user_selection.output_format = output_format;
        return this.CONFIG.user_selection;
    };

    OPTIONS.prototype.get_radio_button = function(radio_button_code) {
        return $('#' + this.CONFIG.prefix + radio_button_code);
    };

    /**
     * This function publish an event through AmplifyJS. This event will be used by the component
     * that will show/export the data.
     *
     * @param {String} output_format Format of the output: 'csv', 'xls', 'pdf', null
     */
    OPTIONS.prototype.download_listener = function(output_format) {
        amplify.publish(this.CONFIG.prefix + 'event', this.collect_user_selection(output_format));
    };

    /**
     * This function execute an user-defined function by subscribing the AmplifyJS event. The user must provide a
     * callback function that takes two arguments: the first one is the object containing the user selection
     * collected by this component, while the second object contains the data to be downloaded/exported.
     *
     * @param {function} callback This function must take two objects as argument: user selection and data
     * @param {Object} callback_data Data to be downloaded/exported.
     */
    OPTIONS.prototype.onDownload = function(callback_data, callback) {
        amplify.subscribe(this.CONFIG.prefix + 'event', function(user_selection) {
            callback(user_selection, callback_data);
        });
    };

    return OPTIONS;

});