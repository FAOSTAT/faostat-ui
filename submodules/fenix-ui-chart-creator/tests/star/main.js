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

/*        amplify.subscribe('fx.component.chart.ready', function () {
            console.log('created!')
        });*/

   /*     $.getJSON("data/GHG_test_data.json", function (model) {

            var creator = new ChartCreator();

            creator.init({
                model: model,
                adapter: {
                    filters: ['DomainCode', 'TableType', 'GUNFCode'],
                    x_dimension: 'Year',
                    y_dimension: 'GUNFItemNameE',
                    value: 'GValue'
                },
                template: {},
                creator: {},
                onReady: renderCharts
            });
        });


        function renderCharts(creator) {

            creator.render({
                container: "#chart1",
                creator: {
                },
                adapter: {
                    xAxis: {
                        order: "ASC"
                    },
                    series: [
                        {
                            filters: {
                                'DomainCode': 'GAS',
                                'TableType': 'activity',
                                'GUNFCode': '5057'
                            },
                            value: 'GValue',
                            type: 'column',
                            color: 'maroon',
                            name: 's1'
                        }
                    ]
                }
            });

            creator.render({
                container: "#chart2",
                noData: "<div>No data Available</div>",
                creator: {
                    chartObj: {
                        chart:{
                            type: "column"
                        }
                    }
                },
                adapter: {
                    series: [
                        {
                            filters: {
                                'DomainCode': 'GAS',
                                'TableType': 'activity',
                                'GUNFCode': '5057'
                            },
                            value: 'GValue',
                            type: 'line',
                            color: 'maroon',
                            name: 's1'
                        },
                        {
                            filters: {
                                'DomainCode': 'GAS',
                                'TableType': 'activity',
                                'GUNFCode': '5057'
                            },
                            name: 's2',
                            value: 'GValue',
                        },
                        {
                            filters: {
                                'DomainCode': 'GAS',
                                'TableType': 'activity',
                                'GUNFCode': '1712'
                            },
                            value: 'PerDiff',
                            name: 's3',
                            type: 'scatter'
                        }
                    ]
                }
            });


            creator.render({
                container: "#chart3",
                noData: "<div>No data Available</div>",
                creator: {
                    chartObj: {
                        chart:{
                            type: "column"
                        }
                    }
                },
                adapter: {
                    type: "pie",
                    series: [
                        {
                            filters: {
                                'DomainCode': 'GAS',
                                'TableType': 'activity',
                                'GUNFCode': '5057'
                            },
                            value: 'GValue',

                            // this is just for the pie and it's used to create the series name
                            sliceName: ['GUNFItemNameE', 'Year']
                        }
                    ]
                }
            });
        };*/


        $.getJSON("data/flude/data.json", function (model) {

            var creator = new ChartCreator();

            creator.init({
                model: model,
                adapter: {
                    filters: ['Country']
                    //type: 'timeserie',
                    //groupby: ['Country']
                },
                template: {},
                creator: {},
                onReady: renderCharts
            });
        });


        function renderCharts(creator) {

            creator.render({
                container: "#chart1",
                creator: {
                },
                adapter: {
                    xOrder: 'asc',
                    xDimensions: ['Year'],
                    yDimensions: ['Region'],

                    series: [
                        {
                            filters: {
                                'Country': 'BWA'
                            },
                            valueDimensions: 'NFLoss',
                            name: 'BWA'
                        }
                    ]
                }
            });
        }




  /*      $.getJSON("data/flude/data.json", function (model) {

            console.log(model);

            var creator = new ChartCreator();

            creator.init({
                model: model,
                adapter: {
                    filters: ['Country']
                },
                template: {},
                creator: {},
                onReady: renderCharts
            });
        });


        function renderCharts(creator) {

            console.log(creator);
            creator.render({
                container: "#chart1",
                creator: {
                },
                adapter: {
                    x_dimension: 'Year',
                    y_dimension: 'Region',
                    series: [
                        {
                            filters: {
                                'Country': 'BWA',
                            },
                            value: 'NFLoss',
                            name: 'BWA'
                        }
                    ]
                }
            });
        };*/


    });
});