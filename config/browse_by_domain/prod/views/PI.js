/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["PI"],
                "show_lists": false
            },

            items: [
                {
                    "id": "area",
                    "type": "codelist",
                    "parameter": "area",
                    "componentType": {
                        "class": "col-xs-6 col-sm-6 col-md-3",
                        "type": "dropDownList"
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
                        "class": "col-xs-4 col-sm-4 col-md-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": [],
                        "filter": {
                        }
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_code: ['PI']
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
                                en: "Producer price indices (2004-2006=100), {{area}}",
                                fr: "Indices des prix à la production (2004-2006=100), {{area}} ",
                                es: "Índices de precios al productor (2004-2006=100), {{area}} "
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
                            seriesDimensions: ['item'],
                            decimalPlaces: 2
                        },
                        template: {
                            // height:'350px'
                            // default labels to be applied
                        },
                        creator: {}
                    },
                    allowedFilter: ['area', 'year'],
                    filter: {
                        element: [5539],
                        item: [2051, 2044, 1717, 1720, 1726, 1732, 1735, 1738, 1780, 1783]
                    }
                }
            ]
        }

    }
});