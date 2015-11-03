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
        /*        $.getJSON("data/data.json", function (model) {

         // Consistant Timeseri/e Chart
         var c = new ChartCreator();
         $.when(c.init({
         model: model,
         adapter: {
         adapterType: 'faostat',
         type: "timeserie",
         xDimensions: 'yeargroup',
         yDimensions: 'unit',
         valueDimensions: 'value',
         seriesDimensions: ['areagroup']
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
         //creator.render(Utils.columnChartOptions(o));
         //creator.render(Utils.barChartOptions(o));
         });

         });*/


        /*        $.getJSON("data/no_yearly_data.json", function (model) {

         // Consistant Timeseri/e Chart
         var c = new ChartCreator();
         $.when(c.init({
         model: model,
         adapter: {
         adapterType: 'faostat',
         type: "normal",
         xDimensions: 'yeargroup',
         yDimensions: 'unit',
         valueDimensions: 'value',
         //seriesDimensions: ['areagroup', 'itemgroup']
         seriesDimensions: []
         },
         template: {},
         creator: {}
         })).then(function(creator) {
         var o = {
         template: {
         title: "Scattered Data (No Timeserie)"
         }
         };
         creator.render(Utils.lineChartOptions(o));
         //creator.render(Utils.columnChartOptions(o));
         //creator.render(Utils.barChartOptions(o));
         });

         });*/


        /*        $.getJSON("data/double_axes.json", function (model) {

         // Consistant Timeseri/e Chart
         var c = new ChartCreator();
         $.when(c.init({
         model: model,
         adapter: {
         adapterType: 'faostat',
         type: "timeserie",
         xDimensions: 'yeargroup',
         yDimensions: 'unit',
         valueDimensions: 'value',
         seriesDimensions: ['areagroup', 'itemgroup']
         //seriesDimensions: []
         },
         template: {},
         creator: {}
         })).then(function(creator) {
         var o = {
         template: {
         title: "Double Axes",
         subtitle: "Stock Cattle"
         }
         };
         creator.render(Utils.lineChartOptions(o));
         //creator.render(Utils.columnChartOptions(o));
         //creator.render(Utils.barChartOptions(o));
         });

         });


         $.getJSON("data/scattered_data.json", function (model) {

         // Consistant Timeseri/e Chart
         var c = new ChartCreator();
         $.when(c.init({
         model: model,
         adapter: {
         adapterType: 'faostat',
         type: "timeserie",
         xDimensions: 'yeargroup',
         yDimensions: 'unit',
         valueDimensions: 'value',
         seriesDimensions: ['areagroup', 'itemgroup']
         },
         template: {},
         creator: {}
         })).then(function(creator) {
         var o = {
         template: {
         title: "Scattered Data",
         subtitle: "Percentage of children under 5 years of age who are underweight (%) (FS - Suite food secutiry indicators) "
         }
         };
         creator.render(Utils.lineChartOptions(o));
         });

         });

         $.getJSON("data/pie.json", function (model) {

         // Consistant Timeseri/e Chart
         var c = new ChartCreator();
         $.when(c.init({
         model: model,
         adapter: {
         adapterType: 'faostat',
         type: "pie",
         xDimensions: null,
         yDimensions: null,
         valueDimensions: 'value',
         seriesDimensions: ['areagroup']
         //seriesDimensions: []
         },
         template: {},
         creator: {}
         })).then(function(creator) {
         var o = {
         template: {
         title: "Pie",
         subtitle: "Emissions by continent (GHG-GE)"
         }
         };
         creator.render(Utils.pieChartOptions(o));
         });

         });*/

/*        $.getJSON("data/compare/producer_prices_annual.json", function (model) {

            // Consistant Timeserie Chart
            var c = new ChartCreator();
            $.when(c.init({
                model: model,
                adapter: {
                    adapterType: 'faostat',
                    type: "timeserie",
                    xDimensions: 'yeargroup',
                    yDimensions: 'unit',
                    valueDimensions: 'value',
                    seriesDimensions: ['areagroup', 'elementgroup', 'itemgroup']
                },
                template: {},
                creator: {}


            })).then(function (creator) {
                var o = {
                    template: {
                        title: "Scattered Data",
                        subtitle: "Percentage of children under 5 years of age who are underweight (%) (FS - Suite food secutiry indicators) "
                    }
                };

                creator.render(Utils.lineChartOptions(o));

            });

        });*/

        // COMPARE
       $.getJSON("data/compare/forestry_production_trade.json", function (model1) {

            $.getJSON("data/compare/production_crops.json", function (model2) {

                $.getJSON("data/compare/producer_prices_annual.json", function (model3) {

                    // Consistant Timeserie Chart
                    var c = new ChartCreator();
                    $.when(c.init({
                        model: model1,
                        adapter: {
                            adapterType: 'faostat',
                            type: "timeserie",
                            xDimensions: 'yeargroup',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['areagroup', 'elementgroup', 'itemgroup']
                        },
                        template: {},
                        creator: {},
                        prepareChart: true

                    })).then(function (creator) {

                        var o = {
                            model: model2,
                            adapter: {
                                adapterType: 'faostat',
                                type: "timeserie",
                                xDimensions: 'yeargroup',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['areagroup', 'elementgroup', 'itemgroup']
                            },
                            template: {},
                            creator: {},
                            prepareChart: true
                        };
                        creator.addTimeserieData(o);

                        o = {
                            model: model3,
                            adapter: {
                                adapterType: 'faostat',
                                type: "timeserie",
                                xDimensions: 'yeargroup',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['areagroup', 'elementgroup', 'itemgroup']
                            },
                            template: {},
                            creator: {},
                            prepareChart: true
                        };
                        creator.addTimeserieData(o);


                        creator.createChart(Utils.lineChartOptions({}));
                        //creator.render(Utils.lineChartOptions({}));


                        /*var o = {
                            model: model2,
                            adapter: {
                                adapterType: 'faostat',
                                type: "timeserie",
                                xDimensions: 'yeargroup',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['areagroup', 'elementgroup', 'itemgroup']
                            },
                            template: {},
                            creator: {},
                        };

                        creator.render(o, false);

                        console.log(model3);

                        o = {
                            model: model3,
                            adapter: {
                                adapterType: 'faostat',
                                type: "timeserie",
                                xDimensions: 'yeargroup',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['areagroup', 'elementgroup', 'itemgroup']
                            },
                            template: {},
                            creator: {}
                        };

                        creator.render(Utils.lineChartOptions(o));*/


                    });

                });

            });

        });


    });
});