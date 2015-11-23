/*global define, amplify */
define([
        'jquery',
        'underscore',
        'loglevel',
        'fx-c-c/config/creators/highcharts_template',
        //'highcharts-export',
        //'highcharts-export-csv',
        'amplify'
    ],
    function ($, _, log, baseConfig) {

        'use strict';

        var defaultOptions = {

                s: {
                    CONTENT: '[data-role="content"]'
                },

                // TODO: handle multilanguage?
                noData: "<div>No Data Available</div>"

            },
            e = {
                DESTROY: 'fx.component.chart.destroy',
                READY: 'fx.component.chart.ready'
            };

        function HightchartCreator(config) {

            this.o = {};
            $.extend(true, this.o, defaultOptions, config);
            this.o.hightchart_template = baseConfig;

            return this;
        }

        HightchartCreator.prototype._validateInput = function () {

            this.o.errors = {};

            //Container
            if (!this.o.hasOwnProperty("container")) {
                this.o.errors.container = "'container' attribute not present.";
            }

            if ($(this.o.container).find(this.o.s.CONTENT) === 0) {
                this.o.errors.container = "'container' is not a valid HTML element.";
            }

            return (Object.keys(this.o.errors).length === 0);
        };

        HightchartCreator.prototype.render = function (config) {

            $.extend(true, this.o, config);

            if (this._validateInput() === true) {

                //Init chart container
                this.$container = $(this.o.container).find(this.o.s.CONTENT);

                if (this._validateSeries() === true) {

                    // create chart
                    this._createChart();

                }else {
                    this.noDataAvailable();
                }
            } else {
                log.error(this.o.errors);
                throw new Error("FENIX hightchart_creator has not a valid configuration");
            }
        };

        HightchartCreator.prototype._createChart = function () {
            this.o.config = $.extend(true, {}, baseConfig, this.o.chartObj);
            this.$container.highcharts(this.o.config);
        };

        HightchartCreator.prototype._onValidateDataError = function () {
            this._showConfigurationForm();
        };

        HightchartCreator.prototype._createConfiguration = function () {
            this.o.config = $.extend(true, {}, baseConfig, this.o.chartObj);
        };

        HightchartCreator.prototype._validateSeries = function() {

            for(var i=0; i < this.o.chartObj.series.length; i++) {
                for(var j=0; j < this.o.chartObj.series[i].data.length; j++) {
                    if (this.o.chartObj.series[i].data[j] !== null) {
                        return true;
                    }
                }
            }

            return false;
        };

        HightchartCreator.prototype.reflow = function () {

            if (typeof this.$container !== 'undefined' && this.$chartRendered) {
                this.$container.highcharts().reflow();
                return true;
            }
        };

        HightchartCreator.prototype.noDataAvailable = function () {
            this.$container.html(this.o.noData);
        };

        HightchartCreator.prototype.destroy = function () {
            this.o.$container.highcharts().destroy();
        };

        return HightchartCreator;
    });