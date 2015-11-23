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

            log.info(this.o.adapter.columns);

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

            log.info(filteredColumns)

            return filteredColumns;

        };

        FAOSTAT_Adapter.prototype.getJoinLayerFaostat = function (model, modelOptions) {

            var metadata = model['metadata'];
            var columns = metadata['dsd'];
            var dimensions = modelOptions['dimensions'];
            var geoColumn = {};
            var valueColumn = {};
            var muColumn = {};
            columns.forEach(_.bind(function (column) {
                if (column.dimension_id === dimensions.geoDimensions.dimension_id && column.type === dimensions.geoDimensions.type){
                    geoColumn = column;
                    geoColumn.index = column.index;
                    geoColumn.key = column.key;
                }
                if (column.dimension_id === dimensions.valueDimensions.dimension_id && column.type === dimensions.valueDimensions.type){
                    valueColumn = column;
                    valueColumn.index = column.index;
                    valueColumn.key = column.key;
                }
                if (column.dimension_id === dimensions.muDimensions.dimension_id && column.type === dimensions.muDimensions.type){
                    muColumn = column;
                    muColumn.index = column.index;
                    muColumn.key = column.key;
                }
            }, this));

            if (this._validateJoinColumnInputFaostat(geoColumn) || true) {

                var layerMapping = modelOptions.layerMapping || "faostat";

                var layer = this.o.join.layerMapping[layerMapping][modelOptions.lang || 'en'];

                // data model to be mapped
                var data = model.data;
                // get joinData
                layer.joindata = this.getJoinData(data, geoColumn.key, valueColumn.key);

                // TODO: check on the column index
                layer.measurementunit = data[0][muColumn.key] || "";

                // TODO: check if is the right legendtitle
                //layer.legendtitle = layer.measurementunit;

                // TODO: handle the tiitle in a better way
                layer.layertitle = layer.measurementunit;


                return layer;
            } else{
                log.error('Error JoinColumnInput not valid')
            }
        };

        FAOSTAT_Adapter.prototype.getJoinData = function (data, geoColumnKey, valueColumnKey) {
            var joindata = [];

            // TODO: remove cachedValues on final version. Check on join data consistency?
            var cachedValues = {};

            // TODO: add on check
            data.forEach(_.bind(function (row) {
                var obj = {};
                var code = row[geoColumnKey];
                var value = row[valueColumnKey];
                if (code && value) {
                    obj[code] = value ;
                    if (!cachedValues.hasOwnProperty(code)) {
                        // check null values
                        cachedValues[code] = true;
                        joindata.push(obj);
                    }
                }
            }, this));

            return joindata;
        };

        FAOSTAT_Adapter.prototype._prepareData = function () {

            // TODO: change variables names according to the new nomenclature

            var xAxis = this.o.xDimensions,
                yAxis = this.o.yDimensions,
                value = this.o.valueDimensions,
                series = this.o.seriesDimensions,
                columns = this.o.$columns,
                addYAxisToSeriesName = this.o.addYAxisToSeriesName;

            // TODO: workaround on arrays used to standardize all charts.
            // TODO: Add check on multiple columns (like for series)
            xAxis = _.isArray(xAxis) ? xAxis[0] : xAxis;
            yAxis = _.isArray(yAxis) ? yAxis[0] : yAxis;
            value = _.isArray(value) ? value[0] : value;

            // TODO: if type is 'pie' force the adapted to avoid xDimensions and yDimensions
            if (this.o.type === 'pie') {
                this.o.xDimensions = null;
                this.o.yDimensions = null;
                xAxis = this.o.xDimensions;
                yAxis = this.o.yDimensions;
            }

            // parsing columns to get
            columns.forEach(_.bind(function (column) {

                // TODO: this should be already checked and validated
                //if (column.hasOwnProperty('dimension_id') && (column.type === 'label' || column.type === 'unit' || column.type === 'value')) {
                if (column.hasOwnProperty('dimension_id') && (column.type !== 'code')) {

                    if (column.dimension_id === xAxis) {
                        this.o.aux.x = this._getColumnStructure(columns, column);
                    }

                    else if (column.dimension_id === yAxis) {
                        this.o.aux.y = this._getColumnStructure(columns, column);
                    }

                    else if (column.dimension_id === value) {
                        this.o.aux.value = this._getColumnStructure(columns, column);
                    }

                    if (series.length > 0) {
                        series.forEach(_.bind(function (serie) {
                            if (column.dimension_id === serie) {
                                this.o.aux.series.push(this._getColumnStructure(columns, column));
                            }
                        }, this));

                        // TODO: check the series index to map dinamically
                    }
                }

            }, this));

            // get series columns
            if (this.o.aux.series.length <= 0) {
                columns.forEach(_.bind(function (column) {

                    if (column.hasOwnProperty('dimension_id')) {
                        if (column.type !== 'code') {
                            var index = column.index;

                            // TODO: issue with the y axis and inconsistent series
                            // TODO i.e. series with the same name but with different yAxis
                            // if (index != this.aux.x.index && index != this.aux.y.index && index != this.aux.value.index) {
                            if (index !== this.o.aux.x.index && index !== this.o.aux.value.index) {
                                // check if serie already in series (skip coded columns!)
                                this.o.aux.series.push(this._getColumnStructure(this.o.$columns, column));
                            }
                        }
                    }

                }, this));
            }

            this._printAuxColumns();
        };

        /**
         * Get column structure
         * @param columns
         * @param column
         * @param index
         * @returns {*}
         * @private
         */
        FAOSTAT_Adapter.prototype._getColumnStructure = function (columns, column) {
            if (column.hasOwnProperty('type')) {
                switch (column.type) {
                    case 'code':
                        //TODO: remove it
                        return null;
                    default :
                        return {
                            column: column,
                            //TODO: remove it when API changes
                            index: (column.key === 'Unit Description')? 'Unit': column.key,
                            id: column.dimension_id
                        };
                }
            }
        };

        FAOSTAT_Adapter.prototype.prepareChart = function (config) {

        };

        FAOSTAT_Adapter.prototype.destroy = function () {

        };

        return FAOSTAT_Adapter;
    });