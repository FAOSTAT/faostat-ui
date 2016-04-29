/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["EL"]
            },

            items: [
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "List4Codes",
                    "componentType": {
                        "class": "col-sm-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": ['1992'],
                        "filter": {
                            "show_lists": false
                        }
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                limit: -1,
                decimal_places: 0,
                thousand_separator: ",",
                "null_values": null,
                page_size: 0,
                page_number: 0
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
                //requestType: 'data' // data, rankings

            },

            metadata: {},

            items: [
                {
                    type: 'map',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // labels to dinamically substitute the title and subtitle
                        default: {
                            aggregation: {
                                "en": "Average",
                                "fr": "Moyenne",
                                "es": "Promedio"
                            }
                        },

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Arable land as % of agriculture area",
                                fr: "Terres arables en % de la superficie agricole",
                                es: "Tierras de cultivo en % del área agrícola"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    //height:'250px',
                    config: {
                        layer: {},
                        template: {}
                    },
                    allowedFilter: ['year', 'element', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        domain_codes: ['EL'],
                        List1Codes: ["5000>", "351"],
                        List2Codes: [7210],
                        List3Codes: [6621],
                        "group_by": 'year',
                        "order_by": 'area',
                        "operator": 'avg'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels
                    labels: {
                        // labels to dinamically substitute the title and subtitle
                        default: {
                            aggregation: {
                                "en": "Average",
                                "fr": "Moyenne",
                                "es": "Promedio"
                            }
                        },

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Nitrogen Fertilizers (N total nutrients) use on arable and permanent crop area (%)",
                                fr: "Les engrais d'azote (N total des nutriments) utilisent le domaine des cultures arables et cultures permanentes (%)",
                                es: "Abonos de nitrógeno (N total de nutrientes) utilizan en el área de los cultivos herbáceos y permanente (%)"
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
                            seriesDimensions: ['area']
                        },
                        template: {
                            height: '250px'
                        },
                        creator: {}
                    },
                    allowedFilter: ['year'],
                    deniedTemplateFilter: [],
                    filter: {
                        domain_codes: ['EF'],
                        List1Codes: ["5100", "5200", "5300", "5400", "5500"],
                        List2Codes: [5159],
                        List3Codes: [3102],
                        "group_by": 'year',
                        "order_by": 'area',
                        "operator": 'avg'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels
                    labels: {

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Trend of Cattle and Buffaloes as % of total livestock",
                                fr: "Tendance des bovins et de buffles en % du cheptel",
                                es: "Tendencia de bovinos y búfalos en % del total de ganado"
                            },
                            subtitle: "{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "timeserie",
                            xDimensions: "year",
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area']
                        },
                        template: {
                            height: '250px'
                        },
                        creator: {}
                    },
                    allowedFilter: ['year'],
                    deniedTemplateFilter: [],
                    filter: {
                        domain_codes: ['EK'],
                        List1Codes: ["5100", "5200", "5300", "5400", "5500"],
                        List2Codes: [7211],
                        List3Codes: [1746]
                    }
                }
            ]
        }

    }
});