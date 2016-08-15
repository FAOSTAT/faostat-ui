/*global define*/

define(function () {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["EA"],
                "show_lists": false
            },

            items: [
                {
                    "id": "donor",
                    "type": "codelist",
                    "parameter": "List1Codes",
                    "componentType": {
                        "class": "col-md-4",
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
                        "class": "col-md-4",
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
                        "class": "col-md-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["22040"],
                        "filter": {
                            "whitelist": ["22040", "22050"]
                        }
                    }
                },
                {
                    "id": "purpose",
                    "type": "codelist",
                    "parameter": "List5Codes",
                    "componentType": {
                        "class": "col-md-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "analyticalagg",
                        "defaultCodes": ["310"],
                        "filter": {}
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "List6Codes",
                    "componentType": {
                        "class": "col-md-2",
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
                        "class": "col-md-2",
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
                //requestType: 'data' // data, rankings

            },

            metadata: {},

            items: [
                {
                    type: 'map',
                    class: "col-xs-12",
                    labels: {
                        default: {},
                        template: {
                            title: {
                                en: "Development flows of {{donor}} to {{purpose}} in US$, 2013 prices",
                                fr: "Development flows of {{donor}} to {{purpose}} in US$, 2013 prices",
                                es: "Development flows of {{donor}} to {{purpose}} in US$, 2013 prices"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },
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
                },
                {
                    type: 'chart',
                    class: "col-xs-12",
                    labels: {
                        template: {
                            title: {
                                en: "Development flow types of {{donor}} to {{purpose}} in {{recipientarea}} US$, 2013 prices",
                                fr: "Development flow types of {{donor}} to {{purpose}} in {{recipientarea}} US$, 2013 prices",
                                es: "Development flow types of {{donor}} to {{purpose}} in {{recipientarea}} US$, 2013 prices"
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
                            seriesDimensions: ['recipientarea', 'item', 'element'],
                            decimalPlaces: 2
                        },
                        template: {
                            // height:'350px'
                            // default labels to be applied
                        },
                        creator: {}
                    },
                    allowedFilter: ['donor', 'year', 'element', 'purpose', 'recipientarea'],
                    filter: {
                        List4Codes: ["22040", "22050"],
                        "order_by": 'year'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",
                    labels: {
                        template: {
                            title: {
                                en: "Top 10 recipients of {{donor}} in US$, 2013 prices",
                                fr: "Top 10 recipients of {{donor}} in US$, 2013 prices",
                                es: "Top 10 recipients of {{donor}} in US$, 2013 prices"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: ['recipientarea'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['donor'],
                            decimalPlaces: 2
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
                    allowedFilter: ['donor', 'item', 'element', 'year', 'purpose', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        List2Codes: ["5000>"],
                        "group_by": 'year',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",
                    labels: {
                        template: {
                            title: {
                                en: "Top 10 donors of {{recipientarea}} in US$, 2013 prices",
                                fr: "Top 10 donors of {{recipientarea}} in US$, 2013 prices",
                                es: "Top 10 donors of {{recipientarea}} in US$, 2013 prices"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: ['donor'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['recipientarea'],
                            decimalPlaces: 2
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
                    allowedFilter: ['recipientarea', 'item', 'element', 'year', 'purpose', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        // TODO: fix it with level 5
                        List1Codes: ["690>", "691>", "692>"],
                        "group_by": 'year',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                }
            ]
        }
    };
});