/*global define, numeral*/
define(['jquery',
        'handlebars',
        'text!faostat_ui_table/html/templates.hbs',
        'i18n!faostat_ui_table/nls/translate',
        'faostat_commons',
        'faostatapiclient',
        'bootstrap',
        'sweetAlert',
        'amplify',
        'numeral'], function ($, Handlebars, templates, translate, FAOSTATCommons, FAOSTATAPIClient) {

    'use strict';

    function TABLE() {

        this.CONFIG = {

            lang: 'E',
            prefix: 'faostat_ui_table_',
            placeholder_id: 'faostat_ui_table',
            data: null,
            metadata: null,
            show_codes: true,
            show_units: true,
            show_flags: true,
            decimal_places: 2,
            decimal_separator: '.',
            thousand_separator: ','

        };

    }

    TABLE.prototype.init = function (config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang !== null ? this.CONFIG.lang : 'en';

        /* Store FAOSTAT language. */
        this.CONFIG.lang_faostat = FAOSTATCommons.iso2faostat(this.CONFIG.lang);

        /* Initiate FAOSTAT API's client. */
        this.CONFIG.api = new FAOSTATAPIClient();

        /* Render. */
        this.render();

    };

    TABLE.prototype.render = function () {

        /* Variables. */
        var source,
            template,
            dynamic_data,
            html,
            rows = [],
            headers = [],
            row,
            i,
            j,
            formatter = '';

        /* Prepare the value formatter. */
        numeral.language('faostat', {
            delimiters: {
                thousands: this.CONFIG.thousand_separator,
                decimal: this.CONFIG.decimal_separator
            }
        });
        numeral.language('faostat');
        formatter = '0' + this.CONFIG.thousand_separator + '0' + this.CONFIG.decimal_separator;
        for (i = 0; i < this.CONFIG.decimal_places; i += 1) {
            formatter += '0';
        }

        /* Process data. */
        for (i = 0; i < this.CONFIG.data.length; i += 1) {
            row = {};
            row.cells = [];
            for (j = 0; j < this.CONFIG.metadata.dsd.length; j += 1) {
                if (this.CONFIG.metadata.dsd[j].type === 'value') {
                    row.cells.push({
                        label: numeral(this.CONFIG.data[i][this.CONFIG.metadata.dsd[j].key]).format(formatter),
                        type: this.CONFIG.metadata.dsd[j].type
                    });
                    headers.push({
                        label: this.CONFIG.metadata.dsd[j].label,
                        type: this.CONFIG.metadata.dsd[j].type
                    });
                } else if (this.CONFIG.metadata.dsd[j].type === 'code') {
                    if (this.CONFIG.show_codes) {
                        row.cells.push({
                            label: this.CONFIG.data[i][this.CONFIG.metadata.dsd[j].key],
                            type: this.CONFIG.metadata.dsd[j].type
                        });
                        headers.push({
                            label: this.CONFIG.metadata.dsd[j].label,
                            type: this.CONFIG.metadata.dsd[j].type
                        });
                    }
                } else if (this.CONFIG.metadata.dsd[j].type === 'unit') {
                    if (this.CONFIG.show_units) {
                        row.cells.push({
                            label: this.CONFIG.data[i][this.CONFIG.metadata.dsd[j].key],
                            type: this.CONFIG.metadata.dsd[j].type
                        });
                        headers.push({
                            label: this.CONFIG.metadata.dsd[j].label,
                            type: this.CONFIG.metadata.dsd[j].type
                        });
                    }
                } else if (this.CONFIG.metadata.dsd[j].type === 'flag') {
                    if (this.CONFIG.show_flags) {
                        row.cells.push({
                            label: this.CONFIG.data[i][this.CONFIG.metadata.dsd[j].key],
                            type: this.CONFIG.metadata.dsd[j].type
                        });
                        headers.push({
                            label: this.CONFIG.metadata.dsd[j].label,
                            type: this.CONFIG.metadata.dsd[j].type
                        });
                    }
                } else {
                    row.cells.push({
                        label: this.CONFIG.data[i][this.CONFIG.metadata.dsd[j].key],
                        type: this.CONFIG.metadata.dsd[j].type
                    });
                    headers.push({
                        label: this.CONFIG.metadata.dsd[j].label,
                        type: this.CONFIG.metadata.dsd[j].type
                    });
                }
            }
            rows.push(row);
        }

        /* Load main structure. */
        source = $(templates).filter('#faostat_ui_table_structure').html();
        template = Handlebars.compile(source);
        dynamic_data = {
            headers: headers,
            rows: rows
        };
        html = template(dynamic_data);
        $('#' + this.CONFIG.placeholder_id).html(html);

    };

    return TABLE;

});