/*global define*/

define(function () {

    'use strict';

    return {

        dashboard: {

            "render": true,

            //data base filter
            defaultFilter: {
                domain_codes: ['RF'],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                decimal_places: 2,
                decimal_separator: ".",
                limit: -1,
                thousand_separator: ",",
                null_values: null,
                page_size: 0,
                per_page: 0,
                page_number: 0
            },

            // labels?
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

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "World fertilizers consumption (nutrients)",
                                fr: "Consomation mondiale d'engrais (nutriments)",
                                es: "Consumo mundial de fertilizantes (nutrientes)"
                            },
                            subtitle: "2002 - 2009"
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
                    allowedFilter: [],
                    filter: {
                        List1Codes: [5000],
                        List2Codes: [5155],
                        List3Codes: [
                            3102,
                            3103,
                            3104
                        ],
                        List4Codes: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009],
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
                            subtitle: "2002 - 2009"
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
                    allowedFilter: [],
                    filter: {
                        List1Codes: [5000],
                        List2Codes: [5155],
                        List3Codes: [
                            3102,
                            3103,
                            3104
                        ],
                        List4Codes: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009],
                        "order_by": 'year',
                        "group_by": 'item',
                        "operator": "AVG"
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
                                fr: "Consommation des 10 principaux consommateur",
                                es: "Consumo de los 10 principales consumadores"
                            },
                            subtitle: "{{aggregation}} 2002 - 2005"
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
                        List1Codes: ["5000>"],
                        List2Codes: [5155],
                        List3Codes: [
                            3102,
                            3103,
                            3104
                        ],
                        List4Codes: [2002, 2003, 2004, 2005],
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
                                fr: "Consommation des 10 principaux consommateur",
                                es: "Consumo de los 10 principales consumadores"
                            },
                            subtitle: "{{aggregation}} 2006 - 2009"
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
                        List1Codes: ["5000>"],
                        List2Codes: [5155],
                        List3Codes: [
                            3102,
                            3103,
                            3104
                        ],
                        List4Codes: [2006, 2007, 2008, 2009],
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