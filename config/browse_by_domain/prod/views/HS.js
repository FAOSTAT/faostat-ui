/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        filter: {

            defaultFilter: {
                "domain_code": ["HS"],
                "show_lists": false
            },

            items: [
                /*{
                    "id": "survey",
                    "type": "codelist",
                    "parameter": "List1Codes",
                    "componentType": {
                        "class": "col-xs-4",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "survey",
                       // "defaultCodes": ["3"],
                        "filter": {}
                    }
                },
               {
                    "id": "breakdownsex",
                    "type": "codelist",
                    "parameter": "List2Codes",
                    "componentType": {
                        "class": "col-xs-4",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "breakdownsex",
                        // "defaultCodes": ["3"],
                        "filter": {}
                    }
                },
                {
                    // id to be applied on the getData request
                    "id": "breakdownvariable",
                    "type": "codelist",
                    "parameter": "List3Codes",
                    "componentType": {
                        "class": "col-xs-4",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "breakdownvariable",
                        //"defaultCodes": ["1882"],
                        "filter": {
                            "show_lists": true
                        }
                    }
                },
                {
                    // id to be applied on the getData request
                    "id": "indicator",
                    "type": "codelist",
                    "parameter": "List2Codes",
                    "componentType": {
                        "class": "col-xs-4",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "indicator",
                       // "defaultCodes": ["64"],
                        "filter": {}
                    }
                },
                {
                    // id to be applied on the getData request
                    "id": "measure",
                    "type": "codelist",
                    "parameter": "List2Codes",
                    "componentType": {
                        "class": "col-xs-4",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "measure",
                        //"defaultCodes": ["64"],
                        "filter": {}
                    }
                }*/
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_codes: ['HS'],
                List3Codes: [20001, 20002],
                List4Codes: [6063],
                List5Codes: [6076],
                List6Codes: null,
                List7Codes: null,
                decimal_places: 2,
                decimal_separator: ".",
                limit: -1,
                thousand_separator: ",",
                "null_values": null,
                // TODO: remove it the page_size!!!
                page_size: 0,
                per_page: 0,
                page_number: 0
            },

            // labels
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
                    type: 'chart',
                    class: "col-md-6",

                    // labels?
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Dietary consumption/acquisition (kcal/person/day) - All Household",
                                fr: "Dietary consumption/acquisition (kcal/person/day) - All Household",
                                es: "Dietary consumption/acquisition (kcal/person/day) - All Household"
                            }
                        }
                    },
                    
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'survey',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['breakdownsex']
                        },
                        template: {
                            height:'450px'
                            // default labels to be applied
                        },
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "bar"
                                },
                                xAxis: {
                                    labels: {
                                        y: 0
                                    }
                                }
                            }
                        }
                    },
                    // allowedFilter: ['breakdownvariable', 'indicator', 'item', 'element'],
                   // allowedFilter: ['breakdownvariable'],
                    filter: {
                        List1Codes: [
                            32005,
                            1462006,
                            1032007,
                            1152004,
                            2082007,
                            1202008,
                            162005,
                            522006,
                            23620042005,
                            1662008,
                            1382008,
                            892006,
                            2172006,
                            2062009,
                            15820072008,
                            11420052006,
                            13020042005,
                            392009
                        ],
                        List2Codes: [20008]
                    }
                },

                {
                    type: 'chart',
                    class: "col-md-6",

                    // labels?
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Dietary consumption/acquisition (kcal/person/day) - Household with children < 5",
                                fr: "Dietary consumption/acquisition (kcal/person/day) - Household with children < 5",
                                es: "Dietary consumption/acquisition (kcal/person/day) - Household with children < 5"
                            }
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'survey',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['breakdownsex']
                        },
                        template: {
                            height:'450px'
                            // default labels to be applied
                        },
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "bar"
                                },
                                xAxis: {
                                    labels: {
                                        y: 0
                                    }
                                }
                            }
                        }
                    },
                    // allowedFilter: ['breakdownvariable', 'indicator', 'item', 'element'],
                    // allowedFilter: ['breakdownvariable'],
                    filter: {
                        List1Codes: [
                            1462006,
                            1032007,
                            1152004,
                            2082007,
                            1202008,
                            162005,
                            522006,
                            23620042005,
                            1662008,
                            1382008,
                            892006,
                            2172006,
                            2062009,
                            15820072008,
                            11420052006,
                            13020042005,
                            392009
                        ],
                        List2Codes: [20030]
                    }
                },

                // FORCE SPACING
                {
                    type: 'custom',
                    class: 'clearfix',
                    config: {
                        template: {},
                        model: {}
                    }
                },

                {
                    type: 'chart',
                    class: "col-md-6",

                    // labels?
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Dietary consumption/acquisition (kcal/person/day) - Household size: One person",
                                fr: "Dietary consumption/acquisition (kcal/person/day) - Household size: One person",
                                es: "Dietary consumption/acquisition (kcal/person/day) - Household size: One person"
                            }
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'survey',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['breakdownsex']
                        },
                        template: {
                            height:'450px'
                            // default labels to be applied
                        },
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "bar"
                                },
                                xAxis: {
                                    labels: {
                                        y: 0
                                    }
                                }
                            }
                        }
                    },
                    // allowedFilter: ['breakdownvariable', 'indicator', 'item', 'element'],
                    // allowedFilter: ['breakdownvariable'],
                    filter: {
                        List1Codes: [
                            1462006,
                            522006,
                            23620042005,
                            1662008,
                            1382008,
                            892006,
                            2172006,
                            11420052006,
                            13020042005
                        ],
                        List2Codes: [20026]
                    }
                },

                {
                    type: 'chart',
                    class: "col-md-6",

                    // labels?
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Dietary consumption/acquisition (kcal/person/day) - Household size: 2 to 4 people",
                                fr: "Dietary consumption/acquisition (kcal/person/day) - Household size: 2 to 4 people",
                                es: "Dietary consumption/acquisition (kcal/person/day) - Household size: 2 to 4 people"
                            }
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'survey',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['breakdownsex']
                        },
                        template: {
                            height:'450px'
                            // default labels to be applied
                        },
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "bar"
                                },
                                xAxis: {
                                    labels: {
                                        y: 0
                                    }
                                }
                            }
                        }
                    },
                    // allowedFilter: ['breakdownvariable', 'indicator', 'item', 'element'],
                    // allowedFilter: ['breakdownvariable'],
                    filter: {
                        List1Codes: [
                            32005,
                            1462006,
                            1032007,
                            1152004,
                            2082007,
                            1202008,
                            162005,
                            522006,
                            23620042005,
                            1662008,
                            1382008,
                            892006,
                            2172006,
                            2062009,
                            15820072008,
                            11420052006,
                            13020042005,
                            392009
                        ],
                        List2Codes: [20024]
                    }
                }

            ]
        }

    };
});