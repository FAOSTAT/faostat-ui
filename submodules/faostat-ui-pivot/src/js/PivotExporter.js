/*global define, document, window, alert*/
define(['jquery'], function ($) {

    'use strict';

    function PIVOTEXPORTER(config) {

        this.CONFIG = {
            placeholder_id: 'placeholder',
            filename: 'PivotExport',
            url_csv2excel: 'http://localhost:8080/api/v1.0/csv2excel/',
            url_output: 'http://localhost:8080/api/v1.0/excels/'
        };

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

    }

    PIVOTEXPORTER.prototype.excel = function (metadata) {
        var model = this.create_model(),
            csv_string = this.create_csv_string(model),
            that = this;
        $.ajax({
            type: 'POST',
            url: this.CONFIG.url_csv2excel,
            data: {
                csv: csv_string,
                filename: this.CONFIG.filename,
                metadata: metadata !== null ? metadata : '"Datasource", "FAOSTAT"\n"Domain Name", "Production, Crops"\n"Retrieved", ' + new Date()
            },
            success: function (response) {
                window.open(that.CONFIG.url_output + response, '_blank');
            },
            error: function (e) {
                alert('PIVOTEXPORTER.prototype.excel ' + e);
            }
        });
    };

    PIVOTEXPORTER.prototype.csv = function () {
        var model = this.create_model(this.CONFIG.placeholder_id),
            csv_string = this.create_csv_string(model),
            csvContent = 'data:text/csv;charset=utf-8,' + csv_string,
            encodedUri = encodeURI(csvContent),
            link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', this.CONFIG.filename);
        link.click();
    };

    PIVOTEXPORTER.prototype.create_model = function () {

        /* Variables. */
        var z_titles = [],
            summary = [],
            values = [],
            ys = [],
            xs = [],
            i,
            tmp,
            y,
            top_titles,
            top_titles_objs,
            z_titles_objs,
            x,
            left_titles,
            left_titles_objs,
            tds,
            count,
            newrow,
            summary_objs;

        /* Collect Y dimension. */
        for (y = 1; y <= this.count_ys(this.CONFIG.placeholder_id); y += 1) {
            top_titles = [];
            top_titles_objs = $('#' + this.CONFIG.placeholder_id + ' table.pivot tbody tr th.draggable.toptitle.targetY' + y);
            for (i = 0; i < top_titles_objs.length; i += 1) {
                if ($.inArray($(top_titles_objs[i]).html().trim(), top_titles) < 0) {
                    top_titles.push($(top_titles_objs[i]).html().trim());
                }
            }
            ys.push(top_titles);
        }

        /* Collect Z dimension. */
        z_titles_objs = $('#' + this.CONFIG.placeholder_id + ' table.pivot tbody tr th.draggable.ztitle');
        for (i = 0; i < z_titles_objs.length; i += 1) {
            if ($.inArray($(z_titles_objs[i]).html().trim(), z_titles) < 0) {
                z_titles.push($(z_titles_objs[i]).html().trim());
            }
        }

        /* Collect X dimension. */
        for (x = 1; x <= this.count_xs(this.CONFIG.placeholder_id); x += 1) {
            left_titles = [];
            left_titles_objs = $('#' + this.CONFIG.placeholder_id + ' table.pivot tbody tr th.draggable.lefttitle.targetX' + x);
            for (i = 0; i < left_titles_objs.length; i += 1) {
                tmp = $(left_titles_objs[i]).html().trim();
                tmp = tmp.substring(tmp.indexOf('</a>'));
                if (tmp.startsWith('</a>')) {
                    tmp = tmp.substring(tmp.indexOf('</a>') + '</a>'.length);
                }
                tmp = tmp.replace(/\n/g, ' ');
                if ($.inArray(tmp, left_titles) < 0) {
                    left_titles.push(tmp);
                }
            }
            xs.push(left_titles);
        }

        /* Collect values. */
        tds = $('#' + this.CONFIG.placeholder_id + ' table.pivot tbody tr td');
        count = 1;
        tmp = [];
        newrow = top_titles.length * z_titles.length;
        for (i = 0; i < tds.length; i += 1) {
            tmp.push($(tds[i]).html().trim());
            if (count % newrow === 0) {
                values.push(tmp);
                tmp = [];
            }
            count += 1;
        }

        /* Collect summary. */
        summary_objs = $('#' + this.CONFIG.placeholder_id + ' table.pivot tbody tr td.summary');
        for (i = 0; i < summary_objs.length; i += 1) {
            summary.push($(summary_objs[i]).html().trim());
        }

        /* Return model. */
        return {
            ys: ys,
            xs: xs,
            values: values,
            summary: summary,
            zs: z_titles
        };

    };

    PIVOTEXPORTER.prototype.create_csv_string = function (model) {

        var s = '',
            i,
            j,
            z,
            y,
            newrow,
            p,
            value;

        /* Create header. */
        for (i = 0; i < model.xs.length; i += 1) {
            s += '"",';
        }
        for (i = 0; i < model.ys.length; i += 1) {
            y = model.ys[i];
            for (j = 0; j < y.length; j += 1) {
                for (z = 0; z < model.zs.length; z += 1) {
                    s += '"' + y[j] + '",';
                }
            }
            s = s.substring(0, s.length - 1);
        }
        s += '\n';
        for (i = 0; i < model.xs.length; i += 1) {
            s += '"",';
        }
        for (i = 0; i < model.ys.length; i += 1) {
            y = model.ys[i];
            for (z = 0; z < y.length; z += 1) {
                for (j = 0; j < model.zs.length; j += 1) {
                    s += '"' + model.zs[j] + '"';
                    if (j < model.zs.length - 1) {
                        s += ',';
                    }
                }
                if (z < y.length - 1) {
                    s += ',';
                }
            }
        }
        s += '\n';

        /* Create body. */
        for (j = 0; j < model.values.length - 2; j += 1) {
            for (z = 0; z < model.xs.length; z += 1) {
                newrow = 1;
                for (p = (1 + z); p < model.xs.length; p += 1) {
                    newrow *= model.xs[p].length;
                }
                s += '"' + model.xs[z][parseInt(j / newrow, 10) % model.xs[z].length] + '",';
            }
            for (i = 0; i < model.values[j].length; i += 1) {
                value = parseFloat(model.values[j][i]);
                if (!isNaN(value)) {
                    s += '"' + value + '"';
                } else {
                    s += '"' + model.values[j][i] + '"';
                }
                if (i < model.values[j].length - 1) {
                    s += ',';
                }
            }
            s += '\n';
        }

        return s;

    };

    PIVOTEXPORTER.prototype.count_xs = function () {
        var tmp, i;
        for (i = 1; i < 100; i += 1) {
            tmp = $('#' + this.CONFIG.placeholder_id + ' table.pivot tbody tr th.draggable.lefttitle.targetX' + i);
            if (tmp.length === 0) {
                return (i - 1);
            }
        }
    };

    PIVOTEXPORTER.prototype.count_ys = function () {
        var tmp, i;
        for (i = 1; i < 100; i += 1) {
            tmp = $('#' + this.CONFIG.placeholder_id + ' table.pivot tbody tr th.draggable.toptitle.targetY' + i);
            if (tmp.length === 0) {
                return (i - 1);
            }
        }
    };

    return PIVOTEXPORTER;

});