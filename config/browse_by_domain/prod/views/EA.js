/*global define*/

define(function () {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["EA"]
            },

            items: [
                {
                    "id": "donor",
                    "type": "codelist",
                    "parameter": "List1Codes",
                    "componentType": {
                        "class": "col-lg-5",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "donor",
                        "defaultCodes": ["702"],
                        "filter": {}
                    }
                },
                {
                    "id": "recipientarea",
                    "type": "codelist",
                    "parameter": "List2Codes",
                    "componentType": {
                        "class": "col-lg-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "recipientarea",
                        "defaultCodes": ["2"],
                        "filter": {}
                    }
                },
                {
                    "id": "item",
                    "type": "codelist",
                    "parameter": "List4Codes",
                    "componentType": {
                        "class": "col-lg-3",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["22040"],
                        "filter": {
                            "whitelist": ["22040"]
                        }
                    }
                },
                {
                    "id": "purpose",
                    "type": "codelist",
                    "parameter": "List5Codes",
                    "componentType": {
                        "class": "col-lg-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "analyticalaggregates",
                        "defaultCodes": ["310"],
                        "filter": {}
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "List6Codes",
                    "componentType": {
                        "class": "col-lg-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": ['1995'],
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
                domain_codes: ['EA'],
                List3Codes: ["6137"],
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
                                en: "Development flows of selected aid aggregates in US$, 2013 prices",
                                fr: "Development flows of selected aid aggregates in US$, 2013 prices",
                                es: "Development flows of selected aid aggregates in US$, 2013 prices"
                            },
                            subtitle: "{{aggregation}} {{year}}"
                        }
                    },

                    //height:'250px',
                    config: {
                        template: {},
                        adapter: {
                            dimensions: {
                                geoDimensions: {
                                    dimension_id: 'recipientarea',
                                    type: 'code'
                                }
                            }
                        },
                        layer: {}
                    },
                    allowedFilter: ['donor', 'item', 'year', 'purpose', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        List2Codes: ["5000>", "351"],
                        "group_by": 'year',
                        "order_by": 'recipientarea'
                    }
                }
            ]
        }
    };
});