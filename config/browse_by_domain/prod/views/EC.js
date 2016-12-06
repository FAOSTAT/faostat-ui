/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["EC"],
                "show_lists": false
            },

            items: [
                {
                    "id": "area",
                    "type": "codelist",
                    "parameter": "area",
                    "componentType": {
                        "class": "col-lg-3",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "area",
                        "defaultCodes": ["5000"],
                        "filter": {}
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "year",
                    "componentType": {
                        "class": "col-sm-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": ['1990'],
                        "filter": {
                        }
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_code: ["EC"]
            },

            items: [
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels
                    labels: {

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Ammonia (NH3) emissions from agriculture",
                                fr: "Ammoniac (NH3) provenant de l'agriculture",
                                es: "Amoniaco (NH3) procedentes de la agricultura"
                            },
                            subtitle: "{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "timeserie",
                            xDimensions: "year",
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area'],
                            decimalPlaces: 2
                        },
                        template: {
                            height: '250px'
                        },
                        creator: {}
                    },
                    allowedFilter: ['year', 'area'],
                    deniedTemplateFilter: [],
                    filter: {
                        element: [7203],
                        item: [6730]
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels
                    labels: {

                        // labels to dinamically substitute the title and subtitle
                        default: {
                            aggregation: C.i18n.average
                        },

                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                "en":"Ammonia (NH3) emissions from agriculture (Top 10 Countries)",
                                "fr":"Ammoniac (NH3) provenant de l'agriculture (10 pays principaux)",
                                "es":"Amoniaco (NH3) procedentes de la agricultura (los 10 países principales)"
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
                            seriesDimensions: ['element'],
                            decimalPlaces: 2
                        },
                        template: {
                            height:'250px'
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
                    allowedFilter: ['year', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        area: ["5000>"],
                        element: [7203],
                        item: [6730],
                        "group_by": 'year, item',
                        "order_by": 'value DESC',
                        "limit": '10',
                        "operator": 'avg'
                    }
                }
            ]
        }

    }
});