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
                    // TODO: in theory that should come from the dimensions schema!!
                    "parameter": "List1Codes",
                    //"title": "title",
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
                    "parameter": "List4Codes",
                    "componentType": {
                        "class": "col-xs-4 col-sm-4 col-md-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": ['2003'],
                        "filter": {
                        }
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_codes: ['PI'],
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

                type: "faostat",
                //requestType: 'data' // data, rankings

            },

            metadata: {},

            items: [
                {
                    type: 'chart',
                    class: "col-md-12",

                    // labels?
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
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
                        List2Codes: [5539],
                        List3Codes: [2051, 2044, 1717, 1720, 1726, 1732, 1735, 1738, 1780, 1783]
                    }
                }
            ]
        }

    }
});