    /*global define*/
define([
    'jquery',
    'i18n!nls/home',
    'config/submodules/fx-chart/highcharts_template'
],function ($, i18n, HighchartsTemplate) {

    'use strict';

    return {

        MAX_DATABASE_UPDATES: 100,

        chart: {

            adapter: {
                adapterType: 'faostat',
                type: "standard",
                xDimensions: 'year',
                yDimensions: 'unit',
                valueDimensions: 'value',
                seriesDimensions: ['item']
            },
            template: {
                html: '<div data-role="content"  style="height:300px"></div>'
            },
            creator: {
                chartObj: $.extend(true, {}, HighchartsTemplate,{
                    chart: {
                        type: 'line'
                    },
                    exporting: {
                        enabled: false
                    },
                    xAxis: {
                        labels: {
                            rotation: -45
                        }
                    },
                    plotOptions: {
                        series: {
                            allowPointSelect: true, //Permette di selezionare i punti della chart
                            animation: { // Configura l'animazione di entrata
                                duration: 1000,
                                easing: 'swing'
                            },
                            connectNulls: true,
                            cropThreshold: 3,
                            lineWidth: 1, // IMPORTANTE - Cambia lo spessore delle linee della chart
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            fillColor: {
                                linearGradient: [0, 0, 0, 350],
                                stops: [
                                    [0, 'rgba(55, 155, 205,0.5)'],
                                    [1, 'rgba(255,255,255,0)']
                                ]
                            },
                            marker: {
                                enabled: true, //Attiva o disattiva i marker
                                symbol: 'circle', // Tipologia di marker
                                radius: 4,
                                lineWidth: 1,
                                lineColor: '#379bcd',
                                fillColor: '#FFFFFF',
                                states: {
                                    hover: {
                                        enabled: true, // Attiva o disattiva il marker quando si passa sopra la chart
                                        symbol: 'circle',
                                        fillColor: '#FFFFFF',
                                        lineColor: '#3ca7da',
                                        radius: 5,
                                        lineWidth: 2
                                    }
                                }
                            }
                        }
                    }
                })
            }
        }

    };
});