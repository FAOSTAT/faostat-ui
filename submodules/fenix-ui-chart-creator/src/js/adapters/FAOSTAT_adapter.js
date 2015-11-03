/*global define, amplify, console*/
define([
        'jquery',
        'underscore',
        'highcharts',
        'amplify'
    ],
    function ($, _) {

        'use strict';

        var defaultOptions = {

                lang: 'EN',

                //type: 'timeserie',  //[custom, scatter, pie] TODO: probably not needed and not used yet

                // Chart (Based on Highchart Definition)
                chartObj: {
                    chart: {},
                    xAxis: {},
                    //yAxis: [],
                    series: []
                },

                // filtering parameters
                //xDimensions: ['yeargroup'],
                //yDimensions: ['unit'],
                //valueDimensions: ['value'],
                //seriesDimensions: ['areagroup'],

                //UMColumn : "um",

                // TODO add as paramenter (N.B. for now the yAxis is added to the serie name to avoid conflicts)
                addYAxisToSeriesName: true,

                // aux variables used to process the model
                aux: {
                    x: {},
                    y: {},
                    value: {},
                    series: []
                },

                debugging: false
            },
            e = {
                DESTROY: 'fx.component.chart.destroy',
                READY: 'fx.component.chart.ready'
            };

        function FAOSTAT_Highchart_Adapter() {
            return this;
        }

        FAOSTAT_Highchart_Adapter.prototype.prepareData = function (config) {

            if (this.o === undefined) {
                this.o = $.extend(true, {}, defaultOptions, config);
            }
            else {
                var chartObj = this.o.chartObj;
                this.o = $.extend(true, {}, defaultOptions, config);
                this.o.chartObj = chartObj;
            }

            if (this._validateInput() === true) {
                this._initVariable();
                this._prepareData();
                if (this._validateData() === true) {
                    this._onValidateDataSuccess();
                } else {
                    this._onValidateDataError();
                }
            } else {
                console.error(this.errors);
                throw new Error("FENIX Chart creator has not a valid configuration");
            }
        };

        FAOSTAT_Highchart_Adapter.prototype._prepareData = function () {

            // TODO: change variables names according to the new nomenclature

            var xAxis = this.o.xDimensions,
                yAxis = this.o.yDimensions,
                value = this.o.valueDimensions,
                series = this.o.seriesDimensions,
                columns = this.o.$columns,
                addYAxisToSeriesName = this.o.addYAxisToSeriesName;

            //console.log(xAxis, yAxis, value);

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

            //console.log(this.o.aux.series);

            this._printAuxColumns();
        };

      /*  FAOSTAT_Highchart_Adapter.prototype._addUnitOfMeasure = function() {

            var suffix = '',
                index = -1;

            if (this.o.aux.y.index > -1 && Array.isArray(this.o.$data) && this.o.$data.length > 0) {
                suffix = " " + this.o.$data[0][index];
            }

            return { tooltip: {
                valueSuffix: suffix
                }
            };

        };*/

        /**
         * Get column structure
         * @param columns
         * @param column
         * @param index
         * @returns {*}
         * @private
         */
        FAOSTAT_Highchart_Adapter.prototype._getColumnStructure = function (columns, column) {
            if (column.hasOwnProperty('type')) {
                switch (column.type) {
                    case 'code':
                        return null; //TODO: remove it
                    default :
                        return {
                            column: column,
                            index: column.index,
                            id: column.dimension_id
                        };
                }
            }
        };

        FAOSTAT_Highchart_Adapter.prototype.prepareChart = function (config) {

            config = $.extend(true, {}, this.o, config);

            switch (config.type) {
                case 'pie':
                    this.o.chartObj = this._processPieChart(config);
                case 'scatter':
                    break;
                default :
                    // check wheater the xAxis column is time
                   //    var xSubject = config.aux.x.column;
                    this.o.chartObj = this._processStandardChart(config, (config.type.toLowerCase() === 'timeserie'));
            }

            return this.o.chartObj;
        };

        /**
         * This is used for standard chart and timeseries
         * @param isTimeserie
         * @private
         */
        FAOSTAT_Highchart_Adapter.prototype._processStandardChart = function (config, isTimeserie) {

            var chartObj = config.chartObj,
                x = config.aux.x,
                y = config.aux.y,
                value = config.aux.value,
                auxSeries = config.aux.series,
                data = config.$data;

            //console.log(data);

            // Sort Data TODO: check if the sort is always applicable
            //this._sortData(data, x.index);

            // Process yAxis
            if (y.index) {
                chartObj.yAxis = this._createYAxis(chartObj.yAxis, data, y.index);
            }

            // create Series
            if (isTimeserie === true) {

                // TODO: move it to the template!!
                console.warn('TODO: xAxis Categories: for timeserie directly datatime??');
                chartObj.xAxis.type = 'datetime';
                chartObj.xAxis.minRange = 30 * 24 * 3600 * 1000; //
                chartObj.xAxis.minTickInterval = 12 * 30 * 24 * 3600 * 1000; // An year
                // TODO: add yearly data

                chartObj.series = this._createSeriesTimeserie(chartObj.series, data, x, y, value, chartObj.yAxis, auxSeries);
            }
            else {
                // create xAxis categories
                chartObj.xAxis.categories = this._createXAxisCategories(data, x.index);
                chartObj.series = this._createSeriesStandard(data, x, y, value, chartObj.yAxis, chartObj.xAxis, auxSeries);

                /*                // TODO: make it nicer
                 // check if the xAxis series is just one value, force to column chart
                 console.log( chartObj.xAxis.categories)
                 if (chartObj.xAxis.categories.length <= 1 ) {
                 chartObj.chart.type = 'column';
                 }*/
            }

            // TODO: add tooltip on series?

            // TODO: this has to be refactoring, doesn't work with multiple yAxis
            //$.extend(true, chartObj,this._addUnitOfMeasure());

            return chartObj;
        };

        FAOSTAT_Highchart_Adapter.prototype._addData = function (data, columnIndex) {

        },

        /**
         * creates the yAxis TODO: probably to check
         * @param data
         * @param columnIndex
         * @private
         */
        FAOSTAT_Highchart_Adapter.prototype._createYAxis = function (yAxis, data, columnIndex) {
            var yAxisNames = [],
                yAxis = yAxis || [];

            // TODO it can be done faster the unique array
            data.forEach(function (value) {
                yAxisNames.push(value[columnIndex]);
            });
            yAxisNames = _.uniq(yAxisNames);

            // creating yAxis objects
            // TODO; probably it should merge the yAxis template somehow. PROBLEM: how to merge multiple axes properties from the baseConfig?
            yAxisNames.forEach(function (v) {
                yAxis.push({title: {text: v}});
            });

            return yAxis;
        };

        /**
         * Create unique xAxis categories
         * @param data
         * @private
         */
        FAOSTAT_Highchart_Adapter.prototype._createXAxisCategories = function (data, xIndex) {

            var xCategories = [];
            data.forEach(function (row) {
                if (row[xIndex] === null) {
                    console.warn("Error on the xAxis data (is null)", row[xIndex], row, xIndex);
                }
                else {
                    xCategories.push(row[xIndex]);
                }
            });

            return _.uniq(xCategories);
        };

        FAOSTAT_Highchart_Adapter.prototype._createSeriesTimeserie = function (series, data, x, y, value, yAxis, auxSeries) {
            var xIndex = x.index,
                yIndex = y.index,
                valueIndex = value.index,
                series = series || [];


            //console.log(series, xIndex, yIndex);
            //console.log(data);


            // Create the series
            data.forEach(_.bind(function (row) {

                //console.log(row);

                // unique key for series
                var name = this._createSeriesName(row, auxSeries);

                // get serie
                var serie = _.findWhere(data.series, {name: name}) || {name: name},
                    yLabel;

                // data of the serie
                serie.data = [];

                // Create yAxis if exists
                if (yIndex !== null) {
                    serie.yAxis = this._getYAxisIndex(yAxis, row[yIndex]);
                }

                // push the value of the serie
                if (row[xIndex] !== null && row[xIndex] !== undefined && row[valueIndex] !== undefined && row[valueIndex] !== null) {

                    if (row[valueIndex] !== null) {


                        // TODO: FIX THE VALUE!!!!!!!!!!!!!!
                        serie.data.push([
                            this._getDatetimeByDataType('year', row[xIndex]),
                            parseFloat(this.replaceAll(row[valueIndex], ",", ""))
                        ]);
                        //serie.data.push([row[xIndex], 12]);

                        // Add serie to series
                        series = this._addSerie(series, serie);
                    }
                }

            }, this));

            //console.log(series);

            return series;
        };

        /**
         * Add serie to series
         * @param series
         * @param serie
         * @returns {*}
         * @private
         */
            //TODO: clean the code, clone the object to return a new series.
            // TODO: This method can be highly simplified.
        FAOSTAT_Highchart_Adapter.prototype._addSerie = function (series, serie, valueIndex) {
            var seriesAlreadyAdded = false;
            for (var i = 0; i < series.length; i++) {
                if (serie.name === series[i].name) {
                    // this a "switch" between the timeserie and a standard chart
                    // TODO: make it nicer, or separate the two _addSerie function
                    // TODO: between _addSerie and _addSerieTimeseries
                    if (valueIndex) {
                        series[i].data[valueIndex] = serie.data[valueIndex];
                    }
                    else {
                        series[i].data.push(serie.data[0]);
                    }
                    seriesAlreadyAdded = true;
                    break;
                }
            }
            if (!seriesAlreadyAdded) {
                series.push(serie);
            }
            return series;
        };

        FAOSTAT_Highchart_Adapter.prototype._createSeriesStandard = function (data, x, y, value, yAxis, xAxis, auxSeries) {

            try {
                var xIndex = x.index,
                    yIndex = y.index,
                    valueIndex = value.index,
                    xCategories = xAxis.categories,
                    series = [];

                // Create the series
                _.each(data, function (row) {

                    // unique key for series
                    var name = this._createSeriesName(row, auxSeries);

                    // get serie
                    var serie = _.findWhere(data.series, {name: name}) || {name: name},
                        yLabel;

                    // data of the serie
                    serie.data = [];
                    // initialize serie with null values. this fixed missing values from categories
                    _.each(xCategories, function () {
                        serie.data.push(null);
                    });

                    // Create yAxis if exists
                    if (yIndex !== null) {
                        serie.yAxis = this._getYAxisIndex(yAxis, row[yIndex]);
                    }

                    var index = _.indexOf(xCategories, row[xIndex]);

                    if (index !== null) {

                        if (row[valueIndex] !== null && index !== -1) {

                            //serie.data[index] = isNaN(row[valueIndex]) ? row[valueIndex] : parseFloat(row[valueIndex].replace(",", ""));
                            serie.data[index] = parseFloat(this.replaceAll(row[valueIndex], ",", ""));
                            // Add serie to series
                            series = this._addSerie(series, serie, index);
                        }
                    }

                }, this);

                //console.log(series);

            }catch (e) {
                console.error(e);
            }

            return series;
        };

        /**
         * Sort the data by an index (in theory this should be the xAxis index 'this.aux.x.index')
         * @param data
         * @param index
         * @private
         */
        FAOSTAT_Highchart_Adapter.prototype._sortData = function (data, index) {

            data.sort(_.bind(function (a, b) {

                if (a[index] < b[index]) {
                    return -1;
                }
                if (a[index] > b[index]) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            }, this));
        };

        FAOSTAT_Highchart_Adapter.prototype._getDatetimeByDataType = function (type, value) {

            // TODO: this is can be simplified and not applied to each row
            switch (type.toLowerCase()) {
                case 'year':
                    return Date.UTC(value, 0, 1);
                default :
                    console.warn("Date type date format not yet supported: " + type);
                    break;
            }
        };

        FAOSTAT_Highchart_Adapter.prototype._getYAxisIndex = function (yAxis, label) {
            var index = 0;

            if (label !== null) {
                _.each(yAxis, function (y, i) {
                    if (y.title.text === label) {
                        index = i;
                    }
                }, this);

                if (index < 0) {
                    console.error("Data contains an unknown yAxis value: " + label);
                }
            }

            return index;
        };

        FAOSTAT_Highchart_Adapter.prototype._createSeriesName = function (row, auxSeries) {

            var name = '';

            _.each(auxSeries, function (serie) {
                if (row[serie.index] !== undefined && row[serie.index] !== null) {
                    name = name.concat(row[serie.index] + ' ');
                }
            }, this);

            return name;
        };

        FAOSTAT_Highchart_Adapter.prototype._processPieChart = function (config) {
            var chartObj = config.chartObj,
                valueIndex = config.aux.value.index,
                auxSeries = config.aux.series,
                data = config.$data;

            // force type "pie" to chart
            chartObj.chart.type = "pie";

            // initialize the series
            chartObj.series = [
                {
                    // TODO: name?
                    name: '',
                    data: []
                }
            ];

            // create PIE series
            _.each(data, function (row) {

                //console.log(row);

                var name = this._createSeriesName(row, auxSeries);
                if (row[valueIndex] !== null && name !== null) {
                    //var value = isNaN(row[valueIndex]) ? row[valueIndex] : parseFloat(row[valueIndex].replace(",", ""));
                    var value = parseFloat(this.replaceAll(row[valueIndex], ",", ""));
                    // N.B. values <=0 are not allowed in a pie chart
                    //console.log(value);
                    if (value > 0) {
                        //console.log(name, value);
                        chartObj.series[0].data.push([name, value]);
                    }

                }

            }, this);
            return chartObj;
        };

        FAOSTAT_Highchart_Adapter.prototype._onValidateDataSuccess = function () {
            amplify.publish(e.READY, this);
        };

        FAOSTAT_Highchart_Adapter.prototype._onValidateDataError = function () {
            this._showConfigurationForm();
        };

        FAOSTAT_Highchart_Adapter.prototype._initVariable = function () {

            // TODO: this could be simplified (and not store all that information)
            this.o.$metadata = this.o.model.metadata;
            this.o.$columns = this.o.$metadata.dsd;
            this.o.$data = this.o.model.data;

        };

        FAOSTAT_Highchart_Adapter.prototype._validateInput = function () {

            this.errors = {};

            //Container
            /* if (!this.hasOwnProperty("container")) {
             this.errors.container = "'container' attribute not present.";
             }

             if ($(this.container).find(this.s.CONTENT) === 0) {
             this.errors.container = "'container' is not a valid HTML element.";
             }

             //Model
             if (!this.hasOwnProperty("model")) {
             this.errors.model = "'model' attribute not present.";
             }

             if (typeof this.model !== 'object') {
             this.errors.model = "'model' is not an object.";
             }

             //Metadata
             if (!this.model.hasOwnProperty("metadata")) {
             this.errors.metadata = "Model does not container 'metadata' attribute.";
             }

             //DSD
             if (!this.model.metadata.hasOwnProperty("dsd")) {
             this.errors.dsd = "Metadata does not container 'dsd' attribute.";
             }

             //Columns
             if (!Array.isArray(this.model.metadata.dsd.columns)) {
             this.errors.columns = "DSD does not container a valid 'columns' attribute.";
             }

             //Option
             if (this.options && typeof this.options !== 'object') {
             this.errors.options = "'options' is not an object.";
             }

             //Data
             if (!this.model.hasOwnProperty("data")) {
             this.errors.data = "Model does not container 'data' attribute.";
             }

             // seriesSubject
             if (!Array.isArray(this.seriesSubject)) {
             this.errors.seriesSubject = "SeriesSubject is not an Array element";
             }*/

            return (Object.keys(this.errors).length === 0);
        };

        FAOSTAT_Highchart_Adapter.prototype._validateData = function () {

            this.errors = {};

            return (Object.keys(this.errors).length === 0);
        };

        FAOSTAT_Highchart_Adapter.prototype._printAuxColumns = function () {
            if (this.o.debugging) {
                console.log("----------Aux Columns");
                console.log(this.o.aux.x);
                console.log(this.o.aux.y); // yAxis can be undefined (launch a warning)
                console.log(this.o.aux.value);
                console.log(this.o.aux.series);
                console.log("~~~~~~~");
            }
        };

        FAOSTAT_Highchart_Adapter.prototype.destroy = function () {
            
        };

        FAOSTAT_Highchart_Adapter.prototype.escapeRegExp = function(string) {
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        };

        FAOSTAT_Highchart_Adapter.prototype.replaceAll = function (string, find, replace) {
            return string.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
        };

        FAOSTAT_Highchart_Adapter.prototype.getChartObj = function () {
            return this.o.chartObj;
        };

        return FAOSTAT_Highchart_Adapter;
    });