/*global define*/
define([
    'config/browse_by_domain/Config',
    'i18n!nls/browse_by_domain'
],function (C, i18n) {

    'use strict';

    return {

        filter: {

            defaultFilter: {
                "domain_code": ["AE"]
            },

            items: [
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
                        "defaultCodes": ["4"],
                        "filter": {
                            "show_lists": false
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
                        "defaultCodes": ['2000'],
                        "filter": {
                            "show_lists": false
                        }
                    }
                },
                C.filter.aggregation
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_codes: ['AF'],
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

            // labels
            labels: {},

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

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                "en": "Number of agricultural researchers (FTE) by country",
                                "fr": "Number of agricultural researchers (FTE) by country",
                                "es": "Number of agricultural researchers (FTE) by country"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },


                    //height:'250px',
                    config: {
                        template: {
                            // TODO: hardcoded ASTI disclaimer
                            footer: '<p>' + i18n.map_footer + '<br><i>ASTI (Agricultural Science and Technology Indicators). 2015. ASTI database. International Food Policy Research Institute, Washington, DC. (see <a href="http://www.asti.cgiar.org" target="_blank">asti.cgiar.org</a>).</i></p>'
                        }
                    },
                    allowedFilter: ['item', 'year', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        // TODO: remove the List1Codes (in theory should be automatically detected from the domain dimensions/schema)
                        List1Codes: ["5000>", "351"],
                        List2Codes: ["6085"],
                        List3Codes: ["23046"],
                        "group_by": 'year',
                        "order_by": 'area'
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
                                "en": "Number of agricultural researchers (FTE) by country",
                                "fr": "Number of agricultural researchers (FTE) by country",
                                "es": "Number of agricultural researchers (FTE) by country"
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
                    filter: {
                        List2Codes: ["6085"],
                        List3Codes: ["23046"]
                    }
                }
            ]
        }

    };
});