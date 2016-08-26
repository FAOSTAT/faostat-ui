/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    var i18n = C.i18n || {};

    return {

        "relatedViews" : [
            {
                title: i18n.em_total_ghg,
                id: 'EM'
            },
            {
                title: i18n.em_co2,
                id: 'EM-CO2',
                selected: true
            },
            {
                title: i18n.em_n2o,
                id: 'EM-N2O'
            },
            {
                title: i18n.em_ch4,
                id: 'EM-CH4'
            }
        ],

        "filter": {

            defaultFilter: {
                "domain_code": ["EM"],
                "show_lists": false
            },

            items: [
                {
                    // id to be applied on the getData request
                    "id": "item",
                    "type": "codelist",
                    "parameter": "List3Codes",
                    "title": {
                        "en": "Sector",
                        "fr": "Sector",
                        "es": "Sector",
                    },
                    "componentType": {
                        "class": "col-xs-4 col-sx-4 col-md-4",
                        "type": "dropDownList"
                        //"multiple": true
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["1711"],
                        "filter": {
                            whitelist: [1711, 6822]
                        }
                    }
                },
                {
                    // id to be applied on the getData request
                    "id": "area",
                    "type": "codelist",
                    "parameter": "List1Codes",
                    "componentType": {
                        "class": "col-xs-4 col-sx-4 col-md-4",
                        "type": "dropDownList"
                        //"multiple": true
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
                    "parameter": "List4Codes",
                    "componentType": {
                        "class": "col-xs-4 col-sx-4 col-md-2",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "year",
                        "filter": {}
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_codes: ['EM'],
                List2Codes: ["7264"],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                limit: -1,
                decimal_places: 2,
                thousand_separator: ",",
                "null_values": null,
                page_size: 0,
                page_number: 0
            },

            labels: {
                default: {}
            },

            //bridge configuration
            bridge: {

                type: "faostat"

            },

            metadata: {},

            items: [
                {
                    type: 'map',
                    class: "col-md-12",

                    // labels?
                    labels: {
                        // labels to dinamically substitute the title and subtitle
                        default: {},

                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Shares by country of sector {{item}} in CO<sub>2</sub> emissions",
                                fr: "",
                                es: ""
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },
                    config: {
                        template: {}
                    },
                    allowedFilter: ['item', 'year'],
                    deniedTemplateFilter: [],
                    filter: {
                        List1Codes: ["5000>", "351"]
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-12",

                    // labels
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Shares of agricultural sectors in CO<sub>2</sub> emissions",
                                fr: "",
                                es: ""
                            },
                            // TODO: make it dinamic for the timeserie
                            subtitle: "{{area}}, 1990 - 2010"
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
                            decimalPlaces: 2
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['area'],
                    filter: {
                        List3Codes: ["1711", "6822"],
                        List4Codes: ["_1"]
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-12",

                    labels: {
                        template: {
                            title: {
                                en: "Share of each sector in CO<sub>2</sub> emissions",
                                fr: "",
                                es: ""
                            },
                            subtitle: "{{area}}, {{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }

                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "pie",
                            xDimensions: null,
                            yDimensions: null,
                            valueDimensions: 'value',
                            seriesDimensions: ['item'],
                            decimalPlaces: 2
                        },
                        template: {
                            height: '300px'
                        },
                        creator: {}
                    },
                    allowedFilter: ['area', 'year'],
                    filter: {
                        List3Codes: [
                            6814,
                            6815,
                            6816,
                            6817,
                            6818,
                            6819,
                            6820,
                            1711,
                            6822
                        ]
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-12",

                    labels: {
                        template: {
                            title: {
                                en: "Share of each gas in sector {{item}} emissions",
                                fr: "",
                                es: ""
                            },
                            subtitle: "{{area}}, {{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }

                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "pie",
                            xDimensions: null,
                            yDimensions: null,
                            valueDimensions: 'value',
                            seriesDimensions: ['element', 'item'],
                            decimalPlaces: 2
                        },
                        template: {
                            height: '250px'
                        },
                        creator: {}
                    },
                    allowedFilter: ['area', 'year', 'item'],
                    filter: {
                        List2Codes: [7267, 7268, 7269]
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
                                en: "Top 10 areas by share of sector {{item}} in CO<sub>2</sub>  emissions",
                                fr: "",
                                es: ""
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
                            decimalPlaces: 2
                        },
                        template: {
                            //height:'250px'
                            // default labels to be applied
                        },
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                },
                                plotOptions: {
                                    column: {
                                        dataLabels: {
                                            enabled: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    allowedFilter: ['year', 'item'],
                    deniedTemplateFilter: [],
                    filter: {
                        List1Codes: ["5000>"],
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                }
            ]
        }

    };
});