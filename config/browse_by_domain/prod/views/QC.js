/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        filter: {

            defaultFilter: {
                "domain_code": ["QC"],
                // this force all the filters to avoid the "lists" codes
                "show_lists": false
            },

            items: [
                {
                    // id to be applied on the getData request
                    "id": "item",
                    "type": "codelist",
                    "parameter": "item",
                    //"title": "title",
                    "componentType": {
                        "class": "col-xs-6 col-sm-6 col-md-3",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "items",
                        "defaultCodes": ["27"],
                        "filter": {}
                    }
                },
                {
                    "id": "area",
                    "type": "codelist",
                    "parameter": "area",
                    "componentType": {
                        "class": "col-xs-6 col-sm-6 col-md-3",
                        "type": "dropDownList",
                        "multiple": false
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
                        "class": "col-xs-4 col-sm-4 col-md-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": ['1994'],
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
                domain_code: ['QC'],
                element: ["2510"]
            },

            // labels
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
                    class: "col-md-12",

                    // labels
                    labels: {
                        // labels to dynamically substitute the title and subtitle
                        default: {},

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Production quantities of {{item}} by country",
                                fr: "Quantités de production de {{item}} par pays",
                                es: "Cantidades de producción de {{item}} por país"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },
                    config: {
                        template: {}
                    },
                    allowedFilter: ['item', 'year', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        area: ["5000>", "351"],
                        "group_by": 'year',
                        "order_by": 'area'
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
                                en: "Production/Yield quantities of {{item}} in {{area}}",
                                fr: "Production/Rendement de {{item}} en {{area}}",
                                es: "Producción/Rendimiento de {{item}} en {{area}}"
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
                        template: {
                            // height:'350px'
                            // default labels to be applied
                        },
                        creator: {}
                    },
                    allowedFilter: ['area', 'year', 'item'],
                    filter: {
                        element: ["2312", "2510" ]
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-12",

                    // labels
                    labels: {
                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Production share of {{item}} by region",
                                fr: "Part de la production de {{item}} par région",
                                es: "Proporción de producción de {{item}} por región"
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
                        "group_by": 'year, item',
                        "order_by": 'area'
                    }
                },
                {
                    type: 'chart',
                    class: "col-sm-6",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Production of {{item}}: top 10 producers",
                                fr: "Production de {{item}}: 10 principaux producteurs",
                                es: "Producción de {{item}}: los 10 productores principales"
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
                            seriesDimensions: ['element']
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
                        "group_by": 'year, item',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                },
                {
                    type: 'chart',
                    class: "col-sm-6",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Most produced commodities, {{area}}",
                                fr: "Produits plus fabriqués, {{area}}",
                                es: "Productos más producidos, {{area}}"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: ['item'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['element']
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
                    allowedFilter: ['area', 'year', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        //area: ["5000>"],
                        item: ["_1"],
                        "group_by": 'year, area',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                }
            ]
        }

    };
});