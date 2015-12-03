/*global define*/

define(function () {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["RL"]
            },

            items: [
                {
                    "id": "area",
                    "type": "codelist",
                    "parameter": "List1Codes",
                    "componentType": {
                        "class": "col-lg-2",
                        "type": "dropDownList"
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
                        "defaultCodes": ["2000"],
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
                domain_codes: ['RL'],
                List2Codes: [5110],
                List3Codes: [
                    6621,
                    6650,
                    6655
                ],
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
                requestType: 'data' // data, rankings

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
                                en: "Composition of agricultural area {{area}}",
                                fr: "Composition de la surface agricole {{area}}",
                                es: "Composición del área agrícola {{area}}"
                            },
                            subtitle: "{{year}}"
                        }
                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'year',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area', 'item']
                        },
                        template: {},
                        creator: {
                            chartObj: {
                                chart: {
                                    type: 'column'
                                },
                                plotOptions: {
                                    column: {
                                        stacking: 'normal'
                                    }
                                }
                            }
                        }
                    },
                    allowedFilter: ['area', 'year'],
                    filter: {
                        "order_by": 'year'
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
                                en: "Composition of global agricultural area",
                                fr: "Composition de la surface agricole mondiale",
                                es: "Composición del área agrícola mundial"
                            },
                            subtitle: "{{aggregation}} {{year}}"
                        }
                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'area',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['item']
                        },
                        template: {},
                        creator: {
                            chartObj: {
                                chart: {
                                    type: 'column'
                                },
                                plotOptions: {
                                    column: {
                                        stacking: 'normal'
                                    }
                                }
                            }
                        }
                    },
                    allowedFilter: ['year', 'aggregation'],
                    filter: {
                        List1Codes: [
                            5100,
                            5200,
                            5300,
                            5400,
                            5500
                        ],
                        "group_by": 'year',
                        "order_by": 'area'
                    }
                }
            ]
        }
    }
});