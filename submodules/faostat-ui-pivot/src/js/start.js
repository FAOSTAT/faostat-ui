/*global define, setInterval, clearInterval*/
define(['jquery',
        'handlebars',
        'text!faostat_ui_pivot/html/templates.hbs',
        'i18n!faostat_ui_pivot/nls/translate',
        'faostat_commons',
        'bootstrap',
        'sweetAlert',
        'amplify',
        'jbPivot'], function ($, Handlebars, templates, translate, FAOSTATCommons) {

    'use strict';

    function PIVOT() {

        this.CONFIG = {

            lang: 'E',
            prefix: 'faostat_ui_pivot_',
            placeholder_id: 'faostat_ui_pivot',
            data: null,
            dsd: null,
            label2code_map: null,
            show_flags: true,
            show_codes: true,
            show_units: true

        };

    }

    PIVOT.prototype.init = function (config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang !== null ? this.CONFIG.lang : 'en';

        /* Store FAOSTAT language. */
        this.CONFIG.lang_faostat = FAOSTATCommons.iso2faostat(this.CONFIG.lang);

        /* Render. */
        this.render();

    };

    PIVOT.prototype.render = function () {

        /* Variables. */
        var source,
            template,
            dynamic_data,
            html,
            that = this,
            i,
            fields = {},
            yfields = [],
            xfields = [],
            zfields = [],
            interval,
            key,
            lbl,
            selector;

        /* Map codes. */
        this.map_codes();

        /* Load main structure. */
        source = $(templates).filter('#faostat_ui_pivot_structure').html();
        template = Handlebars.compile(source);
        dynamic_data = {};
        html = template(dynamic_data);
        $('#' + this.CONFIG.placeholder_id).html(html);

        /* Configure the pivot according to the DB settings. */
        for (i = 0; i < this.CONFIG.dsd.length; i += 1) {
            switch (this.CONFIG.dsd[i].type) {
            case 'code':
                break;
            case 'flag':
                break;
            case 'value':
                fields[this.CONFIG.dsd[i].label] = {
                    field: this.CONFIG.dsd[i].label,
                    sort: 'asc',
                    showAll: true,
                    aggregateType: 'average',
                    groupType: 'none',
                    formatter: this.pivot_value_formatter
                };
                break;
            case 'flag_label':
                fields[this.CONFIG.dsd[i].label] = {
                    field: this.CONFIG.dsd[i].label,
                    sort: 'asc',
                    showAll: true,
                    aggregateType: 'distinct',
                    formatter: this.pivot_flag_formatter
                };
                break;
            default:
                fields[this.CONFIG.dsd[i].label] = {
                    field: this.CONFIG.dsd[i].label,
                    sort: 'asc',
                    showAll: true,
                    aggregateType: 'distinct'
                };
                break;
            }
            if (this.CONFIG.dsd[i].type !== 'code' && this.CONFIG.dsd[i].type !== 'flag') {
                switch (this.CONFIG.dsd[i].pivot) {
                case 'C':
                    yfields.push(this.CONFIG.dsd[i].label);
                    break;
                case 'R':
                    xfields.push(this.CONFIG.dsd[i].label);
                    break;
                case 'V':
                    if (this.CONFIG.dsd[i].type === 'flag_label') {
                        if (this.CONFIG.show_flags) {
                            zfields.push(this.CONFIG.dsd[i].label);
                        }
                    } else if (this.CONFIG.dsd[i].type === 'unit') {
                        if (this.CONFIG.show_units) {
                            zfields.push(this.CONFIG.dsd[i].label);
                        }
                    } else {
                        zfields.push(this.CONFIG.dsd[i].label);
                    }
                    break;
                }
            }
        }

        /* Add codes in the table, if required. */
        if (this.CONFIG.show_codes) {
            this.add_codes();
        }

        /* Render pivot table. */
        $('#pivot_placeholder').jbPivot({
            fields: fields,
            yfields: yfields,
            xfields: xfields,
            zfields: zfields,
            data: this.CONFIG.data,
            copyright: false,
            summary: false,
            label2code_map: this.CONFIG.label2code_map
        });

        /* Add flag codes, if required. */
        if (this.CONFIG.show_codes) {
            interval = setInterval(function () {
                html = $('#pivot_placeholder').html();
                if (html !== undefined) {
                    clearInterval(interval);
                    if (that.CONFIG.show_codes) {
                        for (i = 0; i < Object.keys(that.CONFIG.label2code_map).length; i += 1) {
                            key = Object.keys(that.CONFIG.label2code_map)[i].toString().replace(/\s/g, '_').replace(/,/g, '');
                            selector = $('.' + key);
                            if (selector !== undefined) {
                                lbl = that.CONFIG.label2code_map[key];
                                if (lbl.length > 0) {
                                    selector.html(' [' + lbl + ']');
                                }
                            }
                        }
                    }
                }
            }, 500);
        }

    };

    PIVOT.prototype.add_codes = function () {
        var label_indices = this.get_label_columns(),
            i,
            j,
            label,
            code;
        for (i = 0; i < this.CONFIG.data.length; i += 1) {
            for (j = 0; j < label_indices.length; j += 1) {
                label = this.CONFIG.data[i][label_indices[j]];
                code = this.CONFIG.label2code_map[label.replace(/\s/g, '_').replace(/,/g, '')];
                if (code !== undefined) {
                    this.CONFIG.data[i][label_indices[j]] = label + ' [' + code + ']';
                }
            }
        }
    };

    PIVOT.prototype.get_label_columns = function () {
        var out = [], i;
        for (i = 0; i < this.CONFIG.dsd.length; i += 1) {
            if (this.CONFIG.dsd[i].type === 'label') {
                out.push(this.CONFIG.dsd[i].key);
            }
        }
        return out;
    };

    PIVOT.prototype.pivot_value_formatter = function (V) {
        var res = null;
        if (typeof V === 'number') {
            res = V.toFixed(2);
        }
        return res;
    };

    PIVOT.prototype.pivot_flag_formatter = function (V) {
        return V + '<span class="' + V.toString().replace(/\s/g, '_').replace(/,/g, '') + '"></span>';
    };

    PIVOT.prototype.map_codes = function () {

        /* Variables. */
        var map = {},
            i,
            j,
            code_label_map = {},
            header_codelabel_map = {},
            code_idx,
            label_idx;

        /* Map the dimension id with the table indices. */
        try {
            for (i = 0; i < this.CONFIG.dsd.length; i += 1) {
                if (this.CONFIG.dsd[i].dimension_id !== undefined) {
                    if (this.CONFIG.dsd[i].type === 'code' || this.CONFIG.dsd[i].type === 'flag') {
                        if (code_label_map[this.CONFIG.dsd[i].dimension_id] === undefined) {
                            code_label_map[this.CONFIG.dsd[i].dimension_id] = {};
                        }
                        if (code_label_map[this.CONFIG.dsd[i].dimension_id].code === undefined) {
                            code_label_map[this.CONFIG.dsd[i].dimension_id].code = this.CONFIG.dsd[i].key;
                        }
                    }
                    if (this.CONFIG.dsd[i].type === 'label' || this.CONFIG.dsd[i].type === 'flag_label') {
                        if (code_label_map[this.CONFIG.dsd[i].dimension_id] === undefined) {
                            code_label_map[this.CONFIG.dsd[i].dimension_id] = {};
                        }
                        if (code_label_map[this.CONFIG.dsd[i].dimension_id].label === undefined) {
                            code_label_map[this.CONFIG.dsd[i].dimension_id].label = this.CONFIG.dsd[i].key;
                        }
                    }
                }
            }
        } catch (ignore) {

        }

        /* Map the column header with the table indices. */
        for (i = 0; i < this.CONFIG.dsd.length; i += 1) {
            if (this.CONFIG.dsd[i].dimension_id !== undefined) {
                if (this.CONFIG.dsd[i].type === 'label' || this.CONFIG.dsd[i].type === 'flag_label') {
                    header_codelabel_map[this.CONFIG.dsd[i].label] = {
                        code: code_label_map[this.CONFIG.dsd[i].dimension_id].code,
                        label: code_label_map[this.CONFIG.dsd[i].dimension_id].label
                    };
                }
            }
        }

        /* Create a map between labels and codes. */
        for (i = 0; i < this.CONFIG.data.length; i += 1) {
            for (j = 0; j < Object.keys(header_codelabel_map).length; j += 1) {
                code_idx = header_codelabel_map[Object.keys(header_codelabel_map)[j]].code;
                label_idx = header_codelabel_map[Object.keys(header_codelabel_map)[j]].label;
                map[this.CONFIG.data[i][label_idx].replace(/\s/g, '_').replace(/,/g, '')] = this.CONFIG.data[i][code_idx];
            }
        }

        /* Store the map. */
        this.CONFIG.label2code_map = map;

    };

    return PIVOT;

});