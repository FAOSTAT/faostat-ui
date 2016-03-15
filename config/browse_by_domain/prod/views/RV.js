/*global define*/

define(function () {

    'use strict';

    return {

        dashboard: {

            "render": true,

            //data base filter
            defaultFilter: {
                domain_codes: ['RV'],
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
                                en: "Imports of top 10 importers (value)",
                                fr: "Importations du top 10 des importateurs (valeur)",
                                es: "Importaciones de los 10 principales importadores (valor)"
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
                        List2Codes: [2620],
                        List3Codes: [3102, 1375, 1386],
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
                                en: "Imports of top 10 importers (value)",
                                fr: "Importations du top 10 des importateurs (valeur)",
                                es: "Importaciones de los 10 principales importadores (valor)"
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
                        List2Codes: [2620],
                        List3Codes: [3102, 1375, 1386],
                        List4Codes: [2006, 2007, 2008, 2009],
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
                                en: "Exports of top 10 exporters (value)",
                                fr: "Exportations des 10 premiers exportateurs  (valeur)",
                                es: "Exportaciones de los 10 principales exportadores (valor)"
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
                        List2Codes: [2920],
                        List3Codes: [3102, 1375, 1386],
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
                                en: "Exports of top 10 exporters (value)",
                                fr: "Exportations des 10 premiers exportateurs  (valeur)",
                                es: "Exportaciones de los 10 principales exportadores (valor)"
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
                        List2Codes: [2920],
                        List3Codes: [3102, 1375, 1386],
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