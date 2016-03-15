/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        "relatedViews" : [],

        /*"comment": {
            "text": {
                "en": "Q Emissions of methane produced in digestive systems of livestock",
                "es": "ES Emissions of methane produced in digestive systems of livestock",
                "fr": "FR Emissions of methane produced in digestive systems of livestock"
            },
            pdf: "GA.pdf"
        },*/

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
                        "dimension_id": "item",
                        "defaultCodes": ["1717"],
                        "filter": {
                            whitelist: [
                                1814,
                                1717,
                                249,
                                656,
                                1765,
                                27,
                                1720,
                                1732,
                                156,
                                667,
                                15
                            ]
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
                C.filter.aggregation
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_codes: ['QC'],
                List2Codes: ["2510"],
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
                    type: 'map',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // labels to dinamically substitute the title and subtitle
                        default: {},

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Production quantities of {{item}} by country",
                                fr: "Quantités de production de {{item}} par pays",
                                es: "Cantidades de producción de {{item}} por país"
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
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Food per capita net production index by region (base 2004-2006)",
                                fr: "Indice de production net de nourriture par habitant par région (base 2004-2006)",
                                es: "Índice de producción neta de alimentos por persona, por región (base 2004-2006)"
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
                    allowedFilter: ['year'],
                    filter: {
                        domain_codes: ['QI'],
                        List1Codes: [5000, 5100, 5200, 5300, 5400, 5500],
                        List2Codes: ['438'],
                        List3Codes: ['2054']
                    }
                }
            ]
        }

    }
});