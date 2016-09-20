/*global define*/
define([
    'config/browse_by_domain/Config',
    'i18n!nls/browse_by_domain'
],function (C, i18n) {

    'use strict';

    return {

        filter: {

            defaultFilter: {
                "domain_code": ["AE"],
                "show_lists": false
            },

            items: [
                {
                    "id": "area",
                    "type": "codelist",
                    "parameter": "area",
                    "componentType": {
                        "class": "col-md-3",
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
                    "parameter": "year",
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
                domain_code: 'AE'
            },

            // labels
            labels: {},

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
                        // TODO: remove the area (in theory should be automatically detected from the domain dimensions/schema)
                        area: ["5000>", "351"],
                        element: ["6085"],
                        item: ["23045"],
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
                        element: ["6085"],
                        item: ["23045"]
                    }
                }
            ]
        }

    };
});