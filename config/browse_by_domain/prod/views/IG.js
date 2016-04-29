/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        filter: {

            defaultFilter: {
                "domain_code": ["IG"],
                "show_lists": false
            },

            items: [
                {
                    // id to be applied on the getData request
                    "id": "item",
                    "type": "codelist",
                    // TODO: in theory that should come from the dimensions schema!!
                    "parameter": "List3Codes",
                    //"title": "title",
                    "componentType": {
                        <!-- TODO: add a class instead of bootstrap -->
                        "class": "col-xs-7 col-md-5",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "items",
                        "defaultCodes": ["23101"],
                        "filter": {
                            whitelist: [
                                "23101"
                            ]
                        }
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "List4Codes",
                    "componentType": {
                        "class": "col-xs-3 col-md-2",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "year",
                        "filter": {
                        }
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_codes: ['IG'],
                List2Codes: [6111],
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
                                en: "Share of Government Expenditures on Agriculture (% of Total Outlays)",
                                fr: "Share of Government Expenditures on Agriculture (% of Total Outlays)",
                                es: "Share of Government Expenditures on Agriculture (% of Total Outlays)"
                            },
                            subtitle: "{{year}}"
                        }
                    },

                    //height:'250px',
                    config: {
                        template: {}
                    },
                    allowedFilter: ['item', 'year'],
                    deniedTemplateFilter: [],
                    filter: {
                        // TODO: remove the List1Codes (in theory should be automatically detected from the domain dimensions/schema)
                        List1Codes: ["5000>", "351"],
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
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Government Expenditures on Agriculture in Africa (% of Total Outlays)",
                                fr: "Government Expenditures on Agriculture in Africa (% of Total Outlays)",
                                es: "Government Expenditures on Agriculture in Africa (% of Total Outlays)"
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
                            seriesDimensions: ['item','element'],
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
                    allowedFilter: ['item', 'year'],
                    deniedTemplateFilter: [],
                    filter: {
                        // africa
                        List1Codes: ["5100>"],
                        order_by: 'value DESC'
                    }
                },
            ]
        }

    }
});