/*global define*/
define([
    'config/browse_by_domain/Config'
], function (C) {

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
                    "parameter": "item",
                    "componentType": {
                        "class": "col-sm-7",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["22030"],
                        "filter": {}
                    }
                },
                {
                    "id": "area",
                    "type": "codelist",
                    "parameter": "area",
                    "componentType": {
                        "class": "col-sm-3",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "area",
                        "defaultCodes": ["2"],
                        "filter": {}
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "year",
                    "componentType": {
                        "class": "col-sm-2",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "year",
                        "filter": {
                            "blacklist": [1990, 1991, 1992, 1993, 1994]
                        }
                    }
                },
                {
                    "id": "yearTimerange",
                    "type": "codelist",
                    "parameter": "year",
                    "componentType": {
                        "class": "hidden",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "filter": {
                            "blacklist": [1990, 1991, 1992, 1993, 1994]
                        }
                    }
                }
            ]
        },

        dashboard: {

            defaultFilter: {
                domain_code: ['CS']
            },

            items: [
                {
                    type: 'map',
                    class: "col-md-12",

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

                    config: {},
                    allowedFilter: ['year', 'aggregation'],
                    filter: {
                        area: ["5000>", "351"],
                        element: ["6135"],
                        item: ["22030"]
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Gross Fixed Capital Formation (Agriculture, Forestry and Fishing), Agriculture orientation index in {{area}}",
                                fr: "Gross Fixed Capital Formation (Agriculture, Forestry and Fishing), Agriculture orientation index in {{area}}",
                                es: "Gross Fixed Capital Formation (Agriculture, Forestry and Fishing), Agriculture orientation index in {{area}}"
                            },
                            subtitle: "{{yearTimerange}}"
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
                    allowedFilter: ['yearTimerange', 'area'],
                    filter: {
                        element: ["6112"],
                        item: ["22030"]
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "{{item}}, Value US$ in {{area}}",
                                fr: "{{item}}, Value US$ in {{area}}",
                                es: "{{item}}, Value US$ in {{area}}"
                            },
                            subtitle: "{{yearTimerange}}"
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
                    allowedFilter: ['yearTimerange', 'area', 'item'],
                    filter: {
                        element: ["6110"]
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-12",

                    // labels
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
                        template: {},
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                }
                            }
                        }
                    },
                    allowedFilter: ['item', 'year', 'elements', 'aggregation'],
                    filter: {
                        area: ["5000>"],
                        element: ["6110"],
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                }
            ]
        }

    };
});