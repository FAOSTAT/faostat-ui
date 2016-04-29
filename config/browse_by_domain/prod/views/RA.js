/*global define*/

define(function () {

    'use strict';

    return {

        dashboard: {

            // TODO: this should be automatically added if filter is null
            "render": true,

            //data base filter
            defaultFilter: {
                domain_codes: ['RA'],
                List2Codes: [5157],
                List3Codes: [1360],
                List4Codes: ["_1"],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                decimal_places: 2,
                decimal_separator: ".",
                limit: -1,
                thousand_separator: ",",
                null_values: null,
                page_size: 0,
                per_page: 0,
                page_number: 0
            },

            // labels?
            labels: {
                // labels to dinamically substitute the title and subtitle
                // TODO: import i18n in the js to be consistent?
                default: {
                    aggregation: {
                         en: "Average",
                         fr: "Moyenne",
                         es: "Promedio"
                     }
                }
            },

            items: [
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "World fertilizers consumption",
                                fr: "Consomation mondiale d'engrais",
                                es: "Consumo mundial de fertilizantes"
                            }
                        }
                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "timeserie",
                            xDimensions: 'year',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area', 'element', 'item']
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: [],
                    filter: {
                        List1Codes: [5000],
                        "order_by": 'year'
                    }
                }
            ]
        }
    }
});