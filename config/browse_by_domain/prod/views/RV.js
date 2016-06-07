/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    var i18n = C.i18n || {};

    return {


        "filter": {

            defaultFilter: {
                "domain_code": ["RV"],
                "show_lists": false
            },

            items: [
                {
                    "id": "item",
                    "type": "codelist",
                    "parameter": "List3Codes",
                    //"title": "title",
                    "componentType": {
                        "class": "col-md-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": [],
                        "filter": {
                        }
                    }
                },
                {
                    "id": "element",
                    "type": "codelist",
                    "parameter": "List2Codes",
                    "componentType": {
                        "class": "col-md-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "element",
                        "defaultCodes": [],
                        "filter": {
                        }
                    }
                },
                {
                    "id": "area",
                    "type": "codelist",
                    "parameter": "List1Codes",
                    "componentType": {
                        "class": "col-md-4",
                        "type": "dropDownList"
                        //"multiple": true
                    },
                    "config": {
                        "dimension_id": "area",
                        "defaultCodes": ["5000"],
                        "filter": {
                        }
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "List4Codes",
                    "componentType": {
                        "class": "col-md-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "years",
                        "defaultCodes": ['1990'],
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
                domain_codes: ['RV'],
                List2Codes: ["7231"],
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

            // labels?
            labels: {
                // labels to dinamically substitute the title and subtitle
                default: {
                }
            },

            //bridge configuration
            bridge: {

                type: "faostat"
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
                        template: {
                            title: {
                                en: "{{item}}, {{element}} by country",
                                fr: "{{item}}, {{element}} by country",
                                es: "{{item}}, {{element}} by country"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    //height:'250px',
                    config: {
                        layer: {
                            colorramp: "YlOrRd",
                            intervals: 7
                        },
                        template: {

                        }
                    },
                    allowedFilter: ['item', 'year', 'element', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
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
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "{{area}}, {{item}}",
                                fr: "{{area}}, {{item}}",
                                es: "{{area}}, {{item}}"
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
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['area', 'year', 'item'],
                    filter: {
                        List1Codes: ["5000"],
                        List2Codes: ["2920", "2620"]
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    labels: {
                        template: {
                            title: {
                                en: "{{item}}, {{element}} by continent",
                                fr: "{{item}}, {{element}} par continent",
                                es: "{{item}}, {{element}} por continente"
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
                            seriesDimensions: ['area']
                        },
                        template: {
                            height: '250px'
                        },
                        creator: {}
                    },
                    allowedFilter: ['year', 'item', 'aggregation', 'element'],
                    filter: {
                        List1Codes: ["5100", "5200", "5300", "5400", "5500"],
                        "group_by": 'year',
                        "order_by": 'area'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    labels: {
                        template: {
                            title: {
                                en: "{{area}} {{element}} by fertilizer",
                                fr: "{{area}} {{element}} by fertilizer",
                                es: "{{area}} {{element}} by fertilizer"
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
                            seriesDimensions: ['item']
                        },
                        template: {
                            //height: '250px'
                        },
                        creator: {
                            /* chartObj: {
                             legend: {
                             layout: 'vertical',
                             align: 'right',
                             verticalAlign: 'middle',
                             }
                             }*/
                        }
                    },
                    allowedFilter: ['area', 'year', 'aggregation', 'element'],
                    filter: {
                        List3Codes: ["1360", "1375", "1386", "1397", "1401", "1399", "1398"],
                        "group_by": 'year',
                        "order_by": 'item'
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
                                en: "{{item}}, {{element}}",
                                fr: "{{item}}, {{element}}",
                                es: "{{item}}, {{element}}"
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
                            seriesDimensions: ['item', 'element']
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
                    allowedFilter: ['year', 'item', 'aggregation', 'element'],
                    deniedTemplateFilter: [],
                    filter: {
                        List1Codes: ["5000>"],
                        "group_by": 'year',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                }
            ]
        }

    };
});