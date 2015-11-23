/*global define*/

define(function () {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["QC"]
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
                        "defaultCodes": ["27"],
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
                        "defaultCodes": ["2"],
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
                    // TODO: check data parameter
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
                domain_code: 'QC',
                List2Codes: ["2510"],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                decimal_places: 2,
                decimal_separator: ".",
                limit: -1,
                thousand_separator: ",",
                "null_values": null
            },

            // labels?
            labels: {
                // labels to dinamically substitute the title and subtitle
                default: {
                    /*aggregation: {
                     en: "Average",
                     fr: "Moyenne",
                     es: "Promedio"
                     },
                     year: "1993 - 2013",
                     area: {
                     "en": "Afghanistan",
                     "fr": "Afghanistan",
                     "es": "Afghanistan"
                     },
                     item: {
                     "en": "Rice, milled",
                     "fr": "Rice, milled",
                     "es": "Rice, milled"
                     }*/
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
                    type: 'table',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // labels to dinamically substitute the title and subtitle
                        default: {},

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Production quantities of {{item}} by country",
                                fr: "Production quantities of {{item}} by country",
                                es: "Production quantities of {{item}} by country"
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
                    }
                    /*                    bridge: {
                     requestType: 'rankings' // data, rankings
                     }*/
                }
            ]
        }

    }
});