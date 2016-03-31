/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["RP"],
                "show_lists": false
            },

            items: [
                {
                    "id": "area",
                    "type": "codelist",
                    // TODO: in theory that should come from the dimensions schema!!
                    "parameter": "List1Codes",
                    //"title": "title",
                    "componentType": {
                        "class": "col-lg-3",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "area",
                        "defaultCodes": ["11"],
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
                        "defaultCodes": ['1993'],
                        "filter": {
                        }
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_codes: ['RP'],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                limit: -1,
                "null_values": null,
                page_size: 0,
                per_page: 0
            },

            // labels?
            labels: {
                // labels to dinamically substitute the title and subtitle
                default: {}
            },


            //bridge configuration
            bridge: {

                type: "faostat",
                //requestType: 'data' // data, rankings

            },

            metadata: {},

            items: [
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels
                    labels: {
                        default: {
                            footer: {
                                en: "<small><b>Data are expressed in formulated products for the following countries</b><br><i>Algeria, Bahamas, Bangladesh, Bhutan, Cyprus, Fiji, Jamaica, Mauritius, Mexico, Montenegro, Occupied Palestinian Territory, Panama, Republic of Korea, Serbia and Montenegro, Slovakia, Syrian Arab Republic, Trinidad and Tobago</i></small>",
                                fr: "<small><b>Data are expressed in formulated products for the following countries</b><br><i>Algeria, Bahamas, Bangladesh, Bhutan, Cyprus, Fiji, Jamaica, Mauritius, Mexico, Montenegro, Occupied Palestinian Territory, Panama, Republic of Korea, Serbia and Montenegro, Slovakia, Syrian Arab Republic, Trinidad and Tobago</i></small>",
                                es: "<small><b>Data are expressed in formulated products for the following countries</b><br><i>Algeria, Bahamas, Bangladesh, Bhutan, Cyprus, Fiji, Jamaica, Mauritius, Mexico, Montenegro, Occupied Palestinian Territory, Panama, Republic of Korea, Serbia and Montenegro, Slovakia, Syrian Arab Republic, Trinidad and Tobago</i></small>",
                            }
                        },

                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Pesticides use, {{area}}",
                                fr: "Consommation de pesticides, {{area}} ",
                                es: "Consumo de plaguicidas, {{area}} "
                            },
                            subtitle: "{{year}}",
                            footer: "{{{footer}}}footer"
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
                        template: {
                            // height:'350px'
                            // default labels to be applied
                        },
                        creator: {}
                    },
                    allowedFilter: ['area', 'year'],
                    filter: {
                        List2Codes: [5161],
                        List3Codes: [1309, 1320, 1331]
                    }
                }
            ]
        }

    }
});