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
                id: 'GV'
            },
            {
                title: i18n.projections,
                id: 'GV-PROJ',
                selected: true
            }
        ],

        "comment": {
            "text": {
                "en": "Emissions of nitrous oxide from cultivation of histosols",
                "fr": "Les émissions d'oxyde nitreux provenant des sols organiques drainés cultivés",
                "es": "Emisiones de óxido nitroso procedentes del drenaje de suelos orgánicos cultivados"
            }
            //,pdf: "GT.pdf"
        },

        "filter": {

            defaultFilter: {
                "domain_code": ["GV"],
                "show_lists": false
            },

            items: [
                {
                    "id": "item",
                    "type": "codelist",
                    // TODO: in theory that should come from the dimensions schema!!
                    "parameter": "item",
                    "componentType": {
                        "class": "col-md-3",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["6729"],
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
                    "parameter": "year",
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
                domain_code: ['GV'],
                element: ["7231"]
            },

            items: [
                {
                    type: 'map',
                    class: "col-xs-12",

                    // labels
                    labels: {
                        // labels to dynamically substitute the title and subtitle
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
                    allowedFilter: ['item', 'year', 'element'],
                    deniedTemplateFilter: [],
                    filter: {
                        area: ["5000>", "351"]
                        //"group_by": 'year',
                        //"order_by": 'area'
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-6",

                    // labels?
                    labels: {
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
                        area: ["5100", "5200", "5300", "5400", "5500"],
                        year: ["2030", "2050"]
                        // TODO: baseline 2005-2006-2007
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-6",

                    // labels?
                    labels: {
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
                        year: ["2030", "2050"]
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
                        area: ["5100", "5200", "5300", "5400", "5500"]
                    }
                }
            ]
        }

    };
});