/*global define*/
define([
    'jquery',
    'i18n!nls/browse_by_country'
], function ($, i18n) {

    'use strict';

    var defaultFilter =  {
        List5Codes: null,
        List6Codes: null,
        List7Codes: null,
        decimal_separator: ".",
        limit: -1,
        thousand_separator: ",",
        "null_values": null,
        page_size: 0,
        per_page: 0
    };

    return {

        population: {

            title: i18n.demographics,
            icon: 'O',
            description: {
                "en": "A combination of declining mortality rates, prolonged life expectancy and younger populations in regions with high fertility contributes to population growth in the world. While growth rates have been slowing since the late 1960s, the world's population has nevertheless doubled since then, to have 7 billion people. Population growth is generally highest where income levels are low. This is especially true in cities. Since 2008, there have been more people living in cities tha in rural areas."
            },

            dashboard: {

                //data base filter
                defaultFilter: defaultFilter,

                //bridge configuration
                bridge: {

                    type: "faostat"
                    //requestType: 'data' // data, rankings

                },

                items: [

                    // DEMOGRAPHICS pg.4
                    {
                        type: 'chart',
                        class: "col-xs-12 col-md-6",

                        // labels?
                        labels: {
                            template: {
                                title: {
                                    en: "Rural and urban population",
                                    fr: "",
                                    es: ""
                                },
                                subtitle: "1990 - 2015"
                            }
                        },

                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "timeserie",
                                xDimensions: ['year'],
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item', 'element']
                            },
                            template: {
                                height: '300px'
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: 'area'
                                    },
                                    plotOptions: {
                                        area: {
                                            stacking: 'normal'
                                        },
                                        series: {
                                            marker: {
                                                enabled: false
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        allowedFilter: ['area', 'year', 'item', 'aggregation'],
                        filter: {
                            domain_codes: ["OA"],
                            List2Codes: [
                                //511,
                                551,
                                561
                            ],
                            List3Codes: [3010],
                            List4Codes: [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015],
                            order_by: 'year',

                        }
                    },
                    {
                        type: 'chart',
                        class: "col-xs-12 col-md-6",

                        // labels?
                        labels: {
                            template: {
                                title: {
                                    en: "Rural and urban population",
                                    fr: "",
                                    es: ""
                                },
                                "subtitle": "2015"
                            }
                        },

                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "pie",
                                xDimensions: null,
                                yDimensions: ['unit'],
                                valueDimensions: 'value',
                                seriesDimensions: ['element', 'year']
                            },
                            template: {
                                height: '300px'
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
                            List4Codes: [2015],
                            "group_by": 'area',
                            "order_by": 'item',
                            "operator": "avg"
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
                    }
                ]
            }
        },

        inputs: {

            title: i18n.inputs,
            icon: 'R',
            description: {
                "en": "Adeguate access to inputs, including land, pesticides and fertilizers, is vital for agricultural production and growth. Throughout Asia and in parts of latin America, expanding seed and fertilizer use has been accompanied by investments in irrigation, rural roads, marketing infrastructure and finalncial services, paving the way of fynamic commercial input markets. In other regions, such as sub-Saharan Africa, the uptake of agricultural inputs is relatively low because it is often cheaper to expand cropland to have higher production."
            },

            dashboard: {

                //data base filter
                defaultFilter: defaultFilter,

                //bridge configuration
                bridge: {

                    type: "faostat"
                    //requestType: 'data' // data, rankings

                },

                items: [

                    {
                        type: 'chart',
                        class: "col-xs-12 col-md-6",

                        // labels?
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Fertilizers consumption in nutrients",
                                    fr: "Fertilizers consumption in nutrients",
                                    es: "Fertilizers consumption in nutrients"
                                },
                                subtitle: "2000 - 2012"
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item']
                            },
                            template: {
                                height: '300px'
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: 'area'
                                    },
                                    plotOptions: {
                                        area: {
                                            stacking: 'normal'
                                        },
                                        series: {
                                            marker: {
                                                enabled: false
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            domain_codes: ['RF'],
                            List2Codes: [5155],
                            List3Codes: [
                                3102,
                                3103,
                                3104
                            ],
                            List4Codes: [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012],
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
                                    en: "Fertilizers consumption in nutrients",
                                    fr: "Fertilizers consumption in nutrients",
                                    es: "Fertilizers consumption in nutrients",
                                },
                                subtitle: "2012"
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: 'area',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['item', 'element']
                            },
                            template: {
                                height: '300px'
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: 'column'
                                    },
                                    plotOptions: {
                                        column: {
                                            stacking: 'normal'
                                        }
                                    }
                                }
                            }
                        },
                        allowedFilter: ['year'],
                        filter: {
                            domain_codes: ['RF'],
                            List1Codes: [5100, 5200, 5300, 5400, 5500],
                            List2Codes: [5155],
                            List3Codes: [
                                3102,
                                3103,
                                3104
                            ],
                            List4Codes: [2012]
                        }
                    }
                ]
            }

        },

        undernourishment: {

            title: i18n.undernourishment,
            icon: 'D',

            dashboard: {

                //data base filter
                defaultFilter: defaultFilter,

                //bridge configuration
                bridge: {

                    type: "faostat"
                    //requestType: 'data' // data, rankings

                },

                items: [
                    {
                        type: 'chart',
                        class: "col-xs-12 col-md-6",

                        // labels?
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Number of people undernourished (millions) (3-year average)",
                                    fr: "Number of people undernourished (millions) (3-year average)",
                                    es: "Number of people undernourished (millions) (3-year average)",
                                },
                                subtitle: ""
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item']
                            },
                            template: {
                                height: '300px'
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_codes": ["FS"],
                            "List2Codes": [6120],
                            "List3Codes": [21001],
                            "List4Codes": ['_1'],
                            'order_by': 'year'
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
                                    en: "Prevalence of undernourishment (%) (3-year average)",
                                    fr: "Prevalence of undernourishment (%) (3-year average)",
                                    es: "Prevalence of undernourishment (%) (3-year average)",
                                },
                                subtitle: ""
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item']
                            },
                            template: {
                                height: '300px'
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_codes": ["FS"],
                            "List2Codes": [6120],
                            "List3Codes": [21004],
                            "List4Codes": ['_1'],
                            'order_by': 'year'
                        }
                    }

                ]

            }
        },

        food_availability: {

            title: i18n.food_availability,
            icon: 'D',

            dashboard: {

                //data base filter
                defaultFilter: defaultFilter,

                //bridge configuration
                bridge: {

                    type: "faostat"
                    //requestType: 'data' // data, rankings

                },

                items: [
                    {
                        type: 'chart',
                        class: "col-xs-12 col-md-6",

                        // labels?
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Average protein supply (g/capita/day) (3-year average)",
                                    fr: "Average protein supply (g/capita/day) (3-year average)",
                                    es: "Average protein supply (g/capita/day) (3-year average)",
                                },
                                subtitle: ""
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item']
                            },
                            template: {
                                height: '300px'
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_codes": ["FS"],
                            "List2Codes": [6120],
                            "List3Codes": [21013],
                            "List4Codes": ['_1'],
                            'order_by': 'year'
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
                                    en: "Average supply of protein of animal origin (g/capita/day) (3-year average)",
                                    fr: "Average supply of protein of animal origin (g/capita/day) (3-year average)",
                                    es: "Average supply of protein of animal origin (g/capita/day) (3-year average)",
                                },
                                subtitle: ""
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item']
                            },
                            template: {
                                height: '300px'
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_codes": ["FS"],
                            "List2Codes": [6120],
                            "List3Codes": [21014],
                            "List4Codes": ['_1'],
                            'order_by': 'year'
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
                        type: 'chart',
                        class: "col-xs-12 col-md-6",

                        // labels?
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Share of dietary energy supply derived from cereals, roots and tubers (%) (3-year average)",
                                    fr: "Share of dietary energy supply derived from cereals, roots and tubers (%) (3-year average)",
                                    es: "Share of dietary energy supply derived from cereals, roots and tubers (%) (3-year average)",
                                },
                                subtitle: ""
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item']
                            },
                            template: {
                                height: '300px'
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_codes": ["FS"],
                            "List2Codes": [6120],
                            "List3Codes": [21012],
                            "List4Codes": ['_1'],
                            'order_by': 'year'
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
                                    en: "Average dietary energy supply adequacy (%) (3-year average)",
                                    fr: "",
                                    es: ""
                                },
                                subtitle: ""
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item']
                            },
                            template: {
                                height: '300px'
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_codes": ["FS"],
                            "List2Codes": [6120],
                            "List3Codes": [21010],
                            "List4Codes": ['_1'],
                            'order_by': 'year'
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
                        type: 'chart',
                        class: "col-xs-12 col-md-6",

                        // labels?
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Average value of food production (constant I$ per person) (3-year average)",
                                    fr: "",
                                    es: ""
                                },
                                subtitle: ""
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item']
                            },
                            template: {
                                height: '300px'
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_codes": ["FS"],
                            "List2Codes": [6120],
                            "List3Codes": [21011],
                            "List4Codes": ['_1'],
                            'order_by': 'year'
                        }
                    }
                ]
            }
        },

        food_access: {

            title: i18n.food_access,
            icon: 'D',

            dashboard: {

                //data base filter
                defaultFilter: defaultFilter,

                //bridge configuration
                bridge: {

                    type: "faostat"
                    //requestType: 'data' // data, rankings

                },

                items: [

                    {
                        type: 'chart',
                        class: "col-xs-12 col-md-6",

                        // labels?
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Depth of the food deficit (kcal/capita/day) (3-year average)",
                                    fr: "",
                                    es: ""
                                },
                                subtitle: ""
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item']
                            },
                            template: {
                                height: '300px'
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_codes": ["FS"],
                            "List2Codes": [6120],
                            "List3Codes": [21023],
                            "List4Codes": ['_1'],
                            'order_by': 'year'
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
                                    en: "Domestic food price index (index)",
                                    fr: "Domestic food price index (index)",
                                    es: "Domestic food price index (index)",
                                },
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
                                seriesDimensions: ['area', 'item']
                            },
                            template: {
                                height: '300px'
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_codes": ["FS"],
                            "List2Codes": [6120],
                            "List3Codes": [21018],
                            "List4Codes": ['_1'],
                            'order_by': 'year'
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
                        type: 'chart',
                        class: "col-xs-12 col-md-6",

                        // labels?
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Gross domestic product per capita, PPP (constant 2011 international $)",
                                    fr: "Gross domestic product per capita, PPP (constant 2011 international $)",
                                    es: "Gross domestic product per capita, PPP (constant 2011 international $)",
                                },
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
                                seriesDimensions: ['area', 'item']
                            },
                            template: {
                                height: '300px'
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_codes": ["FS"],
                            "List2Codes": [6120],
                            "List3Codes": [22013],
                            "List4Codes": ['_1'],
                            'order_by': 'year'
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
                                    en: "Road density (per 100 square km of land area)",
                                    fr: "",
                                    es: ""
                                },
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
                                seriesDimensions: ['area', 'item']
                            },
                            template: {
                                height: '300px'
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_codes": ["FS"],
                            "List2Codes": [6120],
                            "List3Codes": [21017],
                            "List4Codes": ['_1'],
                            'order_by': 'year'
                        }
                    }

                ]
            }
        },

        food_utilization: {

            title: i18n.food_utilization,
            icon: 'D',

            dashboard: {

                //data base filter
                defaultFilter: defaultFilter,

                //bridge configuration
                bridge: {

                    type: "faostat"
                    //requestType: 'data' // data, rankings

                },

                items: [

                    {
                        type: 'chart',
                        class: "col-xs-12 col-md-6",

                        // labels?
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Percentage of children under 5 years of age who are underweight, stunted, affected by wasting (%)",
                                    fr: "",
                                    es: ""
                                },
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
                                seriesDimensions: ['area', 'item']
                            },
                            template: {
                                height: '300px'
                            },
                            creator: {
                                /*chartObj: {
                                 chart: {
                                 type: "column"
                                 }
                                 }*/
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_codes": ["FS"],
                            "List2Codes": [6120],
                            "List3Codes": [21025, 21026, 21027],
                            "List4Codes": ['_1'],
                            'order_by': 'year'
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
                                    en: "Access to improved water sources (%)",
                                    fr: "",
                                    es: ""
                                },
                                subtitle: ""
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item']
                            },
                            template: {
                                height: '300px'
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_codes": ["FS"],
                            "List2Codes": [6120],
                            "List3Codes": [21019],
                            "List4Codes": ['_1'],
                            'order_by': 'year'
                        }
                    }

                ]
            }
        },

        // pg.36
        land: {

            title: i18n.land,
            icon: 'R',

            dashboard: {

                //data base filter
                defaultFilter: defaultFilter,

                //bridge configuration
                bridge: {

                    type: "faostat"
                    //requestType: 'data' // data, rankings

                },

                items: [

                    /*{
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
                     height: '300px'
                     },
                     creator: {
                     chartObj: {
                     chart: {
                     // type: 'column',
                     type: 'bar',
                     // inverted: true
                     },
                     plotOptions: {
                     column: {
                     stacking: 'normal'

                     },
                     bar: {
                     stacking: 'normal'

                     },
                     area: {
                     stacking: 'normal'

                     },
                     series: {
                     marker: {
                     enabled: false
                     }
                     }
                     }
                     }
                     }
                     },
                     allowedFilter: ['area', 'year'],
                     filter: {
                     domain_codes: ['RL'],
                     List2Codes: [5110],
                     List3Codes: [6610, 6661, 6670],
                     List4Codes: ['_1'],
                     "order_by": 'year'
                     }
                     },
                     */
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
                                height: '300px'
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: 'area'
                                    },
                                    plotOptions: {
                                        area: {
                                            stacking: 'normal',

                                        },
                                        series: {
                                            marker: {
                                                enabled: false
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            domain_codes: ['RL'],
                            List2Codes: [5110],
                            List3Codes: [6610, 6661, 6670],
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
                                    en: "Agricultural Area",
                                    fr: "Agricultural Area",
                                    es: "Agricultural Area"
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
                                height: '300px'
                            },
                            creator: {
                                chartObj: {
                                    chart: {
                                        type: 'area'
                                    },
                                    plotOptions: {
                                        area: {
                                            stacking: 'normal'
                                        },
                                        series: {
                                            marker: {
                                                enabled: false
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            domain_codes: ['RL'],
                            List2Codes: [5110],
                            //List3Codes: [ 6610, 6661, 6670],
                            List3Codes: [6621, 6650, 6655],
                            List4Codes: ['_1'],
                            "order_by": 'year'
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

                    /*  {
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
                     },*/

                ]
            }
        },

        economic_and_political_stability: {

            title: i18n.economic_and_political_stability,
            icon: 'D',

            dashboard: {

                //data base filter
                defaultFilter: defaultFilter,

                //bridge configuration
                bridge: {

                    type: "faostat"
                    //requestType: 'data' // data, rankings

                },

                items: [

                    {
                        type: 'chart',
                        class: "col-xs-12 col-md-6",

                        // labels?
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Per capita food production variability (I$ per person constant 2004-06)",
                                    fr: "",
                                    es: ""
                                },
                                subtitle: ""
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item']
                            },
                            template: {

                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_codes": ["FS"],
                            "List2Codes": [6120],
                            "List3Codes": [21030],
                            "List4Codes": ['_1'],
                            'order_by': 'year'
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
                                    en: "Value of food imports over total merchandise exports (%) (3-year average)",
                                    fr: "",
                                    es: ""
                                },
                                subtitle: ""
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item']
                            },
                            template: {

                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_codes": ["FS"],
                            "List2Codes": [6120],
                            "List3Codes": [21033],
                            "List4Codes": ['_1'],
                            'order_by': 'year'
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
                        type: 'chart',
                        class: "col-xs-12 col-md-6",

                        // labels?
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Per capita food supply variability (kcal/capita/day)",
                                    fr: "",
                                    es: ""
                                },
                                subtitle: ""
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item']
                            },
                            template: {

                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_codes": ["FS"],
                            "List2Codes": [6120],
                            "List3Codes": [21031],
                            "List4Codes": ['_1'],
                            'order_by': 'year'
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
                                    en: "Political stability and absence of violence/terrorism (index)",
                                    fr: "",
                                    es: ""
                                },
                                subtitle: ""
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: 'year',
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item']
                            },
                            template: {

                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_codes": ["FS"],
                            "List2Codes": [6120],
                            "List3Codes": [21032],
                            "List4Codes": ['_1'],
                            'order_by': 'year'
                        }
                    }

                ]
            }
        },

        production: {

            title: i18n.production,
            icon: 'Q',

            dashboard: {

                //data base filter
                defaultFilter: defaultFilter,

                //bridge configuration
                bridge: {

                    type: "faostat"
                    //requestType: 'data' // data, rankings

                },

                items: [

                    {
                        type: 'chart',
                        class: "col-md-6",

                        //bridge configuration
                        bridge: {

                            type: "faostat",
                            requestType: 'rankings' // data, rankings

                        },

                        // labels
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Top 10 commodities production",
                                    fr: "Top 10 commodities production",
                                    es: "Top 10 commodities production"
                                },
                                subtitle: "2014"
                            }
                        },

                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "standard",
                                xDimensions: ['item'],
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'element']
                            },
                            template: {
                                height:'275px'
                                // default labels to be applied
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
                        deniedTemplateFilter: [],
                        filter: {
                            domain_codes: ['QA', 'QC', 'QD', 'QL', 'QP'],
                            List2Codes: ["5510"],
                            List3Codes: ["_1"],
                            List4Codes: [2014],
                            limit: "10",
                            "null_values": false,
                            filter_list: "1",
                            rank_type: 'DESC'
                        }
                    },


                    {
                        type: 'table',
                        class: "col-md-6",

                        //bridge configuration
                        bridge: {

                            type: "faostat",
                            requestType: 'rankings' // data, rankings

                        },

                        // labels
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Top 10 commodities production",
                                    fr: "Top 10 commodities production",
                                    es: "Top 10 commodities production"
                                },
                                subtitle: "2014"
                            }
                        },

                        config: {

                            adapter: {
                                columns: ['area', 'item', 'year', 'value', 'unit', 'flags'],
                                showCodes: false
                            },
                            template: {
                                tableOptions: {
                                    'data-search': false,
                                    'data-show-header': false
                                }
                            }
                        },
                        allowedFilter: ['area', 'year', 'item', 'aggregation'],
                        deniedTemplateFilter: [],
                        filter: {
                            domain_codes: ['QA', 'QC', 'QD', 'QL', 'QP'],
                            List2Codes: ["5510"],
                            List3Codes: ["_1"],
                            List4Codes: [2014],
                            limit: "10",
                            "null_values": false,
                            filter_list: "1",
                            rank_type: 'DESC'
                        }
                    },


                    {
                        type: 'chart',
                        class: "col-md-12",

                        //bridge configuration
                        bridge: {

                            type: "faostat"

                        },

                        // labels
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Cereals, total production",
                                    fr: "Cereals, total production",
                                    es: "Cereals, total production"
                                }
                            }
                        },

                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "timeserie",
                                xDimensions: ['year'],
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item', 'element']
                            },
                            template: {
                                height: '300px'
                                // default labels to be applied
                            },
                            creator: {
                                chartObj: {}
                            }
                        },
                        allowedFilter: ['area', 'year', 'item', 'aggregation'],
                        deniedTemplateFilter: [],
                        filter: {
                            domain_codes: ['QC'],
                            List2Codes: [
                                2312,
                                2413,
                                2510
                            ],
                            List3Codes: [1717],
                            List4Codes: ["_1"],
                            "null_values": false,
                            "order_by": 'year',
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
                     // height: '400px'
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
                     List4Codes: ['_1'],
                     order_by: 'year, item',
                     limit: -1
                     }
                     }*/

                ]
            }
        },

        emissions: {

            title: i18n.emissions,
            icon: 'G1',

            filter: {

                defaultFilter: {
                    "domain_code": ["GT"],
                    "show_lists": false
                },
                items: [
                    {
                        "id": "year",
                        "type": "codelist",
                        "parameter": "List4Codes",
                        "componentType": {
                            "class": "hidden",
                            "type": "dropDownList-timerange"
                        },
                        "config": {
                            "dimension_id": "years",
                            "defaultCodes": ['1990'],
                            "filter": {}
                        }
                    }
                ]
            },

            dashboard: {

                //data base filter
                defaultFilter: defaultFilter,

                //bridge configuration
                bridge: {

                    type: "faostat"
                    //requestType: 'data' // data, rankings

                },

                items: [

                    {
                        type: 'chart',
                        class: "col-xs-12 col-md-6",

                        // labels?
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Emissions (CO2 equivalent), Agriculture total + (Total)",
                                    fr: "Emissions (CO2 equivalent), Agriculture total + (Total)",
                                    es: "Emissions (CO2 equivalent), Agriculture total + (Total)"
                                },
                                subtitle: "{{year}}"
                            }
                        },
                        config: {
                            adapter: {
                                adapterType: 'faostat',
                                type: "timeserie",
                                xDimensions: ['year'],
                                yDimensions: 'unit',
                                valueDimensions: 'value',
                                seriesDimensions: ['area', 'item', 'element']
                            },
                            template: {
                                height: '300px'
                                // default labels to be applied
                            },
                            creator: {}
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            domain_codes: ["GT"],
                            List2Codes: [7231],
                            List3Codes: [1711],
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
                                    en: "Emissions by sector (CO2 equivalent)",
                                    fr: "Émissions par secteur (CO2 équivalent)",
                                    es: "Emissions por sector (CO2 equivalente)"
                                },
                                subtitle: "1990 - 2014"
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
                                height: '300px'
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
                                2012,
                                2013,
                                2014
                            ],
                            "group_by": 'year, area',
                            "order_by": 'item',
                            "operator": 'AVG',
                            "limit": '-1'
                        }
                    },

                ]
            }
        },

        /* a: {

         title: "",

         dashboard: {

         //data base filter
         defaultFilter: defaultFilter,

         //bridge configuration
         bridge: {

         type: "faostat"
         //requestType: 'data' // data, rankings

         },

         items: [

         // DIETARY ENERGY SUPPLY
         {
         type: 'custom',
         class: 'col-xs-12',
         config: {
         template: {
         html: '<h2>Dietary energy supply</h2>'
         },
         model: {}
         }
         },


         // CROP PRODUCTION
         {
         type: 'custom',
         class: 'col-xs-12',
         config: {
         template: {
         html: '<h2>Crop Production</h2>'
         },
         model: {}
         }
         }
         ]
         }
         }*/

    };
});