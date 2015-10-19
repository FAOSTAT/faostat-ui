/*global define, amplify, console*/
define([
        'jquery',
        'underscore',
        'amplify'
    ],
    function ($, _) {

        'use strict';

        var defaultOptions = {

                // Chart (Highcharts Definition)
                chartObj: {
                    chart: {},
                    xAxis: {},
                    series: []
                },
                chartsData: {}
            },

            e = {
                DESTROY: 'fx.component.chart.destroy',
                READY: 'fx.component.chart.ready'
            };

        function Star_Schema_Adapter() {
            return this;
        }

        Star_Schema_Adapter.prototype.prepareData = function (config) {

            this.o = $.extend(true, {}, defaultOptions, config);

            if (this._validateInput() === true) {
                this._prepareData();
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

        Star_Schema_Adapter.prototype._validateInput = function () {

            this.errors = {};

            return (Object.keys(this.errors).length === 0);
        };

        Star_Schema_Adapter.prototype.create_tree_item = function (father, filters, row) {

            if (filters.length > 1) {


                if (father[row[filters[0]]] === null || father[row[filters[0]]] === undefined) {

                    father[row[filters[0]]] = {};
                }

                var tmp = father[row[filters[0]]];

                filters.splice(0, 1);

                this.create_tree_item(tmp, filters, row);
            } else {

                if (!Array.isArray(father[row[filters[0]]])) {
                    father[row[filters[0]]] = [];
                }

                father[row[filters[0]]].push(row);
            }
        };

        Star_Schema_Adapter.prototype._prepareData = function () {

            for (var i = 0; i < this.o.model.length; i++) {
                var row = this.o.model[i];
                var f = this.o.filters.slice();

                this.create_tree_item(this.o.chartsData, f, row);
            }

        };

        Star_Schema_Adapter.prototype._validateData = function () {
            this.errors = {};
            return (Object.keys(this.errors).length === 0);
        };

        Star_Schema_Adapter.prototype._onValidateDataSuccess = function () {
            return true;
        };

        Star_Schema_Adapter.prototype._onValidateDataError = function () {
            return true;
        };

        Star_Schema_Adapter.prototype.prepareChart = function(c) {

            var config = $.extend(true, {}, this.o, c);

            var chartObj;

            switch (config.type) {
                case 'pie':
                    chartObj = this._processPieChart(config);
                    break;
                case 'scatter':
                    break;
                case 'timeserie':
                    break;
                default :
                    chartObj = this._processStandardChart(config);
                    break;
            }

            return chartObj;
        };

        Star_Schema_Adapter.prototype._processStandardChart = function(config) {

            var chartObj = config.chartObj,

            // general config for xDimensions, yDimensions, valueDimensions (otherwise can be serie specific)
                x_dimension = config.xDimensions,
                y_dimension = config.yDimensions,
                value = config.valueDimensions,

                chartsData = config.chartsData,
                seriesConfig = config.series,
                filters = config.filters,
                xOrder = config.xOrder || null;

            // TODO: workaround on arrays used to standardize all charts.
            // TODO: Add check on multiple columns (like for series)
            x_dimension = _.isArray(x_dimension)? x_dimension[0]: x_dimension;
            y_dimension = _.isArray(y_dimension)? y_dimension[0]: y_dimension;
            value = _.isArray(value)? value[0]: value;


            // get all data of the series
            var data = [];
            _.each(seriesConfig, function(serie) {
                data.push(this.filterSerie(chartsData, serie, filters));
            }, this);

            if (data.length === 0) {
                console.error("No data available TODO: (handle it)");
            }

            // get categories
            chartObj.xAxis.categories = this._createXAxisCategories(data, x_dimension, xOrder);

            // create yAxis
            if (y_dimension !== null && y_dimension !== undefined) {
                chartObj.yAxis = this._createYAxis(data, y_dimension);
            }

            // create series with merging of serie configuration
            _.each(seriesConfig, function(serie, index) {

                // valueDimensions checks if serie.valueDimensions is defined, otherwise uses the global one, otherwise throws an error
                var valueDimensions = serie.valueDimensions || value || null;
                // TODO: workaround on arrays used to standardize all charts.
                // TODO: Add check on multiple columns (like for series)
                valueDimensions = _.isArray(valueDimensions)? valueDimensions[0]: valueDimensions;

                if (valueDimensions === null) {
                    console.error("value (dimension) is null");
                    throw new Error("value (dimension) is null");
                }
                // create a single serie
                var s = this._createSerie(data[index], x_dimension, y_dimension, valueDimensions, chartObj.xAxis.categories, chartObj.yAxis);

                // push it to the series
                chartObj.series.push($.extend(true, s, serie));
            }, this);

            return chartObj;
        };

        Star_Schema_Adapter.prototype._createSerie = function (dataSerie, xDimension, yDimension, valueDimension, xCategories, yAxis) {

            var serie = {
                data: []
            };

            _.each(xCategories, function() {
                serie.data.push(null);
            });

            // Create the series
            _.each(dataSerie, function (row) {

                // Create yAxis if exists
                if (yDimension) {
                    // TODO
                    var yLabel = row[yDimension];
                    //yLabel = this.aux.code2label[this._getColumnBySubject(this.yAxisSubject).id][yValue];
                    serie.yAxis = this._getYAxisIndex(yAxis, yLabel);
                }

                // push the value of the serie
                if (row[xDimension] !== null && row[xDimension] !== undefined && row[valueDimension] !== undefined && row[valueDimension] !== null) {

                    var index = _.indexOf(xCategories, row[xDimension]);
                    serie.data[index] = isNaN(row[valueDimension])? row[valueDimension]: parseFloat(row[valueDimension]);

                }

            }, this);

            return serie;
        };

        Star_Schema_Adapter.prototype._createXAxisCategories = function(data, xIndex, order) {

            var xCategories = [];

            _.each(data, function(serie) {
                _.each(serie, function(row) {
                    if (row[xIndex] === null) {
                        console.warn("Error on the xAxis data (is null)", row[xIndex], row);
                    }
                    else {
                        xCategories.push(row[xIndex]);
                    }
                });
            });
            xCategories = _.uniq(xCategories);
            if (order) {
                switch (order.toLowerCase()) {
                    case 'asc': return xCategories.sort();
                    case 'desc': return xCategories.sort().reverse();
                }
            }

            return xCategories;
        };

        Star_Schema_Adapter.prototype._createYAxis = function (data, index) {

            var yAxisNames = [],
                yAxis = [];

            if (index !== null) {
                data.forEach(function (serie) {
                    serie.forEach(function (row) {
                        if (row[index] === null) {
                            console.warn("Error on the xAxis data (is null)", row[index], row);
                        }
                        else {
                            yAxisNames.push(row[index]);
                        }
                    });
                });

                yAxisNames = _.uniq(yAxisNames);

                // creating yAxis objects
                // TODO; probably it should merge the yAxis template somehow. PROBLEM: how to merge multiple axes properties from the baseConfig?
                yAxisNames.forEach(_.bind(function (v) {
                    yAxis.push({title: {text: v}});
                }, this));
            }

            return yAxis;
        };

        Star_Schema_Adapter.prototype._getYAxisIndex = function (yAxis, label) {
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

        Star_Schema_Adapter.prototype.filterSerie = function (chartsData, config, filters) {

            var data = $.extend(true, {}, chartsData);

            _.each(filters, _.bind(function (f) {
                //Controlla che esiste
                data = data[config.filters[f]];

            }, this));

            return data;
        };

        Star_Schema_Adapter.prototype._processPieChart = function(config) {
            var chartObj  = config.chartObj,
                model = config.chartsData,
                valueDimension = config.value,
                filters = config.filters,
                seriesConfig = config.series;

            // force type "pie" to chart
            chartObj.chart.type = "pie";

            // initialize the series
            chartObj.series = [];

            // Creating series (in theory just one for the pie)
            _.each(seriesConfig, function(serie) {

                var chartSerie = {
                    // TODO: name?
                    name: '',
                    data: []
                };

                var data = this.filterSerie(model, serie, filters);
                _.each(data, function(row) {

                    var name = this._getName(row, serie.sliceName);
                    var value = row[valueDimension];

                    if (value !== null && name !== null) {
                        value = isNaN(row[valueDimension])? row[valueDimension]: parseFloat(row[valueDimension]);

                        // add serie
                        chartSerie.data.push([name, value]);
                    }

                }, this);

                // add serie to the chart
                chartObj.series.push(chartSerie);
            }, this);

            return chartObj;
        };

        Star_Schema_Adapter.prototype._getName = function (row, indexes) {
            var n = '';
            _.each(indexes,function(index) {
                n = n.concat(row[index] + ' ');
            });
            n = n.trim();
            return n;
        };

        return Star_Schema_Adapter;
    });