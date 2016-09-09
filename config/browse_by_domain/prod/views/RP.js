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
                    "parameter": "area",
                    "componentType": {
                        "class": "col-xs-6 col-sm-6 col-md-4",
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
                    "parameter": "year",
                    "componentType": {
                        "class": "col-xs-4 col-sm-4 col-md-2",
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
                domain_code: ['RP']
            },

            items: [
                {
                    type: 'chart',
                    class: "col-md-12",

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
                        element: [5161],
                        item: [1309, 1320, 1331]
                    }
                }
            ]
        }

    }
});