/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["EK"]
            },

            items: [
                {
                    "id": "item",
                    "type": "codelist",
                    // TODO: in theory that should come from the dimensions schema!!
                    "parameter": "List3Codes",
                    "componentType": {
                        "class": "col-sm-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["1746"],
                        "filter": {}
                    }
                },
                {
                    "id": "element",
                    "type": "codelist",
                    "parameter": "List2Codes",
                    "componentType": {
                        "class": "col-sm-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "element",
                        "defaultCodes": ["7211"],
                        "filter": {}
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "List4Codes",
                    "componentType": {
                        "class": "col-sm-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": ['1961'],
                        "filter": {
                        }
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_codes: ['EK'],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                limit: -1,
                decimal_places: 0,
                thousand_separator: ",",
                "null_values": null,
                page_size: 0,
                page_number: 0
            },

            // labels?
            labels: {
                // labels to dinamically substitute the title and subtitle
                default: {
                    aggregation: {
                        "en": "Average",
                        "fr": "Moyenne",
                        "es": "Promedio"
                    }
                }
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

                    // labels
                    labels: {
                        // labels to dinamically substitute the title and subtitle
                        default: {},

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Distribution of {{item}} {{element}} by country",
                                fr: "Répartition de {{item}} {{element}} par pays",
                                es: "Distribución de {{item}} {{element}} por países"
                            },
                            subtitle: "{{aggregation}} {{year}}"
                        }
                    },

                    //height:'250px',
                    config: {
                        layer: {},
                        template: {}
                    },
                    allowedFilter: ['item', 'year', 'element'],
                    deniedTemplateFilter: [],
                    filter: {
                        List1Codes: ["5000>", "351"],
                        "group_by": 'year',
                        "order_by": 'area',
                        operator: 'avg'
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
                                en: "Percentage of {{item}} {{element}} by continent",
                                fr: "Pourcentage de {{item}} {{element}} par continent",
                                es: "Porcentaje del del {{item}} {{element}} por continente"
                            },
                            subtitle: "{{aggregation}} {{year}}"
                        }

                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: "area",
                            yDimensions: "unit",
                            valueDimensions: 'value',
                            seriesDimensions: ['item', 'element'],
                            decimalPlaces: 2
                        },
                        template: {},
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                }
                            }
                        }
                    },
                    allowedFilter: ['year', 'item', 'element'],
                    filter: {
                        List1Codes: ["5100", "5200", "5300", "5400", "5500"],
                        "group_by": 'year',
                        "order_by": 'area',
                        "operator": 'avg'
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
                                en: "Trend of {{item}} {{element}} by continent",
                                fr: "Evolution de {{item}} {{element}}  par continent",
                                es: "Tendencia de {{item}} {{element}}  por continente"
                            },
                            subtitle: "{{year}}"
                        }

                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "timeserie",
                            xDimensions: "year",
                            yDimensions: "unit",
                            valueDimensions: 'value',
                            seriesDimensions: ['area'],
                            decimalPlaces: 2
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['year', 'item', 'element'],
                    filter: {
                        List1Codes: ["5000", "5100", "5200", "5300", "5400", "5500"],
                        "order_by": 'area'
                    }
                }
            ]
        }

    }
});