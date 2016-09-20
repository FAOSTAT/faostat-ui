/*global define*/

define(function () {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["RL"],
                "show_lists": false
            },

            items: [
                {
                    "id": "area",
                    "type": "codelist",
                    "parameter": "area",
                    "componentType": {
                        "class": "col-xs-6 col-sm-6 col-md-4",
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
                    "parameter": "year",
                    "componentType": {
                        "class": "col-xs-4 col-sm-4 col-md-2",
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
                domain_code: ['RL'],
                element: [5110],
                item: [
                    6621,
                    6650,
                    6655
                ]
            },

            items: [
                {
                    type: 'chart',
                    class: "col-md-12",

                    // labels
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
                    class: "col-md-12",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Composition of global agricultural area",
                                fr: "Composition de la surface agricole mondiale",
                                es: "Composición del área agrícola mundial"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
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
                        area: [
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
    };
});