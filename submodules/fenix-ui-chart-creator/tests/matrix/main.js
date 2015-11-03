/*global requirejs*/
requirejs(['../../src/js/paths', '../utils'], function (paths, Utils) {

    'use strict';

    var FENIX_CDN = "//fenixrepo.fao.org/cdn",
        baseUrl = '../../src/js/';

    // replace placeholders and baseUrl
    paths = Utils.replacePlaceholders(paths, FENIX_CDN);
    paths.baseUrl = baseUrl;

    requirejs.config(paths);

    requirejs(['fx-c-c/start', 'jquery', 'amplify'], function (ChartCreator, $) {

        // Chart with timeseries
        $.getJSON("data/data.json", function (model) {

            // Line chart with X-Axis order 'xOrder'
            var c = new ChartCreator();
            $.when(c.init({
                model: model,
                // TODO: the adpter can be moved also in the 'then' function after the promise
                adapter: {
                    // used in init just for MATRIX and FENIX
                    xOrder: 'asc',
                    xDimensions: [0],
                    yDimensions: [3],
                    valueDimensions: 2,
                    seriesDimensions: [1]
                }
            })).then(function(creator) {
                var o = {
                    template: {
                        title: "Chart with Date X-Axis order 'xOrder' = 'asc'"
                    }
                };
                creator.render(Utils.lineChartOptions(o));
            });

        });

        // Chart with no date
        $.getJSON("data/no_date.json", function (model) {

            // Line chart with X-Axis order 'xOrder'
            var c = new ChartCreator();
            $.when(c.init({
                model: model
            })).then(function(creator) {
                var o = {
                    template: {
                        title: "Chart with X-Axis order 'xOrder' = 'desc'"
                    },
                    adapter: {
                        // used in init just for MATRIX and FENIX
                        xOrder: 'desc',
                        xDimensions: [0],
                        yDimensions: [3],
                        valueDimensions: 2,
                        seriesDimensions: [1]
                    }
                };
                creator.render(Utils.columnChartOptions(o));
            });

        });

        // FAOSTAT Rankings workaround
        $.getJSON("data/rankings.json", function (model) {

            // reshape model data (rankings has it's own join data method)
            var data = [];
            model.forEach(function(row) {
                data.push([row[0],row[1], row[2], row[3]]);
                data.push([row[0],row[4], row[5], row[6]]);
            });
            model = data;

            var c = new ChartCreator();
            $.when(c.init({
                model: model
            })).then(function(creator) {
                var o = {
                    template: {
                        title: "FAOSTAT Rankings"
                    }
                };
                creator.render(Utils.columnChartOptions(o));
            });

        });

        // No Data Chart
        $.getJSON("data/nodata.json", function (model) {
            var c = new ChartCreator();
            $.when(c.init({
                model: model
            })).then(function(creator) {
                var o = {
                    template: {
                        title: "Chart with no data values",
                    }
                };
                creator.render(Utils.columnChartOptions(o));
            });
        });

        // PIE
        $.getJSON("data/pie.json", function (model) {
            var c = new ChartCreator();
            $.when(c.init({
                model: model
            })).then(function(creator) {
                var o = {
                    template: {
                        title: "PIE Chart"
                    },
                    adapter: {
                        // TODO: add default PIE dimensions?
                        type: "pie",
                        xDimensions: null,
                        yDimensions: null,
                        valueDimensions: 0,
                        seriesDimensions: [1]
                    }
                };
                creator.render(Utils.pieChartOptions(o));
            });

        });

    });
});