/*global define, amplify, console*/
define([
        'jquery',
        'underscore',
        'loglevel',
        'highcharts',
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

            var columns = (this.o.adapter)? this.o.adapter.columns || []: [],
                dsd = this.o.model.metadata.dsd,
                filteredColumns = [];

            //log.info(this.o)
            //log.info("Table Columns: ", columns)

            if ( columns.length > 0) {

                _.each(columns, function (dimension_id) {

                    //log.info(dimension_id)

                    _.each(dsd, function (c) {
                        //log.info(c)
                        if (c.dimension_id === dimension_id) {
                            if (c.type !== "code") {
                                filteredColumns.push(c);
                            }
                        }
                    });

                });
            }
            else {
                log.warn("No table column filter applied 'adapter.columns'. Retrieve all table. ");
                filteredColumns = $.extend(true, {}, dsd);
            }

            //log.info(filteredColumns)

            return filteredColumns;

        };

        FAOSTAT_Adapter.prototype.destroy = function () {

        };

        return FAOSTAT_Adapter;
    });