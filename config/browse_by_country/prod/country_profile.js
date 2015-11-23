/*global define*/

define(function () {

    'use strict';

    return {

        dashboard: {

            //data base filter
            defaultFilter: {
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
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

                type: "faostat",
                requestType: 'data' // data, rankings

            },

            metadata: {},

            items: [
                {
                    type: 'chart',
                    class: "col-xs-12 col-md-8",

                    // labels?
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Production of {{item}} top 5 producers",
                                fr: "Production of {{item}} top 5 producers",
                                es: "Production of {{item}} top 5 producers"
                            },
                            subtitle: "{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "timeserie",
                            xDimensions: ['year'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['item']
                        },
                        template: {
                            height: '200px'
                            // height:'350px'
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
                    allowedFilter: ['year', 'item', 'aggregation'],
                    filter: {
                        domain_code: "QC",

                        List2Codes: ["2510"],
                        List3Codes: ["27", "15"],
                        List4Codes: ["1990", "1991", "1992"]

 /*                       "group_by": 'year',
                        "order_by": 'value DESC',
                        "limit": '10',
                        "operator": "AVG"*/
                    }
                },
                {
                    type: 'table',
                    class: "col-xs-12 col-md-4",

                    // labels?
                    labels: {
                        // labels to dinamically substitute the title and subtitle
                        default: {},

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Land Resources (1000 Ha)",
                                fr: "Land Resources (1000 Ha)",
                                es: "Land Resources (1000 Ha)"
                            },
                            subtitle: "2011"
                        }
                    },


                    //height:'250px',
                    config: {
                        adapter: {
                            columns: ['item', 'value'],
                            showCodes: false
                        },
                        template: {
                            //height: '150', // important is without px!!
                            //tableOptions: {
                            //    'data-search': true
                            //}
                            tableOptions: {
                                'data-search': false,
                                'data-show-header': false
                            }
                        }
                    },
                    allowedFilter: ['item', 'year', 'element', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        // TODO: remove the List1Codes (in theory should be automatically detected from the domain dimensions/schema)
                        domain_code: "RL",
                        List2Codes: ["5110"],
                        List3Codes: [6600, 6610, 6661],
                        List4Codes: [2011]
                    }
                }
            ]
        }

    }
});