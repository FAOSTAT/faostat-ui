/*global define*/

define(function () {

    'use strict';

    return {

        dashboard: {

            "render": true,

            //data base filter
            defaultFilter: {
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                decimal_places: 2,
                decimal_separator: ".",
                limit: -1,
                thousand_separator: ",",
                null_values: null,
                page_size: 0,
                per_page: 0,
                page_number: 0
            },

            // labels?
            labels: {
                // labels to dinamically substitute the title and subtitle
                // TODO: import i18n in the js to be consistent?
                default: {
                    aggregation: {
                         en: "Average",
                         fr: "Moyenne",
                         es: "Promedio"
                     }
                }
            },

            items: [
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "World fertilizers consumption (nutrients)",
                                fr: "Consomation mondiale d'engrais (nutriments)",
                                es: "Consumo mundial de fertilizantes (nutrientes)"
                            },
                            subtitle: "2002 - 2009"
                        }
                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "timeserie",
                            xDimensions: 'year',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['item']
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: [],
                    filter: {
                        domain_codes: ['RF'],
                        List1Codes: [5000],
                        List2Codes: [5155],
                        List3Codes: [
                            3102,
                            3103,
                            3104
                        ],
                        List4Codes: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009],
                        "order_by": 'year'
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
                                en: "Composition of global agricultural area",
                                fr: "Composition de la surface agricole mondiale",
                                es: "Composición del área agrícola mundial"
                            },
                            subtitle: "{{aggregation}} 2002 - 2009"
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
                    allowedFilter: [],
                    filter: {
                        domain_codes: ['RL'],
                        List1Codes: [
                            5100,
                            5200,
                            5300,
                            5400,
                            5500
                        ],
                        List2Codes: [5110],
                        List3Codes: [
                            6621,
                            6650,
                            6655
                        ],
                        List4Codes: [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009],
                        group_by: 'year',
                        order_by: 'area',
                        operator: 'AVG'
                    }
                }
            ]
        }
    }
});