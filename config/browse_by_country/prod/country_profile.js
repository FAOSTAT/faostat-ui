/*global define*/
define([
    'jquery',
    'config/browse_by_country/Config',
    'i18n!nls/browse_by_country'
], function ($, CM, i18n) {

    'use strict';

    var defaultFilter =  {};

    // TODO: Get the titles directly from the elements/item etc of the domain and not hardcoded in the config file
    return {

        population: {

            title: i18n.demographics,
            icon: 'icojam_O',
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
                                    fr: "Populations rurale et urbaine",
                                    es: "Poplación rural y urbana"
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
                                    fr: "Populations rurale et urbaine",
                                    es: "Poplación rural y urbana"
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
            icon: 'icojam_R',
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
                                    fr: "Consommation - Quantité en éleménts fertilisants",
                                    es: "Consumo de fertilizantes en nutrientes"
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
                                    fr: "Consommation - Quantité en éleménts fertilisants",
                                    es: "Consumo de fertilizantes en nutrientes"
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
            icon: 'icojam_D',

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
                                    fr: "Nombre de personnes sous-alimentées (millions) (moyenne sur 3 ans)",
                                    es: "Número de personas subnutridas (millones) (promedio de 3 años)"
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

                        // labels
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Prevalence of undernourishment (%) (3-year average)",
                                    fr: "Prévalence de la sous-alimentation (%) (moyenne sur 3 ans)",
                                    es: "Prevalencia de la subalimentación (%) (promedio de 3 años)"
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
            icon: 'icojam_D',

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
                                    fr: "Disponibilités protéiques moyennes (g/personne/jour) (moyenne sur 3 ans)",
                                    es: "Suministro medio de proteínas (g/persona/día) (promedio de 3 años)",
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
                                    fr: "Disponibilités protéines moyennes d’origine animale (g/personne/jour) (moyenne sur 3 ans)",
                                    es: "Suministro medio de proteínas de origina animal (g/persona/día) (promedio de 3 años)",
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
                                    fr: "Part des céréales, des racines et des tubercules dans les apports énergétiques alimentaires (%) (moyenne sur 3 ans)",
                                    es: "Proporción del suministro de energía alimentaria derivada de cereales, raíces y tubérculos (%) (promedio de 3 años)",
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
                                    fr: "Suffisance des apports énergétiques alimentaires moyens (%) (moyenne sur 3 ans)",
                                    es: "Suficiencia del suministro medio de energía alimentaria (%) (promedio de 3 años)"
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
                                    fr: "Valeur moyenne de la production alimentaire ($I constants par personne) (moyenne sur 3 ans)",
                                    es: "Valor medio de la producción de alimentos (I$ constante por persona) (promedio de 3 años)"
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
            icon: 'icojam_D',

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
                                    en: "Depth of the food deficit (kcal/capita/day) (3-year average)",
                                    fr: "Ampleur du déficit alimentaire (Kcal/personne/jour) (moyenne sur 3 ans)",
                                    es: "Alcance del déficit de alimentos (Kcal/persona/día) (promedio de 3 años)"
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

                        // labels
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Domestic food price index (index)",
                                    fr: "Indice national des prix des aliments (indice)",
                                    es: "Índice nacional de precios de los alimentos (índice)",
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

                        // labels
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Gross domestic product per capita, PPP (constant 2011 international $)",
                                    fr: "Produit intérieur brut par habitant, ($ PPA internationaux constants de 2011)",
                                    es: "Producto interno bruto per cápita, PPA ($ a precios internacionales constantes de 2011)",
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

                        // labels
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Road density (per 100 square km of land area)",
                                    fr: "Densité du réseau routier (pour 100 km carrés de surface totale du pays)",
                                    es: "Densidad de carreteras (por cada 100 km cuadrados de la superficie terrestre)"
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
            icon: 'icojam_D',

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
                                    fr: "Pourcentage des enfants de moins de 5 ans présentant un retard de croissance, émaciés, présentant une insuffisance pondérale (%)",
                                    es: "Porcentaje de niños menores de 5 años aquejados de retraso del crecimiento, de emaciación, de insuciencia ponderal (%)"
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
                                    fr: "Accès à des sources d'eau améliorées (%)",
                                    es: "Acceso a fuentes de agua mejoradas (%)"
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
            icon: 'icojam_R',

            filter: {
                defaultFilter: {
                    "domain_code": ["RL"],
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
                                    en: "Land Use",
                                    fr: "Utilisation des terres",
                                    es: "Uso de la tierra"
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
                                    fr: "Superficie agricole",
                                    es: "Superficie agrícola"
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
            icon: 'icojam_D',

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
                                    en: "Per capita food production variability (I$ per person constant 2004-06)",
                                    fr: "Variabilité de la production alimentaire par habitant ($I par personne constant 2004-06)",
                                    es: "Valor de las importaciones de alimentos respecto de las exportaciones totales de mercancías (%) (promedio de 3 años)"
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
                                    fr: "Valeur des importations alimentaires par rapport aux exportations totales de marchandises (%) (moyenne sur 3 ans)",
                                    es: "Valor de las importaciones de alimentos respecto de las exportaciones totales de mercancías (%) (promedio de 3 años)"
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

                        // labels
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Per capita food supply variability (kcal/capita/day)",
                                    fr: "Variabilité des disponibilités alimentaires par habitant (Kcal/personne/jour)",
                                    es: "Variabilidad del suministro de alimentos per cápita (kcal/persona/día)"
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

                        // labels
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Political stability and absence of violence/terrorism (index)",
                                    fr: "Stabilité politique et absence de violence/terrorisme (indice)",
                                    es: "Estabilidad política y ausencia de violencia o terrorismo (índice)"
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
            icon: 'icojam_Q',

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
                                    fr: "Céréales,Total Production",
                                    es: "Cereales,Total Producción"
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
            icon: 'icojam_G1',

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

                        // labels
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Emissions (CO2 equivalent), Agriculture total",
                                    fr: "Émissions (équivalent CO2), Agriculture total",
                                    es: "Emisiones (CO2 equivalente), Agricultura total"
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

                        // labels
                        labels: {
                            // template to be applied to the config.template for the custom object
                            template: {
                                title: {
                                    en: "Emissions by sector (CO2 equivalent)",
                                    fr: "Émissions par secteur (équivalent CO2)",
                                    es: "Emisiones por sector (CO2 equivalente)"
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
        },

        syb: {
            // TODO: Refactor it and make it decent.
            title: i18n.fao_statistical_yearbook_summary, // "FAO Statistical Yearbook Summary",
            href: CM.syb.url, //"http://fenixservices.fao.org/faostat/static/syb/syb_{{code}}.pdf",
            /*icon: 'icojam_book_3',
            show_details: true,
            details: {
                "en": "<embed style='border:1px solid #666; overflow: auto; width: 100%; height: 75vh;' src='config/browse_by_country/prod/syb/syb_{{code}}.pdf' type='application/pdf'></embed>",
            }*/
        },

        syb_world: {
            // TODO: Refactor it and make it decent.
            title:  i18n.fao_statistical_yearbook_summary_world, //"FAO Statistical Yearbook <br> World Summary",
            href: CM.syb.url_world //"http://fenixservices.fao.org/faostat/static/syb/syb_5000.pdf",
        },

       /* syb_africa: {
            // TODO: Refactor it and make it decent.
            title: "FAO Statistical Yearbook Africa Summary",
            href: "http://fenixservices.fao.org/faostat/static/syb/syb_5100.pdf",
        },

        syb_asia: {
            // TODO: Refactor it and make it decent.
            title: "FAO Statistical Yearbook Asia Summary",
            href: "http://fenixservices.fao.org/faostat/static/syb/syb_5300.pdf",
        },

        syb_carribean: {
            // TODO: Refactor it and make it decent.
            title: "FAO Statistical Yearbook Latin America and the Caribbean Summary",
            href: "http://fenixservices.fao.org/faostat/static/syb/syb_5305.pdf",
        },

        syb_oceania: {
            // TODO: Refactor it and make it decent.
            title: "FAO Statistical Yearbook Oceania Summary",
            href: "http://fenixservices.fao.org/faostat/static/syb/syb_5500.pdf",
        }*/

    };
});