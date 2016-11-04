/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    var i18n = C.i18n || {};

    return {

        "relatedViews" : [
            {
                title: i18n.em_total_ghg,
                id: 'EM'
            },
            {
                title: i18n.em_co2,
                id: 'EM-CO2'
            },
            {
                title: i18n.em_n2o,
                id: 'EM-N2O'
            },
            {
                title: i18n.em_ch4,
                id: 'EM-CH4',
                selected: true
            }
        ],

        "comment": {
            "text": {
                "en": "Shares of emissions from Agriculture total and Land Use sources in the total emissions of greenhouse gases, and shares of each gas in the emissions of these sectors.",
                "es": "Cuota de las emisiones de Agricultura total y de Fuentes Uso de la tierra en el total de emisiones de gases de efecto invernadero, y cuota de cada gas en las emisiones de dichos sectores.",
                "fr": "Parts des secteurs Agriculture total et Sources Utilisation des terres dans les émissions totales de gaz à effet de serre, et parts de chaque gaz dans les émissions provenant de ces secteurs."
            }
        },

        "filter": {

            defaultFilter: {
                "domain_code": ["EM"],
                "show_lists": false
            },

            items: [
                {
                    // id to be applied on the getData request
                    "id": "item",
                    "type": "codelist",
                    "parameter": "item",
                    "title": {
                        "en": "Sector",
                        "fr": "Sector",
                        "es": "Sector",
                    },
                    "componentType": {
                        "class": "col-xs-4 col-sx-4 col-md-4",
                        "type": "dropDownList"
                        //"multiple": true
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["1711"],
                        "filter": {
                            whitelist: [1711, 6822]
                        }
                    }
                },
                {
                    // id to be applied on the getData request
                    "id": "area",
                    "type": "codelist",
                    "parameter": "area",
                    "componentType": {
                        "class": "col-xs-4 col-sx-4 col-md-4",
                        "type": "dropDownList"
                        //"multiple": true
                    },
                    "config": {
                        "dimension_id": "area",
                        "defaultCodes": ["5000"],
                        "filter": {}
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "year",
                    "componentType": {
                        "class": "col-xs-4 col-sx-4 col-md-2",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "year",
                        "filter": {}
                    }
                },
                {
                    "id": "yearTimeserie",
                    "type": "codelist",
                    "parameter": "year",
                    "componentType": {
                        "class": "hidden",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "filter": {}
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_code: ['EM'],
                element: [7265]
            },

            items: [
                {
                    type: 'map',
                    class: "col-md-12",

                    // labels
                    labels: {
                        // labels to dinamically substitute the title and subtitle
                        default: {},

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Shares by country of sector {{item}} in CH<sub>4</sub> emissions",
                                fr: "Parts par pays du secteur {{item}} dans les émissions de CH<sub>4</sub>",
                                es: "Cuotas por país del sector {{item}} en las emisiones de CH<sub>4</sub>"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },
                    config: {
                        template: {}
                    },
                    allowedFilter: ['item', 'year'],
                    deniedTemplateFilter: [],
                    filter: {
                        area: ["5000>", "351"]
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-12",

                    // labels
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Shares of agricultural sectors in CH<sub>4</sub> emissions",
                                fr: "Parts des secteurs agricoles dans les émissions de CH<sub>4</sub>",
                                es: "Cuotas de los sectores agrícolas en las emisiones de CH<sub>4</sub>"
                            },
                            subtitle: "{{area}}, {{yearTimeserie}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "timeserie",
                            xDimensions: 'year',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area', 'item', 'element'],
                            decimalPlaces: 2
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['area', 'yearTimeserie', 'element'],
                    filter: {
                        item: ["1711", "6822"]
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-12",

                    labels: {
                        template: {
                            title: {
                                en: "Share of each sector in CH<sub>4</sub> emissions",
                                fr: "Part de chaque secteur dans les émissions de CH<sub>4</sub>",
                                es: "Cuota de cada sector en las emisiones de CH<sub>4</sub>"
                            },
                            subtitle: "{{area}}, {{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }

                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "pie",
                            xDimensions: null,
                            yDimensions: null,
                            valueDimensions: 'value',
                            seriesDimensions: ['item'],
                            decimalPlaces: 2
                        },
                        template: {
                            height: '300px'
                        },
                        creator: {}
                    },
                    allowedFilter: ['area', 'year'],
                    filter: {
                        item: [
                            68140,
                            68160,
                            6815,
                            6816,
                            6817,
                            6818,
                            6819,
                            6820,
                            1711,
                            6822
                        ]
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-12",

                    labels: {
                        template: {
                            title: {
                                en: "Share of each gas in sector {{item}} emissions",
                                fr: "Part de chaque gaz dans les émissions du {{item}}",
                                es: "Cuota de cada gas en las emisiones de {{item}}"
                            },
                            subtitle: "{{area}}, {{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }

                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "pie",
                            xDimensions: null,
                            yDimensions: null,
                            valueDimensions: 'value',
                            seriesDimensions: ['element', 'item'],
                            decimalPlaces: 2
                        },
                        template: {
                            height: '250px'
                        },
                        creator: {}
                    },
                    allowedFilter: ['area', 'year', 'item'],
                    filter: {
                        element: [7267, 7268, 7269]
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Top 10 areas by share of sector {{item}} in CH<sub>4</sub> emissions",
                                fr: "Les 10 pays principaux par part du secteur {{item}} dans les émissions de CH<sub>4</sub>",
                                es: "Los 10 países principales según la cuota del sector {{item}} en las emisiones de CH<sub>4</sub>"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: ['area'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['item', 'element'],
                            decimalPlaces: 2
                        },
                        template: {
                            //height:'250px'
                            // default labels to be applied
                        },
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                },
                                plotOptions: {
                                    column: {
                                        dataLabels: {
                                            enabled: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    allowedFilter: ['year', 'item'],
                    deniedTemplateFilter: [],
                    filter: {
                        area: ["5000>"],
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                }
            ]
        }

    };
});