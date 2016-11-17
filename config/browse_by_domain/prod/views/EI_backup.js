/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    var i18n = C.i18n || {};

    return {

        "relatedViews" : [
            {
                title: "View Annex1",
                id: 'EI',
                selected: true
            },
            {
                title: "View OECD",
                id: 'EI_oecd'
            }
        ],

        "comment": {
            "text": {
                "en": "Emissions intensity by country of selected agricultural and animal products",
                "fr": "Intensité des émissions par pays de quelques produits agricoles et d'origine animale",
                "es": "Intensidad de emisiones por país de unos productos agrícolas y animales.",
            }
        },

        "filter": {

            defaultFilter: {
                "domain_code": ["EI"],
                "show_lists": false
            },

            items: [
                {
                    // id to be applied on the getData request
                    "id": "area",
                    "type": "codelist",
                    "parameter": "area",
                    "componentType": {
                        "class": "col-md-12",
                        "type": "dropDownList",
                        "multiple": true
                    },
                    "config": {
                        "dimension_id": "area",
                        "defaultCodes": ["5000", "5848", "5849"],
                        "filter": {}
                    }
                },
                {
                    // id to be applied on the getData request
                    "id": "item",
                    "type": "codelist",
                    "parameter": "item",
                    "componentType": {
                        "class": "col-xs-4 col-sx-4 col-md-4",
                        "type": "dropDownList"
                        //"multiple": true
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["1717"],
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
                domain_code: ['EI'],
                element: ["7176"]
            },

            items: [
                {
                    type: 'map',
                    class: "col-md-12",

                    // labels
                    labels: {

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Emissions intensity by country of {{item}}",
                                fr: "Intensité des émissions par pays du {{item}}",
                                es: "Intensidad de emisiones por país de {{item}}"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },
                    config: {
                        template: {}
                    },
                    allowedFilter: ['item', 'year', 'element'],
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
                                en: "Emissions intensity (in kg of CO2 equivalent per kg of {{item}})",
                                fr: "Intensité des émissions (en kg de CO2 équivalent par kg de {{item}})",
                                es: "Intensidad de emisiones (en kg de CO2 equivalente por kg de {{item}})"
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
                            seriesDimensions: ['area', 'item', 'element'],
                            decimalPlaces: 2
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['area', 'yearTimeserie', 'item', 'element'],
                    filter: {}
                },
                {
                    type: 'chart',
                    class: "col-md-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "The 10 areas with lowest emissions intensity, {{item}}",
                                fr: "Les 10 pays avec plus faible intensité des émissions, {{item}}",
                                es: "Los 10 países con menor intensidad de emisiones, {{item}}"
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
                        template: {},
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                }
                            }
                        }
                    },
                    allowedFilter: ['year', 'item', 'element'],
                    deniedTemplateFilter: [],
                    filter: {
                        area: ["5000>"],
                        "order_by": 'value ASC',
                        "limit": '10'
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
                                en: "The 10 areas with highest emissions intensity, {{item}}",
                                fr: "Les 10 pays avec majeure intensité des émissions, {{item}}",
                                es: "Los 10 países con mayor intensidad de emisiones, {{item}}"
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
                        template: {},
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                }
                            }
                        }
                    },
                    allowedFilter: ['year', 'item', 'element'],
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