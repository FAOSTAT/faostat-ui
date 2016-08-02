/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["CS"],
                "show_lists": false
            },

            items: [
                {
                    "id": "item",
                    "type": "codelist",
                    "parameter": "List3Codes",
                    "componentType": {
                        "class": "col-sm-3",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["22030"],
                        "filter": {
                        }
                    }
                },
/*                {
                    "id": "elements",
                    "type": "codelist",
                    "parameter": "List2Codes",
                    "componentType": {
                        "class": "col-sm-3",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "elements",
                        "defaultCodes": ["6110"],
                        "filter": {
                            whitelist: [6110]
                        }
                    }
                },*/
                {
                    // id to be applied on the getData request
                    "id": "area",
                    "type": "codelist",
                    "parameter": "List1Codes",
                    "componentType": {
                        "class": "col-sm-3",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "area",
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
                        "class": "col-sm-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        //"defaultCodes": ['1990'],
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
                domain_codes: ['CS'],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                limit: -1,
                decimal_places: 2,
                thousand_separator: ",",
                "null_values": null,
                page_size: 0,
                page_number: 0
            },

            // labels
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

                    // labels
                    labels: {
                        default: {},
                        template: {
                            title: {
                                en: "Agriculture Gross Fixed Capital Formation as a share of Agriculture Value Added",
                                fr: "Agriculture Gross Fixed Capital Formation as a share of Agriculture Value Added",
                                es: "Agriculture Gross Fixed Capital Formation as a share of Agriculture Value Added"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    config: {
                        layer: {},
                        template: {}
                    },
                    allowedFilter: ['year', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        List1Codes: ["5000>", "351"],
                        List2Codes: ["6135"],
                        List3Codes: ["22030"],
                        "group_by": 'year',
                        "order_by": 'area'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Gross Fixed Capital Formation (Agriculture, Forestry and Fishing), Agriculture orientation index in {{area}}",
                                fr: "Gross Fixed Capital Formation (Agriculture, Forestry and Fishing), Agriculture orientation index in {{area}}",
                                es: "Gross Fixed Capital Formation (Agriculture, Forestry and Fishing), Agriculture orientation index in {{area}}"
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
                            seriesDimensions: ['area', 'item', 'element'],
                            decimalPlaces: 3
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['year', 'area'],
                    //deniedOnLoadFilter: ['area'],
                    filter: {
                        List2Codes: ["6112"],
                        List3Codes: ["22030"],
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "{{item}}, Value US$ in {{area}}",
                                fr: "{{item}}, Value US$ in {{area}}",
                                es: "{{item}}, Value US$ in {{area}}",
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
                            seriesDimensions: ['area', 'item', 'element'],
                            decimalPlaces: 3
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['year', 'area', 'item'],
                    //deniedOnLoadFilter: ['area'],
                    filter: {
                        List2Codes: ["6110"],
                        List3Codes: ["22030"],
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
                                en: "Top 10 countries - {{item}}, Value US$",
                                fr: "Top 10 countries - {{item}}, Value US$",
                                es: "Top 10 countries - {{item}}, Value US$"
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
                            seriesDimensions: ['item', 'element'],
                            decimalPlaces: 3
                        },
                        template: {
                            //height:'250px'
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
                    allowedFilter: ['item', 'year', 'elements', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        List1Codes: ["5000>"],
                        List2Codes: ["6110"],
                        "group_by": 'year',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                }
            ]
        }

    };
});