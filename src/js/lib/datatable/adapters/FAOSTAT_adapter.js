/*global define, amplify, console, parseInt, numeral*/
define([
        'jquery',
        'underscore',
        'loglevel',
        'numeral',
        'amplify'
    ],
    function ($, _, log) {

        'use strict';

        var defaultOptions = {};

        function FAOSTAT_Adapter(config) {
            this.o = $.extend(true, {}, defaultOptions, config);
            return this;
        }

        FAOSTAT_Adapter.prototype.prepareDSD = function (model, config) {

            this.o = $.extend(true, {}, this.o, config);

            return this.getFilteredMetadata(model);

        };

        FAOSTAT_Adapter.prototype.getFilteredMetadata = function (model) {

            var columnsToFilter = (this.o)? this.o.columns || []: [],
                dsd = model.metadata.dsd,
                filteredColumns = [],
                filterDSD = [],
                show_codes = this.o.show_codes,
                show_flags = this.o.show_flags,
                show_unit = this.o.show_unit,
                self = this;

            if ( columnsToFilter.length > 0) {

                _.each(columnsToFilter, function (dimension_id) {

                    _.each(dsd, function (c) {
                        if (c.dimension_id === dimension_id) {
                            if (c.type !== "code") {
                                // add datatables property
                                filterDSD.push(c);
                            }
                        }
                    });

                });
            }
            else {
                log.warn("FAOSTAT_Adapter; No table column filter applied 'adapter.columns'. Retrieve all table. ");
                filterDSD = $.extend(true, {}, dsd);
            }

            // filter columns by type
            _.each(filterDSD, function (c) {

                if ( c.type === "code" ) {
                    if( show_codes) {
                        filteredColumns.push(self._completeColumn(c));
                    }
                }
                else if ( c.type === "flag" || c.type === "flag_label") {
                    if( show_flags) {
                        filteredColumns.push(self._completeColumn(c));
                    }
                }
                else if ( c.type === "unit" ) {
                    if( show_unit) {
                        filteredColumns.push(self._completeColumn(c));
                    }
                }
                else if ( c.type === "value" ) {
                    c.align = "right";
                    filteredColumns.push(self._completeColumn(c));
                }
                else {
                    filteredColumns.push(self._completeColumn(c));
                }

            });

            // order by index the filtered columns

            //log.info("Table.FAOSTAT_Adapter.getFilteredMetadata; Filtered Columns:", filteredColumns);

            // filtered column are the one rendered by the custom template
            return filteredColumns;

        };

        FAOSTAT_Adapter.prototype._completeColumn = function(c) {
            return $.extend({}, c, {
                data: c.key,
                title: c.label
            });
        };

        FAOSTAT_Adapter.prototype.formatData = function(model) {

            //log.info('Table.FAOSTAT_Adapter.formatData;', model);

            log.info(this.o)

            var dsd = model.metadata.dsd,
                data = model.data,
                valueKey = null,
                thousand =  this.o.thousand_separator,
                decimal =  this.o.decimal_separator,
                decimal_places = this.o.decimal_places;

            // Prepare the value formatter.
            numeral.language('default', {
                delimiters: {
                    thousands: thousand,
                    decimal: decimal
                }
            });
            var formatter = '0' + thousand + '0' + decimal;

            numeral.language('default');

            formatter += '[';
            for (var i = 0; i < decimal_places; i += 1) {
                formatter += '0';
            }
            formatter += ']';

            _.each(dsd, function (c) {
                if ( c.type === "value" ) {
                    valueKey = c.key;
                }
            });

            _.each(data, function (d, index) {

                //log.info("Table.FAOSTAT_Adapter.formattedData; index, value", index, d[valueKey], isNaN(d[valueKey]));

                if ( d[valueKey] !== undefined && d[valueKey] !== null && !isNaN(d[valueKey])) {
                    // TODO: check if parseFloat works in all cases
                    //d[valueKey] = numeral(parseFloat(d[valueKey])).format(formatter);
                    d[valueKey] = numeral(parseFloat(d[valueKey])).format(formatter);
                }else{
                    log.warn("Table.FAOSTAT_Adapter.formattedData;", d[valueKey], "not valid or already formatted.");
                }

            });

            //log.info('Table.FAOSTAT_Adapter.formattedData;', data);

            return data;
        };

        FAOSTAT_Adapter.prototype.destroy = function () {
            log.warn('TODO: Table.FAOSTAT_Adapter.destroy');
        };

        return FAOSTAT_Adapter;
    });