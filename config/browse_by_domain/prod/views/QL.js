/*global define*/

define(function () {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["QL"]
            },

            items: [
                {
                    // id to be applied on the getData request
                    "id": "item",
                    "type": "codelist",
                    "parameter": "List3Codes",
                    "componentType": {
                        "class": "col-lg-3",
                        "type": "dropDownList"
                        //"multiple": true
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["1765"],
                        "filter": {
                        }
                    }
                },
                {
                    "id": "area",
                    "type": "codelist",
                    "parameter": "List1Codes",
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
                    "parameter": "List4Codes",
                    "componentType": {
                        "class": "col-lg-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": ['1993'],
                        "filter": {
                        }
                    }
                },
                {
                    "id": "aggregation",
                    "type": "static",
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
                domain_codes: ['QL'],
                List2Codes: ["2510"],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                decimal_places: 2,
                decimal_separator: ".",
                limit: -1,
                thousand_separator: ",",
                "null_values": null,
                // TODO: remove it the page_size!!!
                page_size: 0,
                per_page: 0,
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
                                en: "Production of {{item}} by country",
                                fr: "Production of {{item}} by country",
                                es: "Production of {{item}} by country"
                            },
                            subtitle: "{{aggregation}} {{year}}"
                        }
                    },


                    //height:'250px',
                    config: {
                        template: {}
                    },
                    allowedFilter: ['item', 'year', 'element', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        // TODO: remove the List1Codes (in theory should be automatically detected from the domain dimensions/schema)
                        List1Codes: ["5000>", "351"],
                        "group_by": 'year',
                        "order_by": 'area'
                    },
/*                    bridge: {
                        requestType: 'rankings' // data, rankings
                    }*/
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Production of {{item}} in {{area}}",
                                fr: "Production de {{item}} dans le {{area}}",
                                es: "Producción de {{item}} en {{area}}"
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
                    filter: {}
                },
                {
                    type: 'chart',
                    class: "col-xs-12 col-sm-6",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Production of {{item}} top 10 producers",
                                fr: "Production of {{item}} top 10 producers",
                                es: "Production of {{item}} top 10 producers"
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
                        "group_by": 'year, item',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-6",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Production share of {{item}} by region",
                                fr: "Part de la production de {{item}} par région",
                                es: "Proporción de producción de {{item}} por región"
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
                        List1Codes: ["5100", "5200", "5300", "5400", "5500"],
                        "group_by": 'year, item',
                        "order_by": 'area'
                    }
                }
            ]
        }

    }
});