/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["TP"],
                "show_lists": false
            },

            items: [
                {
                    "id": "item",
                    "type": "codelist",
                    // TODO: in theory that should come from the dimensions schema!!
                    "parameter": "List3Codes",
                    //"title": "title",
                    "componentType": {
                        "class": "col-lg-3",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "items",
                        "defaultCodes": ["15"],
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
                        "dimension_id": "countries",
                        "defaultCodes": ["9"],
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
                C.filter.aggregation
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_codes: ['TP'],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                decimal_places: 2,
                decimal_separator: ".",
                limit: "-1",
                thousand_separator: ",",
                "null_values": null,
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
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Exports of {{item}} in {{area}}",
                                fr: "Exportations de {{item}} en {{area}}",
                                es: "Exportaciones de {{item}} en {{area}}"
                            },
                            subtitle: "{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "timeserie",
                            xDimensions: ['year'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area', 'item', 'element']
                        },
                        template: {
                            height:'250px'
                            // default labels to be applied
                        },
                        creator: {

                        }
                    },
                    allowedFilter: ['area', 'year', 'item', 'element', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        List2Codes: [2910],
                        List3Codes: [15]
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
                                en: "Imports of {{item}} in {{area}}",
                                fr: "Importations de {{item}} en {{area}}",
                                es: "Importaciones de {{item}} en {{area}}"
                            },
                            subtitle: "{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "timeserie",
                            xDimensions: ['year'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area', 'item', 'element']
                        },
                        template: {
                            height:'250px'
                            // default labels to be applied
                        },
                        creator: {

                        }
                    },
                    allowedFilter: ['area', 'year', 'item', 'element', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        List2Codes: [2610],
                        List3Codes: [15]
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
                                en: "Exports of top 5 exporters of {{item}}",
                                fr: "Exportations des 5 meilleurs exportateurs de {{item}}",
                                es: "Exportaciones de los 5 principales exportadores de {{item}}"
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
                        List2Codes: [2910],
                        List3Codes: [15],
                        "group_by": 'year',
                        "order_by": 'value DESC',
                        "limit": '5'
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
                                en: "Imports of top 5 importers of {{item}}",
                                fr: "Importations des 5 meilleurs importateurs de {{item}}",
                                es: "Importaciones de los 5 principales importadores de {{item}}"
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
                        List2Codes: [2610],
                        List3Codes: [15],
                        "group_by": 'year',
                        "order_by": 'value DESC',
                        "limit": '5'
                    }
                }
            ]
        }

    }
});