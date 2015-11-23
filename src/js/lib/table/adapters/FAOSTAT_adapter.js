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

        var defaultOptions = {

                lang: 'EN'

            },

            e = {
                DESTROY: 'fx.component.chart.destroy',
                READY: 'fx.component.chart.ready'
            };

        function FAOSTAT_Adapter() {
            return this;
        }

        FAOSTAT_Adapter.prototype.prepareData = function (config) {

            this.o = $.extend(true, {}, defaultOptions, config);

            return { dsd: this.getFilteredMetadata()} ;

        };

        FAOSTAT_Adapter.prototype.getFilteredMetadata = function () {

            var columns = this.o.adapter.columns,
                dsd = this.o.model.metadata.dsd,
                filteredColumns = [];

            //log.info(this.o.adapter.columns);

            _.each(columns, function(dimension_id) {
                log.info(dimension_id)
                _.each(dsd, function(c) {
                    if (c.dimension_id === dimension_id ) {
                        if (c.type !== "code") {
                            filteredColumns.push(c);
                        }
                    }
                });

            });

            //log.info(filteredColumns)

            return filteredColumns;

        };

        FAOSTAT_Adapter.prototype.destroy = function () {

        };

        return FAOSTAT_Adapter;
    });