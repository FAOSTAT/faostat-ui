/*global define*/

define(function () {

    'use strict';

    return {

        "pdf" : [{

        }],


        "structure" :{

        },

        "filter": [
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
                    "dimension_id": "items",
                    "defaultCodes": ["27"],
                    "filter": {
                        "domain_code": ["QC"],
                        "whitelist": [],
                        "blacklist": []
                    }
                }
            },
            {
                // id to be applied on the getData request
                "id": "area",
                "type": "codelist",
                "parameter": "List1Codes",
                "componentType": {
                    <!-- TODO: add a class instead of bootstrap -->
                    "class": "col-lg-3",
                    "type": "dropDownList",
                    //"multiple": true
                },
                "config": {
                    "dimension_id": "countries",
                    "defaultCodes": ["2"],
                    "filter": {
                        "domain_code": ["QC"]
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
                    "defaultCodes": ["1993", "2013"],
                    "filter": {
                        "domain_code": ["QC"]
                    }
                }
            },
            {
                "id": "aggregation",
                "type": "static",
                // TODO: check data parameter
                "parameter": "operator",
                "componentType": {
                    "class": "col-lg-2",
                    "type": "dropDownList"
                },
                "config": {
                    "defaultCodes": ["AVG"],
                    "data": [
                        // TODO: multilingual?
                        {"code": "AVG", "label": "average", "selected": true},
                        {"code": "SUM", "label": "sum", "selected": false}
                    ]
                }
            }
        ],

        dashboard: {

            //data base filter
            filter: {
                // TODO: lang and datasource should be added at runtime
                //lang: 'en',
                //datasource: 'production',
                decimal_places: 2,
                decimal_separator: ".",
                limit: -1,
                thousand_separator: ",",
                "null_values": null
            },

            // labels?
            labels: {
                // labels to dinamically substitute the title and subtitle
                default: {
                    /*aggregation: {
                        en: "Average",
                        fr: "Moyenne",
                        es: "Promedio"
                    },
                    year: "1993 - 2013",
                    area: {
                        "en": "Afghanistan",
                        "fr": "Afghanistan",
                        "es": "Afghanistan"
                    },
                    item: {
                        "en": "Rice, milled",
                        "fr": "Rice, milled",
                        "es": "Rice, milled"
                    }*/
                }
            },



            //bridge configuration
            bridge: {

                type: "faostat"

            },

            metadata: {},

            items:  [
                {
                    //id: 'faostat-QC-1',
                    type: 'map',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // labels to dinamically substitute the title and subtitle
                        default: {

                        },

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Production quantities of {{item}} by country",
                                fr: "Production quantities of {{item}} by country",
                                es: "Production quantities of {{item}} by country"
                            },
                            subtitle: "{{aggregation}} {{year}}"
                        }
                    },


                    //height:'250px',
                    config: {
                        template: {

                        }
                    },
                    allowedFilter: ['item', 'year', 'element' , 'aggregation'],
                    deniedTemplateFilter: [],
                    filter:
                        {
                            domain_code: 'QC',
                            // TODO: remove the List1Codes (in theory should be automatically detected from the domain dimensions/schema)
                            List1Codes: ["5000>", "351"],
                            List2Codes: ["2510"],
                            //List3Codes: ["27"],
                            //List4Codes: [1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013],
                            List5Codes: null,
                            List6Codes: null,
                            List7Codes: null,
                            "group_by": 'year',
                            "order_by": 'area',
                            "operator": 'AVG',
                            "page_size": 0,
                            "page_number": 0
                        }
                },
                {
                    //id: 'faostat-QC-1',
                    type: 'chart',
                    class: "col-xs-12",
                    //height:'250px !important;',

                    // labels?
                    labels: {
                        // labels to dinamically substitute the title and subtitle
                        default: {

                        },

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Production quantities of {{item}} in {{area}}",
                                fr: "Production de {{item}} dans le {{area}}",
                                es: "Producción de {{item}} en {{area}}"
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
                    allowedFilter: ['area', 'year', 'item'],
                    filter:
                    {
                        domain_code: 'QC',
                        // TODO: remove the List1Codes (in theory should be automatically detected from the domain dimensions/schema)
                        List1Codes: ["2"],
                        List2Codes: ["2510"],
                        List3Codes: ["27"],
                        List4Codes: [1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013],
                        List5Codes: null,
                        List6Codes: null,
                        List7Codes: null,
                        "page_size": 0,
                        "page_number": 0
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // labels to dinamically substitute the title and subtitle
                        default: {

                        },

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Production share of {{item}} by region",
                                fr: "Part de la production de {{item}} par région",
                                es: "Proporción de producción de {{item}} por región"
                            },
                            subtitle: "{{aggregation}} {{year}}"
                        }

                    },

                    //height:'250px',
                    // style: 'height:250px',
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "pie",
                            xDimensions: null,
                            yDimensions: null,
                            valueDimensions: 'value',
                            seriesDimensions: ['area']
                        },
                        template: {
                            height:'250px'
                        },
                        creator: {}
                    },
                    allowedFilter: ['year', 'item', 'aggregation'],
                    filter:
                    {
                        domain_code: 'QC',
                        // TODO: remove the List1Codes (in theory should be automatically detected from the domain dimensions/schema)
                        List1Codes: ["5100", "5200", "5300", "5400", "5500"],
                        List2Codes: ["2510"],
                        List3Codes: ["27"],
                        List4Codes: [1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013],
                        List5Codes: null,
                        List6Codes: null,
                        List7Codes: null,
                        "group_by": 'year',
                        "order_by": 'area',
                        "operator": 'AVG',
                        "page_size": 0,
                        "page_number": 0
                    }
                }
            ]
        }

    }
});