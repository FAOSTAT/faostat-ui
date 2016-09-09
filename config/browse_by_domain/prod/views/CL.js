/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["CL"],
                "show_lists": false
            },

            items: [
                {
                    // id to be applied on the getData request
                    "id": "item",
                    "type": "codelist",
                    "parameter": "item",
                    "componentType": {
                        "class": "col-xs-6 col-sm-6 col-md-3",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["2943"],
                        "filter": {}
                    }
                },
                {
                    "id": "area",
                    "type": "codelist",
                    "parameter": "area",
                    "componentType": {
                        "class": "col-xs-6 col-sm-6 col-md-3",
                        "type": "dropDownList"
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
                    "parameter": "year",
                    "componentType": {
                        "class": "col-xs-4 col-sm-4 col-md-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": ["1993"],
                        "filter": {}
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_code: ['CL']
            },

            items: [{
                    type: 'chart',
                    class: "col-md-6",

                    labels: {
                        template: {
                            title: {
                                en: "Fat supply quantity {{area}}",
                                fr: "La quantité de disponibilité de matière grasse {{area}}",
                                es: "Cantidad de suministro de grasas {{area}}"
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
                            seriesDimensions: ['area', 'item', 'element'],
                            decimalPlaces: 2
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['area', 'year', 'item'],
                    filter: {
                        element: [684],
                        order_by: 'year'
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-6",

                    labels: {
                        template: {
                            title: {
                                en: "Protein supply quantity {{area}}",
                                fr: "La quantité de disponibilité de protéines {{area}}",
                                es: "Cantidad de suministro de proteína {{area}}"
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
                            seriesDimensions: ['area', 'item', 'element'],
                            decimalPlaces: 2
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['area', 'year', 'item'],
                    filter: {
                        element: [674],
                        order_by: 'year'
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-6",

                    labels: {
                        template: {
                            title: {
                                en: "Food supply quantity (kg/capita/yr) {{area}}",
                                fr: "Quantité de la disponibilité alimentaire (kg /habitant/an) {{area}}",
                                es: "Cantidad de suministro de alimentos (kg/persona/año) {{area}}"
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
                            seriesDimensions: ['area', 'item', 'element'],
                            decimalPlaces: 2
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['area', 'year', 'item'],
                    filter: {
                        element: [645],
                        order_by: 'year'
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-6",

                    labels: {
                        template: {
                            title: {
                                en: "Food supply quantity (tonnes) {{area}}",
                                fr: "Quantité de la disponibilité alimentaire (tonnes) {{area}}",
                                es: "Cantidad de suministro de alimentos (toneladas) {{area}}"
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
                            seriesDimensions: ['area', 'item', 'element'],
                            decimalPlaces: 2
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['area', 'year', 'item'],
                    filter: {
                        element: [641],
                        order_by: 'year'
                    }
                }
            ]
        }

    }
});