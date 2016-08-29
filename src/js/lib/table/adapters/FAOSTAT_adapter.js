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

        function FAOSTAT_Adapter() {
            return this;
        }

        FAOSTAT_Adapter.prototype.prepareData = function (config) {

            this.o = $.extend(true, {}, defaultOptions, config);

            return { dsd: this.getFilteredMetadata()} ;

        };

        FAOSTAT_Adapter.prototype.getFilteredMetadata = function () {

            var columnsToFilter = (this.o.adapter)? this.o.adapter.columns || []: [],
                dsd = this.o.model.metadata.dsd,
                filteredColumns = [],
                filterDSD = [],
                show_codes = this.o.adapter.show_codes,
                show_flags = this.o.adapter.show_flags,
                show_unit = this.o.adapter.show_unit;

            if ( columnsToFilter.length > 0) {

                _.each(columnsToFilter, function (dimension_id) {

                    _.each(dsd, function (c) {
                        if (c.dimension_id === dimension_id) {
                            if (c.type !== "code") {
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
                        filteredColumns.push(c);
                    }
                }
                else if ( c.type === "flag" || c.type === "flag_label") {
                    if( show_flags) {
                        filteredColumns.push(c);
                    }
                }
                else if ( c.type === "unit" ) {
                    if( show_unit) {
                        filteredColumns.push(c);
                    }
                }
                else if ( c.type === "value" ) {
                    c.align = "right";
                    filteredColumns.push(c);
                }
                else {
                    filteredColumns.push(c);
                }

            });

            // order by index the filtered columns

            //log.info("Table.FAOSTAT_Adapter.getFilteredMetadata; Filtered Columns:", filteredColumns);

            // filtered column are the one rendered by the custom template
            return filteredColumns;

        };

        FAOSTAT_Adapter.prototype.formatData = function(model) {

            //log.info('Table.FAOSTAT_Adapter.formatData;', model);

            this.o.model = model || this.o.model;

            var dsd = this.o.model.metadata.dsd,
                data = this.o.model.data,
                valueKey = null,
                thousand =  this.o.adapter.thousand_separator,
                decimal =  this.o.adapter.decimal_separator,
                decimal_places = this.o.adapter.decimal_places;

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

        // @Deprecated. this should not be used at the moment
        FAOSTAT_Adapter.prototype.orderByIndex = function (columns) {

            // TODO: alter index to integer for the sort. Fix APIs
            _.each(columns, function(column) {
                column.index = parseInt(column.index);
            });

            return _.sortBy(columns, 'index');

        };

        FAOSTAT_Adapter.prototype.destroy = function () {
            log.warn('TODO: Table.FAOSTAT_Adapter.destroy');
        };

        return FAOSTAT_Adapter;
    });