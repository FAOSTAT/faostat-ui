/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        filter: {

            defaultFilter: {
                "domain_code": ["QV"],
                // this force all the filters to avoid the "lists" codes
                "show_lists": false
            },

            items: [
                {
                    // id to be applied on the getData request
                    "id": "item",
                    "type": "codelist",
                    "parameter": "List3Codes",
                    "componentType": {
                        "class": "col-xs-4",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "items",
                        "defaultCodes": ["800"],
                        "filter": {}
                    }
                },
                {
                    // id to be applied on the getData request
                    "id": "element",
                    "type": "codelist",
                    "parameter": "List2Codes",
                    "componentType": {
                        "class": "col-xs-6",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "element",
                        "defaultCodes": ["57"],
                        "filter": {
                            whitelist: [
                                57,
                                152,
                                154,
                                58
                            ]
                        }
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_codes: ['QV'],
                List1Codes: ["5000"],
                List2Codes: ["57"],
                List4Codes: ["_1"],
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

            // labels
            labels: {
                default: {}
            },

            //bridge configuration
            bridge: {

                type: "faostat"

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
                                en: "{{element}} - {{item}}",
                                fr: "{{element}} - {{item}}",
                                es: "{{element}} - {{item}}"
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
                    allowedFilter: ['area', 'year', 'item', 'element'],
                    filter: {
                    }
                }
            ]
        }

    }
});