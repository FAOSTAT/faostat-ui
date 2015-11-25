/*global define*/

define(function () {

    'use strict';

    return {

        dashboard: {

            //data base filter
            defaultFilter: {
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                decimal_places: 2,
                decimal_separator: ".",
                limit: -1,
                thousand_separator: ",",
                "null_values": null,
                page_size: 1000000
            },

            // labels?
            labels: {
                // labels to dinamically substitute the title and subtitle
                default: {
                }
            },


            //bridge configuration
            bridge: {

                type: "faostat",
                requestType: 'data' // data, rankings

            },

            metadata: {},

            items: [
                {
                    type: 'chart',
                    class: "col-xs-12 col-md-8",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Population composition in selected country (by year)",
                                fr: "Composition de la population dans le pays sélectionné (par anne)",
                                es: "Composicin de la poblacin en el pas seleccionado (por año)"
                            },
                            subtitle: "2015"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "timeserie",
                            xDimensions: ['year'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['element']
                        },
                        template: {
                            height: '200px'
                        },
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                }
                            }
                        }
                    },
                    allowedFilter: ['area', 'year', 'item', 'aggregation'],
                    filter: {
                        domain_code: "OA",
                        List2Codes: [
                            551,
                            571,
                            511,
                            602,
                            603
                        ],
                        List3Codes: [3010],
                        List4Codes: [2015]
                    }
                },
                {
                    type: 'table',
                    class: "col-xs-12 col-md-4",

                    // labels?
                    labels: {
                        // labels to dinamically substitute the title and subtitle
                        default: {},

                        //template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Land Resources (1000 Ha)",
                                fr: "Land Resources (1000 Ha)",
                                es: "Land Resources (1000 Ha)"
                            },
                            subtitle: "2012"
                        }
                    },


                    //height:'250px',
                    config: {
                        adapter: {
                            columns: ['item', 'value'],
                            showCodes: false
                        },
                        template: {
                            tableOptions: {
                                'data-search': false,
                                'data-show-header': false
                            }
                        }
                    },
                    allowedFilter: ['area', 'item', 'year', 'element', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        domain_code: "RL",
                        List2Codes: [5110],
                        List3Codes: [6600, 6610, 6661],
                        List4Codes: [2012]
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12 col-md-6",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Land Use",
                                fr: "Utilizo de la Tierra",
                                es: "Utilisation des terres"
                            },
                            subtitle: "2012"
                        }

                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "pie",
                            xDimensions: null,
                            yDimensions: null,
                            valueDimensions: 'value',
                            seriesDimensions: ['item']
                        },
                        template: {
                            //height: '250px'
                        },
                        creator: {}
                    },
                    allowedFilter: ['area', 'year', 'item', 'aggregation'],
                    filter: {
                        domain_code: "RL",
                        List2Codes: [5110],
                        List3Codes: [6621, 6650, 6655, 6661, 6670],
                        List4Codes: [2012]
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12 col-md-6",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Production Indices - Net Production Index Number (2004-2006 = 100)",
                                fr: "Indices de Production - Index de production Net (2004-2006=100)",
                                es: "Indices de Producción - Número índice de Producción Neta (2004-2006 = 100)"
                            },
                            subtitle: "2003 - 2013"
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
                        template: {
                            // height:'350px'
                            // default labels to be applied
                        },
                        creator: {}
                    },
                    allowedFilter: ['area', 'year', 'item'],
                    filter: {
                        domain_code: "QI",
                        List2Codes: [438],
                        List3Codes: [1717,
                            2051,
                            2054,
                            2057],
                        List4Codes: [
                            2003,
                            2004,
                            2005,
                            2006,
                            2007,
                            2008,
                            2009,
                            2010,
                            2011,
                            2012,
                            2013
                        ]
                    }
                },
                /*{
                    type: 'chart',
                    class: "col-xs-12 col-md-6",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Emissions by sector",
                                fr: "Émissions par secteur",
                                es: "Emissions por sector"
                            },
                            subtitle: "1990 - 2012"
                        }
                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "pie",
                            xDimensions: null,
                            yDimensions: null,
                            valueDimensions: 'value',
                            seriesDimensions: ['item']
                        },
                        template: {
                            // height:'350px'
                            // default labels to be applied
                        },
                        creator: {}
                    },
                    allowedFilter: ['area', 'year', 'item'],
                    filter: {
                        domain_code: "GT",
                        List2Codes: [7231],
                        List3Codes: [5058,  5059, 5060, 5061, 5062, 5063, 5064, 5066, 5067, 6759],
                        List4Codes: [
                            1990,
                            1991,
                            1992,
                            1993,
                            1994,
                            1995,
                            1996,
                            1997,
                            1998,
                            1999,
                            2000,
                            2001,
                            2002,
                            2003,
                            2004,
                            2005,
                            2006,
                            2007,
                            2008,
                            2009,
                            2010,
                            2011,
                            2012
                        ],
                        "group_by": 'year',
                        "order_by": 'area',
                        "operator": 'AVG',
                        "limit": '-1'
                    }
                }*/
            ]
        }

    }
});