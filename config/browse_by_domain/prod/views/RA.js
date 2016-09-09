/*global define*/

define(function () {

    'use strict';

    return {

        filter: {

            defaultFilter: {
                "domain_code": ["RA"],
                "show_lists": false
            },

            items: [
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "year",
                    "componentType": {
                        "class": "hidden",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": [],
                        "filter": {}
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_code: ['RA'],
                element: [5157],
                item: [1360]
            },

            items: [
                {
                    type: 'chart',
                    class: "col-md-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "World fertilizers consumption",
                                fr: "Consomation mondiale d'engrais",
                                es: "Consumo mundial de fertilizantes"
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
                            seriesDimensions: ['area', 'element', 'item']
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['year'],
                    filter: {
                        area: [5000],
                        "order_by": 'year'
                    }
                }
            ]
        }
    }
});