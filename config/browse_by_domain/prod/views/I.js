/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["RM"],
                "show_lists": false
            },

            items: [
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
                        "defaultCodes": ["1992"],
                        "filter": {
                        }
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_codes: ['RM'],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                decimal_places: 2,
                decimal_separator: ".",
                limit: -1,
                thousand_separator: ",",
                null_values: null,
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
                                en: "Global machinery stock (agricultural tractors, total)",
                                fr: "Stock mondial de machines agricoles (tracteurs, total)",
                                es: "Reserva mundial de maquinarias (tractores agrícolas, total)"
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
                            seriesDimensions: ['element']
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['year'],
                    filter: {
                        List1Codes: [5000],
                        List2Codes: [
                            2620,
                            2920,
                            2610,
                            2910,
                            5116
                        ],
                        List3Codes: [2455009],
                        "order_by": 'year'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    labels: {
                        template: {
                            title: {
                                en: "Composition of capital stock by region",
                                fr: "Composition du stock de capital par région",
                                es: "Composición de la reserva de capital por región"
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
                        domain_codes: ['CS'],
                        List1Codes: [
                            5100,
                            5200,
                            5300,
                            5400,
                            5500
                        ],
                        List2Codes: [6115],
                        List3Codes: [
                            23006,
                            23007,
                            23008,
                            23009,
                            23010,
                            23011
                        ],
                        "group_by": 'year',
                        "order_by": 'area'
                    }
                }
            ]
        }
    }
});