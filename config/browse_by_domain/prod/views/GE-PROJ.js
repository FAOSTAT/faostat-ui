/*global define*/

define(function () {

    'use strict';

    return {

        "relatedViews" : [
            {
                title: {
                    en: '1961-present',
                    es: 'Desde 1961 a la actualidad',
                    fr: 'De 1961 à nos jours'
                },
                id: 'G1',
                selected: true
            },
            {
                title: {
                    en: 'Projections',
                    es: 'Proyecciones',
                    fr: 'Projections'
                },
                id: 'G1-PROJ'
            }
        ],

        "comment": {
            "text": {
                "en": "Emissions of methane and nitrous oxide produced from agricultural activities",
                "es": "Emisiones de metano y óxido nitroso producido por las actividades agrícolas",
                "fr": "Émissions de méthane et d'oxyde nitreux provenant des activités agricoles"
            },
            //pdf: "GT.pdf"
        },

        "filter": {

            defaultFilter: {
                "domain_code": ["GT"]
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
                        "defaultCodes": ["1711"],
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
                    "type": "static",
                    "parameter": "List4Codes",
                    "componentType": {
                        "class": "col-lg-2",
                        "type": "dropDownList"
                    },
                    "config": {
                        "defaultCodes": ["2030"],
                        "data": [
                            // TODO: multilingual?
                            {"code": "2030", "label": "2030", "selected": true},
                            {"code": "2050", "label": "2050", "selected": false}
                        ]
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_codes: ['GT'],
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
                        },
                        template: {

                        }
                    },
                    allowedFilter: ['item', 'year', 'element'],
                    deniedTemplateFilter: [],
                    filter: {
                        // TODO: remove the List1Codes (in theory should be automatically detected from the domain dimensions/schema)
                        List1Codes: ["5000>", "351"]
                        //"group_by": 'year',
                        //"order_by": 'area'
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
                            subtitle: ""
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'area',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['year']
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
                    allowedFilter: ['item'],
                    deniedOnLoadFilter: [],
                    filter: {
                        List1Codes: ["5100", "5200", "5300", "5400", "5500"],
                        List4Codes: ["2030", "2050"]
                        // TODO: baseline 2005-2006-2007
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
                            type: "pie",
                            xDimensions: null,
                            yDimensions: null,
                            valueDimensions: 'value',
                            seriesDimensions: ['area']
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
                    allowedFilter: ['year', 'item'],
                    deniedOnLoadFilter: [],
                    filter: {
                        List1Codes: ["5100", "5200", "5300", "5400", "5500"]
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    labels: {
                        template: {
                            title: {
                                en: "Emissions by sector",
                                fr: "Émissions par secteur",
                                es: "Emissions por sector"
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
                        List3Codes: [5067,
                            5058,
                            5059,
                            5060,
                            5061,
                            5062,
                            5063,
                            5064,
                            5066,
                            //1709,
                            6759
                        ],
                        "order_by": 'item'
                    }
                }
            ]
        }

    }
});