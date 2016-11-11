/*global define*/

define(function () {

    'use strict';

    return {

        filter: {
            defaultFilter: {
                "domain_code": ["RF"],
                "show_lists": false
            },
            items: [
                {
                    "id": "yearTimeserie",
                    "type": "codelist",
                    "parameter": "year",
                    "componentType": {
                        "class": "hidden",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "years",
                        "defaultCodes": [],
                        "filter": {}
                    }
                }
            ]
        },

        dashboard: {

            // TODO: this should be automatically added if filter is null
            //"render": true,

            //data base filter
            defaultFilter: {
                domain_code: ['RF']
            },

            // labels
            labels: {
                // labels to dinamically substitute the title and subtitle
                // TODO: import i18n in the js to be consistent?
                default: {
                    aggregation: {
                         en: "Average",
                         fr: "Moyenne",
                         es: "Promedio"
                     }
                }
            },

            items: [
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "World fertilizers consumption (nutrients)",
                                fr: "Consomation mondiale d'engrais (nutriments)",
                                es: "Consumo mundial de fertilizantes (nutrientes)"
                            },
                            subtitle: "{{yearTimeserie}}"
                        }
                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "timeserie",
                            xDimensions: 'year',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['item']
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['yearTimeserie'],
                    filter: {
                        area: [5000],
                        element: [5155],
                        item: [
                            3102,
                            3103,
                            3104
                        ],
                        "order_by": 'year'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "World consumption in nutrients (total)",
                                fr: "La consommation mondiale en nutriments (total)",
                                es: "Consumo mundial de nutrientes (total)"
                            },
                            subtitle: "{{yearTimeserie}}"
                        }
                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "timeserie",
                            xDimensions: 'year',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['element']
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['yearTimeserie'],
                    filter: {
                        area: [5000],
                        element: [5155],
                        item: [
                            3102,
                            3103,
                            3104
                        ],
                        "order_by": 'year',
                        "group_by": 'item',
                        "operator": "SUM"
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Consumption of top 10 consumers",
                                fr: "Consommation des 10 consommateurs principaux",
                                es: "Consumo de los 10 consumadores principales"
                            },
                            subtitle: "{{aggregation}} 2002 - 2007"
                        }
                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'area',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['element']
                        },
                        template: {},
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                }
                            }
                        }
                    },
                    allowedFilter: [],
                    filter: {
                        area: ["5000>"],
                        element: [5155],
                        item: [
                            3102,
                            3103,
                            3104
                        ],
                        year: [2002, 2003, 2004, 2005, 2006, 2007],
                        "group_by": 'year, item',
                        "operator": "avg",
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Consumption of top 10 consumers",
                                fr: "Consommation des 10 consommateurs principaux",
                                es: "Consumo de los 10 consumadores principales"
                            },
                            subtitle: "{{aggregation}} 2008 - 2013"
                        }
                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'area',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['element']
                        },
                        template: {},
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                }
                            }
                        }
                    },
                    allowedFilter: [],
                    filter: {
                        area: ["5000>"],
                        element: [5155],
                        item: [
                            3102,
                            3103,
                            3104
                        ],
                        year: [2008, 2009, 2010, 2011, 2012, 2013],
                        "group_by": 'year, item',
                        "operator": "avg",
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                }
            ]
        }
    }
});