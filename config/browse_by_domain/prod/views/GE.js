/*global define*/

define(function () {

    'use strict';

    return {

/*        "relatedViews" : [
            {
                title: {
                    en: '1961-present',
                    es: 'Desde 1961 a la actualidad',
                    fr: 'De 1961 à nos jours'
                },
                id: 'GE',
                selected: true
            },
            {
                title: {
                    en: 'Projections',
                    es: 'Proyecciones',
                    fr: 'Projections'
                },
                id: 'GE-PROJ'
            }
        ],*/

        "comment": {
            "text": {
              "en": "Emissions of methane produced in digestive systems of livestock",
              "es": "Emisiones de metano producidas en los sistemas digestivos de los animales",
              "fr": "Émissions de méthane produites dans les systèmes digestifs des animaux d'élevage"
            },
            //pdf: "GT.pdf"
        },

        "filter": {

            defaultFilter: {
                "domain_code": ["GE"]
            },

            items: [
                {
                    "id": "item",
                    "type": "codelist",
                    // TODO: in theory that should come from the dimensions schema!!
                    "parameter": "List3Codes",
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
                    "parameter": "List1Codes",
                    "componentType": {
                        <!-- TODO: add a class instead of bootstrap -->
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
                    "parameter": "List4Codes",
                    "componentType": {
                        "class": "col-lg-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": ['1992'],
                        "filter": {
                        }
                    }
                },
                {
                    "id": "aggregation",
                    "type": "static",
                    // TODO: check data parameter
                    "parameter": "operator",
                    "componentType": {
                        "class": "col-lg-2",
                        "type": "dropDownList"
                    },
                    "config": {
                        "defaultCodes": ["AVG"],
                        "data": [
                            // TODO: multilingual?
                            {"code": "AVG", "label": "average", "selected": true},
                            {"code": "SUM", "label": "sum", "selected": false}
                        ]
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_code: 'GE',
                List2Codes: ["7231"],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                limit: -1,
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
                requestType: 'data' // data, rankings

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
                                en: "Emissions by country (CO2 equivalent)",
                                fr: "Émissions par pays (CO2 équivalent)",
                                es: "Emisiones por país (CO2 equivalente)"
                            },
                            subtitle: "{{aggregation}} {{year}}"
                        }
                    },


                    //height:'250px',
                    config: {
                        layer: {
                            colorramp: "YlOrRd",
                            intervals: 7
                            //classificationtype: "percentiles"
                            //colors: ['#004529', '#238B45', '#74C476', '#E1E1E1', '#74C476', '#FFD34A', '#FF9400', '#DE0000'],
                            //ranges: [-20000,-10000,-1,0, 1,10000,100000],
                            //classification: "custom"

                            //colors: "004529,238B45,74C476,E1E1E1,FFD34A,FF9400,DE0000",
                            //ranges: "-20000,-10000,-1,1,10000,100000"
                            // intervals: 3,
                        },
                        template: {

                        }
                    },
                    allowedFilter: ['item', 'year', 'element', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        // TODO: remove the List1Codes (in theory should be automatically detected from the domain dimensions/schema)
                        List1Codes: ["5000>", "351"],
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
                                en: "Emissions (CO2 equivalent)",
                                fr: "Émissions (CO2 équivalent)",
                                es: "Emisiones (CO2 equivalente)"
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
                        List1Codes: ["5000", "5848", "5849"]
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    labels: {
                        template: {
                            title: {
                                en: "Emissions by continent",
                                fr: "Émissions par continent",
                                es: "Emisiones por continente"
                            },
                            subtitle: "{{aggregation}} {{year}}"
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
                        // TODO: remove the List1Codes (in theory should be automatically detected from the domain dimensions/schema)
                        List1Codes: ["5100", "5200", "5300", "5400", "5500"],
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
                                en: "Emissions by animal type",
                                fr: "Émissions par type d'animal",
                                es: "Emisiones por tipo de animal"
                            },
                            subtitle: "{{aggregation}} {{year}}"
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
                        creator: {}
                    },
                    allowedFilter: ['area', 'year', 'aggregation'],
                    filter: {
                        List3Codes: ["1755>"],
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
                                en: "Top 10 emitters (CO2 equivalent)",
                                fr: "Principaux 10 émetteurs (CO2 équivalent)",
                                es: "Principales 10 emisores (CO2 equivalente)"
                            },
                            subtitle: "{{aggregation}} {{year}}"
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
                        List1Codes: ["5000>"],
                        "group_by": 'year',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                }
            ]
        }

    }
});