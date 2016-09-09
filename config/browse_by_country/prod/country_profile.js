/*global define*/
define([
    'jquery',
    'i18n!nls/browse_by_country'
], function ($, i18n) {

    'use strict';

    var defaultFilter =  {};

    return {

        population: {

            title: i18n.demographics,
            icon: 'O',
            description: {
                "en": "A combination of declining mortality rates, prolonged life expectancy and younger populations in regions with high fertility contributes to population growth in the world. While growth rates have been slowing since the late 1960s, the world's population has nevertheless doubled since then, to have 7 billion people. Population growth is generally highest where income levels are low. This is especially true in cities. Since 2008, there have been more people living in cities tha in rural areas."
            },

            filter: {
                defaultFilter: {
                    "domain_code": ["OA"],
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
                            "defaultCodes": ['1990'],
                            "filter": {}
                        }
                    },
                    {
                        "id": "yearLatest",
                        "type": "codelist",
                        "parameter": "year",
                        "componentType": {
                            "class": "hidden",
                            "type": "dropDownList"
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
                                subtitle: "{{yearTimeserie}}"
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
                        allowedFilter: ['area', 'yearTimeserie', 'item', 'aggregation'],
                        filter: {
                            domain_code: "OA",
                            element: [
                                //511,
                                551,
                                561
                            ],
                            item: [3010],
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
                                    en: "Rural and urban population",
                                    fr: "",
                                    es: ""
                                },
                                "subtitle": "{{yearLatest}}"
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
                        allowedFilter: ['area', 'yearLatest', 'item', 'aggregation'],
                        filter: {
                            domain_code: "OA",
                            element: [
                                551,
                                561
                            ],
                            item: [3010],
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
                    },
                    {
                        "id": "yearLatest",
                        "type": "codelist",
                        "parameter": "year",
                        "componentType": {
                            "class": "hidden",
                            "type": "dropDownList"
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
                                subtitle: "{{yearTimeserie}}"
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
                        allowedFilter: ['area', 'yearTimeserie'],
                        filter: {                            
                            domain_code: 'RF',
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
                                subtitle: "{{yearLatest}}"
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
                        allowedFilter: ['yearLatest'],
                        filter: {
                            domain_code: 'RF',
                            area: [5100, 5200, 5300, 5400, 5500],
                            element: [5155],
                            item: [
                                3102,
                                3103,
                                3104
                            ]
                        }
                    }
                ]
            }

        },

        undernourishment: {

            title: i18n.undernourishment,
            icon: 'D',

            filter: {
                defaultFilter: {
                    "domain_code": ["FS"],
                    "show_lists": false
                },
                items: [
                    {
                        "id": "year",
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

                        // labels
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Number of people undernourished (millions) (3-year average)",
                                    fr: "Number of people undernourished (millions) (3-year average)",
                                    es: "Number of people undernourished (millions) (3-year average)"
                                },
                                subtitle: "{{year}}"
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
                            "domain_code": "FS",
                            "element": [6120],
                            "item": [21001],
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
                                    es: "Prevalence of undernourishment (%) (3-year average)"
                                },
                                subtitle: "{{year}}"
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
                            "domain_code": "FS",
                            "element": [6120],
                            "item": [21004],
                            'order_by': 'year'
                        }
                    }

                ]

            }
        },

        food_availability: {

            title: i18n.food_availability,
            icon: 'D',

            filter: {
                defaultFilter: {
                    "domain_code": ["FS"],
                    "show_lists": false
                },
                items: [
                    {
                        "id": "year",
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

                        // labels
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Average protein supply (g/capita/day) (3-year average)",
                                    fr: "Average protein supply (g/capita/day) (3-year average)",
                                    es: "Average protein supply (g/capita/day) (3-year average)",
                                },
                                subtitle: "{{year}}"
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
                            "domain_code": "FS",
                            "element": [6120],
                            "item": [21013],
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
                                subtitle: "{{year}}"
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
                            "domain_code": "FS",
                            "element": [6120],
                            "item": [21014],
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
                                subtitle: "{{year}}"
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
                            "domain_code": "FS",
                            "element": [6120],
                            "item": [21012],
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
                                subtitle: "{{year}}"
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
                            "domain_code": "FS",
                            "element": [6120],
                            "item": [21010],
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
                                subtitle: "{{year}}"
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
                            "domain_code": "FS",
                            "element": [6120],
                            "item": [21011],
                            'order_by': 'year'
                        }
                    }
                ]
            }
        },

        food_access: {

            title: i18n.food_access,
            icon: 'D',

            filter: {
                defaultFilter: {
                    "domain_code": ["FS"],
                    "show_lists": false
                },
                items: [
                    {
                        "id": "year",
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
                                subtitle: "{{year}}"
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
                            "domain_code": "FS",
                            "element": [6120],
                            "item": [21023],
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
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_code": "FS",
                            "element": [6120],
                            "item": [21018],
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
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_code": "FS",
                            "element": [6120],
                            "item": [22013],
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
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_code": "FS",
                            "element": [6120],
                            "item": [21017],
                            'order_by': 'year'
                        }
                    }

                ]
            }
        },

        food_utilization: {

            title: i18n.food_utilization,
            icon: 'D',

            filter: {
                defaultFilter: {
                    "domain_code": ["FS"],
                    "show_lists": false
                },
                items: [
                    {
                        "id": "year",
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
                                /*chartObj: {
                                 chart: {
                                 type: "column"
                                 }
                                 }*/
                            }
                        },
                        allowedFilter: ['area', 'year'],
                        filter: {
                            "domain_code": "FS",
                            "element": [6120],
                            "item": [21025, 21026, 21027],
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
                                subtitle: "{{year}}"
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
                            "domain_code": "FS",
                            "element": [6120],
                            "item": [21019],
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

            filter: {
                defaultFilter: {
                    "domain_code": ["RF"],
                    "show_lists": false
                },
                items: [
                    {
                        "id": "year",
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
                            domain_code: 'RL',
                            element: [5110],
                            item: [6610, 6661, 6670],
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
                            domain_code: 'RL',
                            element: [5110],
                            item: [6621, 6650, 6655],
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
                    }
                ]
            }
        },

        economic_and_political_stability: {

            title: i18n.economic_and_political_stability,
            icon: 'D',

            filter: {
                defaultFilter: {
                    "domain_code": ["FS"],
                    "show_lists": false
                },
                items: [
                    {
                        "id": "year",
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
                            "domain_code": "FS",
                            "element": [6120],
                            "item": [21030],
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
                                subtitle: "{{year}}"
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
                            "domain_code": "FS",
                            "element": [6120],
                            "item": [21033],
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
                                subtitle: "{{year}}"
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
                            "domain_code": "FS",
                            "element": [6120],
                            "item": [21031],
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
                                subtitle: "{{year}}"
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
                            "domain_code": "FS",
                            "element": [6120],
                            "item": [21032],
                            'order_by': 'year'
                        }
                    }

                ]
            }
        },

        production: {

            title: i18n.production,
            icon: 'Q',

            filter: {
                defaultFilter: {
                    "domain_code": ["QC"],
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
                    },
                    {
                        "id": "yearLatest",
                        "type": "codelist",
                        "parameter": "year",
                        "componentType": {
                            "class": "hidden",
                            "type": "dropDownList"
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
                                },
                                subtitle: "{{yearTimeserie}}"
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
                        allowedFilter: ['area', 'yearTimeserie', 'item'],
                        deniedTemplateFilter: [],
                        filter: {
                            domain_code: 'QC',
                            element: [
                                2312,
                                2413,
                                2510
                            ],
                            item: [1717],
                            "null_values": false,
                            "order_by": 'year'
                        }
                    }
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
                        "parameter": "year",
                        "componentType": {
                            "class": "hidden",
                            "type": "dropDownList-timerange"
                        },
                        "config": {
                            "dimension_id": "years",
                            "defaultCodes": ['1990'],
                            "filter": {}
                        }
                    },
                    {
                        "id": "aggregation",
                        "type": "static",
                        "parameter": "operator",
                        "componentType": {
                            "class": "hidden"
                        },
                        "config": {
                            "defaultCodes": ["AVG"],
                            "data": [
                                {"code": "AVG", "label": i18n.average}
                            ]
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
                            domain_code: "GT",
                            element: [7231],
                            item: [1711],
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
                                subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
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
                        allowedFilter: ['area', 'year', 'item', 'aggregation'],
                        filter: {
                            domain_code: "GT",
                            element: [7231],
                            item: [5058,  5059, 5060, 5061, 5062, 5063, 5064, 5066, 5067, 6759],
                            "group_by": 'year, area',
                            "order_by": 'item',
                            "limit": '-1'
                        }
                    }

                ]
            }
        }

    };
});