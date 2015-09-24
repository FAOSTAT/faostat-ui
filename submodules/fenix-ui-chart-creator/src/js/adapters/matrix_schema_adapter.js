/*global define, amplify, console*/
define([
        'jquery',
        'underscore',
        'amplify'
    ],
    function ($, _) {

        'use strict';

        var defaultOptions = {

                // Type of the chart. This is used to parse the data
                // TODO: timeserie/pie/scatter
                type: '',

                chartObj: {
                    chart: {},
                    xAxis: {},
                    series: []
                },

                // TODO: add default PIE dimensions?
                xDimensions: [0],
                yDimensions: [3],
                valueDimensions: 2,
                seriesDimensions: [1]

            },

            e = {
                DESTROY: 'fx.component.chart.destroy',
                READY: 'fx.component.chart.ready'
            };

        function Matrix_Schema_Adapter() {
            return this;
        }

        Matrix_Schema_Adapter.prototype.prepareData = function (config) {

            this.o = $.extend(true, {}, defaultOptions, config);

            if (this._validateInput() === true) {
                if (this._validateData() === true) {
                    this._onValidateDataSuccess();
                } else {
                    this._onValidateDataError();
                }
            } else {
                console.error(this.errors);
                throw new Error("Star schema adapter has not a valid configuration");
            }
        };

        Matrix_Schema_Adapter.prototype._validateInput = function () {

            this.errors = {};

            return (Object.keys(this.errors).length === 0);
        };

        Matrix_Schema_Adapter.prototype._validateData = function () {

            this.errors = {};

            return (Object.keys(this.errors).length === 0);
        };

        Matrix_Schema_Adapter.prototype._onValidateDataSuccess = function () {

        };

        Matrix_Schema_Adapter.prototype._onValidateDataError = function () {

        };

        Matrix_Schema_Adapter.prototype.prepareChart = function(c) {

            var config = $.extend(true, this.o, c);

            switch (config.type) {
                case 'pie':
                    return this._processPieChart(config);
                case 'scatter':
                    break;
                case 'timeserie':
                    break;
                default :
                    return this._processStandardChart(config);
            }

        };

        Matrix_Schema_Adapter.prototype._processStandardChart = function(config) {

            // TODO: change variables names according to the new nomenclature

            var chartObj  = config.chartObj,
                data = config.model,
                xAxisIndex = config.xDimensions,
                seriesIndexes = config.seriesDimensions,
                valueIndex = config.valueDimensions,
                yAxisIndex = config.yDimensions,
                xOrder = config.xOrder || null;

            // TODO: make it faster? In theory can be done faster, but probably is not needed

            // get categories
            chartObj.xAxis.categories = this._createXAxisCategories(data, xAxisIndex, xOrder);

            // create yAxis
            if (yAxisIndex !== null && yAxisIndex !== undefined) {
                chartObj.yAxis = this._createYAxis(data, yAxisIndex);
            }

            var series = this._createSeries(data, seriesIndexes, chartObj.xAxis.categories.length);

            // create series
            chartObj.series = this._createSeriesStandard(data, series, xAxisIndex, yAxisIndex, valueIndex, seriesIndexes, chartObj.xAxis.categories, chartObj.yAxis);

            return chartObj;
        };

        Matrix_Schema_Adapter.prototype._createXAxisCategories = function(data, xIndexes, order) {
            return this._getDistinctValues(data, xIndexes, order);
        };

        Matrix_Schema_Adapter.prototype._createYAxis = function (data, index) {
            var yAxisNames = [],
                yAxis = [];

            if (index) {
                data.forEach(function (row) {
                    if (row[index] === null) {
                        console.warn("Error on the xAxis data (is null)", row[index], row);
                    }
                    else {
                        yAxisNames.push(row[index]);
                    }
                });

                yAxisNames = _.uniq(yAxisNames);

                // TODO: probably it should merge the yAxis template somehow.
                // TODO: PROBLEM: how to merge multiple axes properties from the baseConfig?
                // creating yAxis objects
                yAxisNames.forEach(_.bind(function (v) {
                    yAxis.push({title: {text: v}});
                }, this));
            }

            return yAxis;
        };

        Matrix_Schema_Adapter.prototype._createSeries = function(data, seriesIndexes, xCategoriesLength) {
            var s = this._getDistinctValues(data, seriesIndexes);

            var series = [];
            s.forEach(function (v) {
                series.push({
                    name: v,
                    data: _.range(xCategoriesLength).map(function () { return null; })
                });
            });

            return series;
        };

        Matrix_Schema_Adapter.prototype._createSeriesStandard = function (data, series, xIndexes, yIndex, valueIndex, seriesIndexes, xCategories, yAxis) {

            // Create the series
            data.forEach(_.bind(function (row) {

                // unique name for serie
                var xCategoryIndex = _.indexOf(xCategories, this._getXAxisCategory(row, xIndexes)),
                    serie = _.findWhere(series, {name: this._createSeriesName(row, seriesIndexes)});

                // if xAxis categories and series exists
                if (xCategoryIndex !== -1 && (serie !== undefined || serie !== null)) {

                    // Create yAxis if exists
                    if (serie.yAxis === undefined && yIndex) {
                        serie.yAxis = this._getYAxisIndex(yAxis, row[yIndex]);
                    }

                    if (row[valueIndex] !== null) {
                        // push the value of the serie
                        serie.data[xCategoryIndex] = isNaN(row[valueIndex]) ? row[valueIndex] : parseFloat(row[valueIndex]);
                    }
                }
            }, this));

            return series;
        };

        Matrix_Schema_Adapter.prototype._createSeriesName = function (row, indexes) {
            return this._getConcatString(row, indexes);
        };

        Matrix_Schema_Adapter.prototype._getXAxisCategory = function (row, indexes) {
            return this._getConcatString(row, indexes);
        };

        Matrix_Schema_Adapter.prototype._getConcatString = function (row, indexes) {

            var name = '';

            _.each(indexes, function (index) {
                if (row[index] !== undefined && row[index] !== null) {
                    if (name !== '') {
                        name = name.concat(' ');
                    }
                    name = name.concat(row[index]);
                }
            }, this);

            return name;
        };

        Matrix_Schema_Adapter.prototype._getDistinctValues = function (data, indexes, order) {

            var v = [];

            _.each(data, function (row) {
                var n = this._getConcatString(row, indexes);
                if (n !== '') {
                    v.push(n);
                }
            }, this);

            v = _.uniq(v);
            if (order) {
                switch (order.toLowerCase()) {
                    case 'asc': return v.sort();
                    case 'desc': return v.sort().reverse();
                }
            }
            return v;
        };

        Matrix_Schema_Adapter.prototype._getYAxisIndex = function (yAxis, label) {
            var index = 0;

            _.each(yAxis, function (y, i) {
                if (y.title.text === label) {
                    index = i;
                }
            }, this);

            if (index < 0) {
                console.error("Data contains an unknown yAxis value: " + label);
            }

            return index;
        };

        Matrix_Schema_Adapter.prototype._addSerie = function(series, serie, valueIndex) {
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


        Matrix_Schema_Adapter.prototype._processPieChart = function(config) {
            // TODO: add default PIE dimensions?
            var chartObj  = config.chartObj,
                data = config.model,
                seriesIndexes = config.seriesDimensions,
                valueIndex = config.valueDimensions;

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

            _.each(data, function(row) {

                var name = this._createSeriesName(row, seriesIndexes);
                if (row[valueIndex] !== null && name !== null) {
                    chartObj.series[0].data.push([name, isNaN(row[valueIndex])? row[valueIndex]: parseFloat(row[valueIndex])]);
                }

            }, this);

            console.log(chartObj);

            return chartObj;
        };

        return Matrix_Schema_Adapter;
    });