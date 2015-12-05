/*global define*/

define(function () {

    'use strict';

    return {

        "population": {
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
                    page_size: 0,
                    per_page: 0
                },

                // labels?
                labels: {
                    // labels to dinamically substitute the title and subtitle
                    default: {}
                },


                //bridge configuration
                bridge: {

                    type: "faostat",
                    requestType: 'data' // data, rankings

                },

                metadata: {},

                items: [

                    // FORCE SPACING
                    {
                        type: 'custom',
                        class: 'col-xs-12',
                        config: {
                            template: {
                                html: '<h2>Population</h2>'
                            },
                            model: {
                                "test": "test"
                            }
                        }
                    },


                    {
                        type: 'chart',
                        class: "col-xs-12 col-md-6",

                        // labels?
                        labels: {
                            template: {
                                title: {
                                    en: "Population composition in selected country (by year)",
                                    fr: "Composition de la population dans le pays sélectionné (par anne)",
                                    es: "Composicin de la poblacin en el pas seleccionado (por año)"
                                },
                                subtitle: ""
                            }
                        },

                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: ['year'],
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['item', 'element']
                            },
                            template: {
                                // height: '200px'
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
                            domain_codes: ["OA"],
                            List2Codes: [
                                511,
                                551
                            ],
                            List3Codes: [3010],
                            List4Codes: [2000, 2005, 2010, 2015],
                            order_by: 'year'
                        }
                    },
                    {
                        type: 'chart',
                        class: "col-xs-12 col-md-6",

                        // labels?
                        labels: {
                            template: {
                                title: {
                                    en: "Rural and Urban Population",
                                    fr: "Rural and Urban Population",
                                    es: "Rural and Urban Population"
                                },
                                "subtitle": ""
                            }
                        },

                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "pie",
                                xDimensions: null,
                                yDimensions: null,
                                valueDimensions: 'value',
                                seriesDimensions: ['element', 'year']
                            },
                            template: {
                                //height: '200px'
                            },
                            creator: {}
                        },
                        allowedFilter: ['area', 'year', 'item', 'aggregation'],
                        filter: {
                            domain_codes: ["OA"],
                            List2Codes: [
                                551,
                                561
                            ],
                            List3Codes: [3010],
                            List4Codes: [2015]
                        }
                    },

                    // FORCE SPACING
                    {
                        type: 'custom',
                        class: 'clearfix',
                        config: {
                            template: {},
                            model: {}
                        }
                    },

                    // LAND
                    {
                        type: 'custom',
                        class: 'col-xs-12',
                        config: {
                            template: {
                                html: '<h2>Land</h2>'
                            },
                            model: {
                                "test": "test"
                            }
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
                                    en: "Composition of agricultural area {{area}}",
                                    fr: "Composition de la surface agricole {{area}}",
                                    es: "Composición del área agrícola {{area}}"
                                },
                                subtitle: "{{year}}"
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "timeserie",
                                xDimensions: 'year',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item']
                            },
                            template: {
                                // height: '100px'
                            },
                            creator: {
                                /* chartObj: {
                                 chart: {
                                 type: 'column'
                                 },
                                 plotOptions: {
                                 column: {
                                 stacking: 'normal'
                                 }
                                 }
                                 }*/
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            domain_codes: ['RL'],
                            List2Codes: [5110],
                            List3Codes: [
                                6621,
                                6650,
                                6655
                            ],
                            List4Codes: ['_1'],
                            "order_by": 'year'
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
                            domain_codes: ["RL"],
                            List2Codes: [5110],
                            List3Codes: [6621, 6650, 6655, 6661, 6670],
                            List4Codes: [2012],
                            //List4Codes: ['_1'],
                            order_by: 'year DESC, item ASC'
                            // limit: 5
                        }
                    },

                    // FORCE SPACING
                    {
                        type: 'custom',
                        class: 'clearfix',
                        config: {
                            template: {},
                            model: {}
                        }
                    },


                    {
                        type: 'table',
                        class: "col-xs-12 col-md-6",

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
                                }
                                //subtitle: "2012"
                            }
                        },

                        config: {
                            adapter: {
                                columns: ['item', 'year', 'value', 'unit'],
                                showCodes: false
                            },
                            template: {
                                tableOptions: {
                                    'data-search': false,
                                    'data-show-header': false
                                }
                                // height: '300'
                            }
                        },
                        allowedFilter: ['area', 'item', 'year', 'element', 'aggregation'],
                        deniedTemplateFilter: [],
                        filter: {
                            domain_codes: ["RL"],
                            List2Codes: [5110],
                            List3Codes: [6600, 6610, 6661],
                            List4Codes: [2012],
                            order_by: 'value DESC'
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
                                    fr: "Land Use",
                                    es: "Land Use"
                                },
                                subtitle: "2012"
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
                                // height: '100px'
                            },
                            creator: {
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            domain_codes: ['RL'],
                            List2Codes: [5110],
                            List3Codes: [6621, 6650, 6655, 6661, 6670],
                            List4Codes: ['_1'],
                            "order_by": 'year'
                        }
                    },


                    // Production
                    {
                        type: 'custom',
                        class: 'col-xs-12',
                        config: {
                            template: {
                                html: '<h2>{{production}}</h2>'
                            },
                            model: {
                                "production": "Production"
                            }
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
                                    en: "Most produced commodities",
                                    fr: "Most produced commodities",
                                    es: "Most produced commodities"
                                },
                                subtitle: "Average 1993-2013"
                            }
                        },

                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: ['element'],
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['item']
                            },
                            template: {
                                //height: '250px'
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: "column"
                                    }
                                }
                            }
                        },
                        allowedFilter: ['area'],
                        deniedTemplateFilter: [],
                        filter: {
                            domain_codes: ["QC"],
                            List2Codes: ["2510"],
                            // TODO: how to solve this problemi with the list?
                            List3Codes: ["1717>", "1804>", "1814>", "1714>", "1753>", "1801>", "1738>", "1737>", "1751>", "1841>", "1732>", "1726>", "1720>", "1734>", "1729>", "1735>", "1800>"],
                            List4Codes: [
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
                                2012,
                                2013
                            ],
                            "group_by": 'year',
                            "order_by": 'value DESC',
                            "limit": '10',
                            "operator": "avg"
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
                                //subtitle: "2003 - 2013"
                                subtitle: ""
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
                            domain_codes: ["QI"],
                            List2Codes: [
                                438],
                            List3Codes: [
                                1717,
                                2051,
                                2054,
                                2057],
                            /* List4Codes: [
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
                             ]*/
                            List4Codes: ['_1'],
                            order_by: 'year, item',
                            limit: -1
                        }
                    },


                    // Emissions
                    {
                        type: 'custom',
                        class: 'col-xs-12',
                        config: {
                            template: {
                                html: '<h2>{{emissions}}</h2>'
                            },
                            model: {
                                "emissions": "Emissions"
                            }
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
                                    en: "Emissions",
                                    fr: "Emissions",
                                    es: "Emissions"
                                },
                                subtitle: "1990 - 2012"
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "timeserie",
                                xDimensions: 'year',
                                yDimensions: null,
                                valueDimensions: 'value',
                                seriesDimensions: ['item', 'element']
                            },
                            template: {
                                // height:'350px'
                                // default labels to be applied
                            },
                            creator: {}
                        },
                        allowedFilter: ['area'],
                        filter: {
                            domain_codes: ["GL", "GT"],
                            List2Codes: [7231, 7217],
                            List3Codes: [1711, 1707],
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
                            "order_by": 'year',
                            "limit": '-1'
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
                            domain_codes: ["GT"],
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
                    }
                ]
            }

        },

        "land": {
        }
    }
});