/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        filter: {

            defaultFilter: {
                "domain_code": ["FA"],
                "show_lists": false
            },

            items: [
                {
                    // id to be applied on the getData request
                    "id": "item",
                    "type": "codelist",
                    "parameter": "List3Codes",
                    "componentType": {
                        "class": "col-xs-6 col-sm-3 col-md-3",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "items",
                        "defaultCodes": ["12061"],
                        "filter": {
                        }
                    }
                },
                {
                    "id": "recipientarea",
                    "type": "codelist",
                    "parameter": "List1Codes",
                    "componentType": {
                        "class": "col-xs-6 col-sm-3 col-md-3",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "recipientarea",
                        "defaultCodes": ["5000"],
                        "filter": {}
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "List4Codes",
                    "componentType": {
                        "class": "col-xs-4 col-sm-2 col-md-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": ['2006'],
                        "filter": {
                        }
                    }
                },
                $.extend(true, {}, C.filter.aggregation, {
                    "componentType": {
                        "class": "col-xs-4 col-sm-2 col-md-2"
                    },
                    "config": {
                        "defaultCodes": ["SUM"]
                    }
                })
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_codes: ['FA'],
                List2Codes: ["500"],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                decimal_places: 0,
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
                                "en": "Food aid shipments by country (Total Donors)",
                                "fr": "Expédition d'aides alimentaires par pays (Total donateurs)",
                                "es": "Envíos de ayuda alimentaria por país (Total de donantes)"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },
                    //height:'250px',
                    config: {
                        adapter: {
                            dimensions: {
                                geoDimensions: {
                                    dimension_id: 'recipientarea',
                                    type: 'code'
                                }
                            }
                        },
                        template: {

                        }
                    },
                    allowedFilter: ['item', 'year', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        // TODO: remove the List1Codes (in theory should be automatically detected from the domain dimensions/schema)
                        List1Codes: ["5000>", "351"],
                        "group_by": 'year',
                        "order_by": 'recipientarea'
                    }
                    /*                    bridge: {
                     requestType: 'rankings' // data, rankings
                     }*/
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Food aid shipments {{recipientarea}} (Total Donors)",
                                fr: "Food aid shipments {{recipientarea}} (Total Donors)",
                                es: "Food aid shipments {{recipientarea}} (Total Donors)"
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
                            seriesDimensions: ['item', 'recipientarea', 'donorarea']
                        },
                        template: {
                            // height:'350px'
                            // default labels to be applied
                        },
                        creator: {}
                    },
                    allowedFilter: ['recipientarea', 'year', 'item'],
                    filter: {
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                "en": "Food aid shipments by continent (Total Donors)",
                                "fr": "Expédition d'aides alimentaires par continent (Total donateurs)",
                                "es": "Envíos de ayuda alimentaria por continente (Total de donantes)"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }

                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "pie",
                            xDimensions: null,
                            yDimensions: null,
                            valueDimensions: 'value',
                            seriesDimensions: ['recipientarea']
                        },
                        template: {
                            height: '250px'
                        },
                        creator: {}
                    },
                    allowedFilter: ['year', 'item', 'aggregation'],
                    filter: {
                        // TODO: remove the List1Codes (in theory should be automatically detected from the domain dimensions/schema)
                        List1Codes: ["5100", "5200", "5300", "5400", "5500"],
                        "group_by": 'year, item',
                        "order_by": 'recipientarea'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-6",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Top 10 food aid shipments, {{item}} by country (Total Donors)",
                                fr: "Top 10 food aid shipments, {{item}} by country (Total Donors)",
                                es: "Top 10 food aid shipments, {{item}} by country (Total Donors)"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: ['recipientarea'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['item', 'donorarea']
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
                    allowedFilter: ['year', 'item', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        List1Codes: ["5000>"],
                        "group_by": 'year',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-6",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Top 10 food aid shipments, {{recipientarea}} by item (Total Donors)",
                                fr: "Top 10 food aid shipments, {{recipientarea}} by item (Total Donors)",
                                es: "Top 10 food aid shipments, {{recipientarea}} by item (Total Donors)"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: ['item'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['recipientarea', 'donorarea']
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
                    allowedFilter: ['year', 'recipientarea', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        List3Codes: ["_1"],
                        "group_by": 'year',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                }

            ]
        }

    };
});