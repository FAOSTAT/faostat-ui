/*global define, console, $*/
define([],
    function () {

        // TODO: JQuery is assumed to be already loaded

        'use strict';

        var Utils = function () {

            function replacePlaceholders(paths, FENIX_CDN) {
                for (var i in Object.keys(paths.paths)) {
                    if (paths.paths.hasOwnProperty(Object.keys(paths.paths)[i])) {
                        paths.paths[Object.keys(paths.paths)[i]] = paths.paths[Object.keys(paths.paths)[i]].replace('{FENIX_CDN}', FENIX_CDN);
                    }
                }
                return paths;
            }

            function createDiv(id) {
                var div = document.createElement("div");
                div.style.height = "450px";
                id = id || getRandomID();
                div.id = id;
                document.body.appendChild(div);
                return '#' + id;
            }

            function getRandomID() {
                return Math.random().toString(36).substring(7);
            }

            function lineChartOptions(options, container) {
                return $.extend({}, options || {}, {
                    container: container || createDiv(),
                    creator: {
                        chartObj: {
                            chart:{
                                type: "line"
                            },
                            tooltip: {
                                crosshairs: "mixed",
                                shared: true
                            }
                        }
                    }
                });
            }

            function columnChartOptions(options, container) {
                return $.extend({}, options || {}, {
                    container: container || createDiv(),
                    creator: {
                        chartObj: {
                            chart:{
                                type: "column"
                            }
                        }
                    }
                });
            }

            function barChartOptions(options, container) {
                return $.extend({}, options || {}, {
                    container: container || createDiv(),
                    creator: {
                        chartObj: {
                            chart:{
                                type: "bar"
                            }
                        }
                    }
                });
            }

            function pieChartOptions(options, container) {
                return $.extend({}, options || {}, {
                    container: container || createDiv(),
                    creator: {
                        chartObj: {
                            chart:{
                                type: "pie"
                            },
                            plotOptions: {
                                pie: {
                                    allowPointSelect: true,
                                    cursor: 'pointer',
                                    showInLegend: true
                                }
                            }
                        }
                    }
                });
            }

            return {
                replacePlaceholders: replacePlaceholders,
                createDiv: createDiv,
                lineChartOptions: lineChartOptions,
                columnChartOptions: columnChartOptions,
                barChartOptions: barChartOptions,
                pieChartOptions: pieChartOptions
            };
        };
    return Utils();
});
