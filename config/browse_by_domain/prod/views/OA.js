/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        filter: {

            defaultFilter: {
                "domain_code": ["OA"],
                "show_lists": false
            },

            items: [
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "year",
                    "componentType": {
                        "class": "col-xs-4 col-sm-4 col-md-2",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": ['2010'],
                        "filter": {
                        }
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_code: ['OA'],
                item: [3010]
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
                                en: "Global population composition (area of residence)",
                                fr: "Composition de la population mondiale par année",
                                es: "Composición mundial de la población por año"
                            },
                            subtitle: "{{year}}"
                        }

                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "pie",
                            xDimensions: null,
                            yDimensions: null,
                            valueDimensions: 'value',
                            seriesDimensions: ['element']
                        },
                        template: {
                            height: '250px'
                        },
                        creator: {}
                    },
                    allowedFilter: ['year'],
                    filter: {
                        area: ["5000"],
                        element: [551, 561]
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Global population dynamics",
                                fr: "Dynamique de la population mondiale",
                                es: "Dinámicas de la población mundial"
                            },
                            subtitle: "1961 - 2010"
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
                    allowedFilter: [],
                    filter: {
                        area: [5000],
                        element: [511, 551, 561],
                        year: [
                            1961,
                            1962,
                            1963,
                            1964,
                            1965,
                            1966,
                            1967,
                            1968,
                            1969,
                            1970,
                            1971,
                            1972,
                            1973,
                            1974,
                            1975,
                            1976,
                            1977,
                            1978,
                            1979,
                            1980,
                            1981,
                            1982,
                            1983,
                            1984,
                            1985,
                            1986,
                            1987,
                            1988,
                            1989,
                            1990,
                            1991,
                            1992,
                            1993,
                            1994,
                            1995,
                            1996,
                            1997,
                            1998,
                            1999,
                            2000,
                            2001,
                            2002,
                            2003,
                            2004,
                            2005,
                            2006,
                            2007,
                            2008,
                            2009,
                            2010
                        ]
                    }
                }
            ]
        }

    }
});