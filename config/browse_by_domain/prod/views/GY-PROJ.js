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
                id: 'GY'
            },
            {
                title: i18n.projections,
                id: 'GY-PROJ',
                selected: true
            }
        ],

        "comment": {
            "text": {
                "en": "Emissions of methane produced in digestive systems of livestock",
                "fr": "Émissions de méthane produites dans les systèmes digestifs des animaux d'élevage",
                "es": "Emisiones de metano producidas en los sistemas digestivos de los animales"
            }
            //,pdf: "GT.pdf"
        },

        "filter": {

            defaultFilter: {
                "domain_code": ["GY"],
                "show_lists": false
            },

            items: [
                {
                    // id to be applied on the getData request
                    "id": "area",
                    "type": "codelist",
                    "parameter": "List1Codes",
                    "componentType": {
                        "class": "col-md-3",
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
                        "class": "col-md-2",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "yearproj",
                        "defaultCodes": ['2030'],
                        "filter": {
                        }
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_codes: ['GY'],
                List2Codes: ["7231"],
                List3Codes: ["3107"],
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
                        default: {
                            item: "Synthetic Nitrogen fertilizers"
                        },

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
                    class: "col-md-6",

                    // labels?
                    labels: {

                        default: {
                            item: "Synthetic Nitrogen fertilizers"
                        },

                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Emissions (CO2 equivalent), {{item}}",
                                fr: "Émissions (CO2 équivalent), {{item}}",
                                es: "Emisiones (CO2 equivalente), {{item}}"
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
                    filter: {
                        List1Codes: ["5100", "5200", "5300", "5400", "5500"],
                        List4Codes: ["2030", "2050"]
                        // TODO: baseline 2005-2006-2007
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-6",

                    // labels?
                    labels: {

                        default: {
                            item: "Synthetic Nitrogen fertilizers"
                        },

                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Emissions (CO2 equivalent), {{item}}, {{area}}",
                                fr: "Émissions (CO2 équivalent), {{item}}, {{area}}",
                                es: "Emisiones (CO2 equivalente), {{item}}, {{area}}"
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
                    allowedFilter: ['area', 'item'],
                    filter: {
                        List4Codes: ["2030", "2050"]
                        // TODO: baseline 2005-2006-2007
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {

                        default: {
                            item: "Synthetic Nitrogen fertilizers"
                        },

                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Emissions by continent (CO2 equivalent), {{item}}",
                                fr: "Émissions par continent (CO2 équivalent), {{item}}",
                                es: "Emisiones por continente (CO2 equivalente), {{item}}"
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
                }
            ]
        }

    };
});