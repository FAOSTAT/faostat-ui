/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        filter: {

            defaultFilter: {
                "domain_code": ["EF"]
            },

            items: [
                {
                    // id to be applied on the getData request
                    "id": "item",
                    "type": "codelist",
                    // TODO: in theory that should come from the dimensions schema!!
                    "parameter": "List3Codes",
                    //"title": "title",
                    "componentType": {
                        <!-- TODO: add a class instead of bootstrap -->
                        "class": "col-lg-3",
                        "type": "dropDownList",
                        "multiple": false
                    },
                    "config": {
                        "dimension_id": "items",
                        "defaultCodes": ["3102"],
                        "filter": {
                        }
                    }
                },
                {
                    "id": "area",
                    "type": "codelist",
                    "parameter": "List1Codes",
                    "componentType": {
                        "class": "col-lg-3",
                        "type": "dropDownList",
                        "multiple": false
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
                        "class": "col-lg-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": ['2002'],
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
                domain_codes: ['EF'],
                List2Codes: ["5159"],
                List5Codes: null,
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

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Fertilizer nutrient use on arable and permanent crop area by country",
                                fr: "Engrais utilisation des éléments nutritifs sur la zone des cultures arables et cultures permanentes par pays",
                                es: "El uso de nutrientes de fertilizantes en el área de los cultivos herbáceos y permanente por país"
                            },
                            subtitle: "{{aggregation}} {{year}}"
                        }
                    },


                    //height:'250px',
                    config: {
                        template: {}
                    },
                    allowedFilter: ['item', 'year', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        // TODO: remove the List1Codes (in theory should be automatically detected from the domain dimensions/schema)
                        List1Codes: ["5000>", "351"],
                        "group_by": 'year',
                        "order_by": 'area'
                    },
                    /*                    bridge: {
                     requestType: 'rankings' // data, rankings
                     }*/
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Trend of fertilizer nutrient use on arable and permanent crop area by continent",
                                fr: "Evolution de l'utilisation des engrais nutritif sur la zone des cultures arables et cultures permanentes par continent",
                                es: "Tendencia del uso de nutrientes de fertilizantes en el área de los cultivos herbáceos y permanente por continente"
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
                    allowedFilter: ['year', 'item'],
                    filter: {
                        List1Codes: ["5100", "5200", "5300", "5400", "5500"],
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
                                en: "Fertilizer nutrient use on arable and permanent crop area (Top 10 Countries)",
                                fr: "Engrais utilisation des éléments nutritifs sur la zone des cultures arables et cultures permanentes (10 pays)",
                                es: "El uso de nutrientes de fertilizantes en el área de los cultivos herbáceos y permanente (10 países)"
                            },
                            subtitle: "{{aggregation}} {{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: ['area'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['element']
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
                        "group_by": 'year, item',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                }
            ]
        }

    }
});