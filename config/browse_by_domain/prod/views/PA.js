/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["PM"],
                "show_lists": false
            },

            items: [
                {
                    "id": "area",
                    "type": "codelist",
                    "parameter": "List1Codes",
                    "componentType": {
                        "class": "col-md-3",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "area",
                        "defaultCodes": ["3"],
                        "filter": {}
                    }
                },
                {
                    "id": "item",
                    "type": "codelist",
                    "parameter": "List3Codes",
                    "componentType": {
                        "class": "col-md-3",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "items",
                        "defaultCodes": ["515"],
                        "filter": {}
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "List4Codes",
                    "componentType": {
                        "class": "col-md-2",
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
                domain_codes: ['PM'],
                List2Codes: ['_1'],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                limit: -1,
                "null_values": null,
                page_size: 0,
                per_page: 0
            },

            // labels?
            labels: {
                // labels to dinamically substitute the title and subtitle
                default: {}
            },


            //bridge configuration
            bridge: {

                type: "faostat"
                //requestType: 'data' // data, rankings

            },

            metadata: {},

            items: [
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "{{area}} {{element}} - {{year}}",
                                fr: "{{area}} {{element}} - {{item}}",
                                es: "{{area}} {{element}} - {{item}}"
                            }
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'month',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area', 'item', 'year']
                        },
                        template: {
                            // height:'350px'
                            // default labels to be applied
                        },
                        creator: {}
                    },
                    allowedFilter: ['area', 'item', 'year'],
                    filter: {
                    }
                }
            ]
        }

    };
});