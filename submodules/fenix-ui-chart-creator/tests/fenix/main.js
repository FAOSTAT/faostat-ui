/*global requirejs, $*/
requirejs(['../../src/js/paths', '../utils'], function (paths, Utils) {

    'use strict';

    var FENIX_CDN = "//fenixrepo.fao.org/cdn",
        baseUrl = '../../src/js/';

    // replace placeholders and baseUrl
    paths = Utils.replacePlaceholders(paths, FENIX_CDN);
    paths.baseUrl = baseUrl;

    requirejs.config(paths);

    requirejs(['fx-c-c/start', 'jquery', 'amplify'], function (ChartCreator, $) {

        // Chart with scattered data
        $.getJSON("data/afo/scattered_data.json", function (model) {

           // Consistant Timeserie Chart
            var c = new ChartCreator();
            $.when(c.init({
                model: model,
                adapter: {
                    type: "timeserie",
                    xDimensions: 'time',
                    yDimensions: 'Element',
                    valueDimensions: 'value',
                    seriesDimensions: []
                },
                template: {},
                creator: {}
            })).then(function(creator) {
                var o = {
                    template: {
                        title: "Chart with Timeserie"
                    }
                };
                creator.render(Utils.lineChartOptions(o));
                creator.render(Utils.columnChartOptions(o));
                creator.render(Utils.barChartOptions(o));
            });

            // Scattered Data Chart
            var c2 = new ChartCreator();
            $.when(c2.init({
                model: model,
                adapter: {
                    type: "line",
                    xDimensions: 'time',
                    yDimensions: 'Element',
                    valueDimensions: 'value',
                    seriesDimensions: []
                },
                template: {},
                creator: {}
            })).then(function(creator) {
                var o = {
                    template: {
                        title: "Chart with scattered data"
                    }
                };
                creator.render(Utils.lineChartOptions(o));
                creator.render(Utils.columnChartOptions(o));
                creator.render(Utils.barChartOptions(o));
            });


            // Pie hart
            var c3 = new ChartCreator();
            $.when(c3.init({
                model: model,
                adapter: {
                    type: "pie",
                    // TODO: if type is 'pie' force the adapted to avoid xDimensions and yDimensions
                    xDimensions: null,
                    yDimensions: null,
                    valueDimensions: 'value',
                    seriesDimensions: []
                },
                template: {},
                creator: {}
            })).then(function(creator) {
                var o = {
                    template: {
                        title: "Pie Chart with scattered data"
                    }
                };
                creator.render(Utils.pieChartOptions(o));
            });


            // Pie Chart with custom series
            var c4 = new ChartCreator();
            $.when(c4.init({
                model: model,
                adapter: {
                    type: "pie",
                    // TODO: if type is 'pie' force the adapted to avoid xDimensions and yDimensions
                    xDimensions: null,
                    yDimensions: null,
                    valueDimensions: 'value',
                    seriesDimensions: ['Region']
                },
                template: {},
                creator: {}
            })).then(function(creator) {
                var o = {
                    template: {
                        title: "Pie Chart with scattered data and custom series"
                    }
                };
                creator.render(Utils.pieChartOptions(o));
            });
        });
    });

});