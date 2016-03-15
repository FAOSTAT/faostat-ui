/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        "relatedViews" : [],

        "filter": {

            defaultFilter: {
                "domain_code": ["QI"]
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
                        "dimension_id": "item",
                        "defaultCodes": ["2051"],
                        "filter": {}
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
                        "defaultCodes": ['1994'],
                        "filter": {
                        }
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_codes: ['QI'],
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
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Net production index (base 2004-2006), {{item}}",
                                fr: "Indice de la production nette (base 2004-2006), {{item}}",
                                es: "Índice neto de producción (base 2004-2006), {{item}}"
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
                            seriesDimensions: ['area']
                        },
                        template: {
                            // height:'350px'
                            // default labels to be applied
                        },
                        creator: {}
                    },
                    allowedFilter: ['item', 'year'],
                    filter: {
                        List1Codes: [5000, 5100, 5200, 5300, 5400, 5500],
                        List2Codes: [436]
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Per capita net production index (base 2004-2006), {{item}}",
                                fr: "Indice de production nette par habitant (base 2004-2006), {{item}}",
                                es: "Índice de producción neto per cápita (base 2004-2006), {{item}}"
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
                            seriesDimensions: ['area']
                        },
                        template: {
                            // height:'350px'
                            // default labels to be applied
                        },
                        creator: {}
                    },
                    allowedFilter: ['item', 'year'],
                    filter: {
                        List1Codes: [5000, 5100, 5200, 5300, 5400, 5500],
                        List2Codes: [438]
                    }
                }
            ]
        }

    }
});