/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    var i18n = C.i18n || {};

    return {

        "relatedViews" : [
            {
                title: i18n.tab_ghg_main,
                id: 'GP',
                selected: true
            },
            {
                title: i18n.projections,
                id: 'GP-PROJ'
            }
        ],

        "comment": {
            "text": {
                "en": "Emissions of nitrous oxide from manure left by grazing livestock on agricultural soils",
                "fr": "Émissions de oxyde nitreux provenant du fumier laissé par le pâturage du bétail sur les sols agricoles",
                "es": "Emisiones de óxido nitroso procedentes del estiércol dejado por el ganado en terrenos agrícolas"
            }
            //,pdf: "GT.pdf"
        },

        "filter": {

            defaultFilter: {
                "domain_code": ["GP"],
                "show_lists": false
            },

            items: [
                {
                    "id": "item",
                    "type": "codelist",
                    // TODO: in theory that should come from the dimensions schema!!
                    "parameter": "item",
                    //"title": "title",
                    "componentType": {
                        "class": "col-lg-3",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["1755"],
                        "filter": {
                        }
                    }
                },
                {
                    // id to be applied on the getData request
                    "id": "area",
                    "type": "codelist",
                    "parameter": "area",
                    "componentType": {
                        "class": "col-lg-3",
                        "type": "dropDownList"
                        //"multiple": true
                    },
                    "config": {
                        "dimension_id": "area",
                        "defaultCodes": ["5000"],
                        "filter": {
                        }
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "year",
                    "componentType": {
                        "class": "col-lg-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "years",
                        "defaultCodes": ['1990'],
                        "filter": {
                        }
                    }
                },
                C.filter.aggregation
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_code: ['GP'],
                element: ["7231"],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                limit: -1,
                decimal_places: 2,
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

                type: "faostat"
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
                        default: {},

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Emissions by country (CO2 equivalent), {{item}}",
                                fr: "Émissions par pays (CO2 équivalent), {{item}}",
                                es: "Emisiones por país (CO2 equivalente), {{item}}"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    //height:'250px',
                    config: {
                        layer: {
                            colorramp: "YlOrRd",
                            intervals: 7
                        },
                        template: {

                        }
                    },
                    allowedFilter: ['item', 'year', 'element', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        // TODO: remove the area (in theory should be automatically detected from the domain dimensions/schema)
                        area: ["5000>", "351"],
                        "group_by": 'year',
                        "order_by": 'area'
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
                                en: "Emissions (CO2 equivalent), {{item}}",
                                fr: "Émissions (CO2 équivalent), {{item}}",
                                es: "Emisiones (CO2 equivalente), {{item}}"
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
                            seriesDimensions: ['area', 'item', 'element']
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['area', 'year', 'item'],
                    deniedOnLoadFilter: ['area'],
                    filter: {
                        area: ["5000", "5848", "5849"]
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    labels: {
                        template: {
                            title: {
                                en: "Emissions by continent, {{item}}",
                                fr: "Émissions par continent, {{item}}",
                                es: "Emisiones por continente, {{item}}"
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
                    allowedFilter: ['year', 'item', 'aggregation'],
                    filter: {
                        // TODO: remove the area (in theory should be automatically detected from the domain dimensions/schema)
                        area: ["5100", "5200", "5300", "5400", "5500"],
                        "group_by": 'year',
                        "order_by": 'area'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    labels: {
                        template: {
                            title: {
                                en: "Emissions by animal type (CO2 equivalent), {{area}}",
                                fr: "Émissions par type d'animal (CO2 équivalent), {{area}}",
                                es: "Emissions  por tipo de animal (CO2 equivalente), {{area}}"
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
                            height: '250px'
                        },
                        creator: {
                           /* chartObj: {
                                legend: {
                                    layout: 'vertical',
                                    align: 'right',
                                    verticalAlign: 'middle',
                                }
                            }*/
                        }
                    },
                    allowedFilter: ['area', 'year', 'aggregation'],
                    filter: {
                        //item: [1757, 1759, 1749, 1048],
                        item: ["1755>"],
                        "group_by": 'year',
                        "order_by": 'item'
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
                                en: "Top 10 emitters (CO2 equivalent), {{item}}",
                                fr: "10 émetteurs principaux (CO2 équivalent), {{item}}",
                                es: "Los 10 emisores principales (CO2 equivalente), {{item}}"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: ['element'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area']
                        },
                        template: {
                            height:'250px'
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
                    allowedFilter: ['year', 'item', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        area: ["5000>"],
                        "group_by": 'year',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                }
            ]
        }

    };
});