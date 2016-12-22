/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["CISP"],
                "show_lists": false
            },

            items: [


                {
                    // id to be applied on the getData request
                    "id": "countries",
                    "type": "codelist",
                    "parameter": "area",
                    "componentType": {
                        "class": "col-sm-4",
                        "type": "dropDownList",
                        // "multiple": true
                    },
                    "config": {
                        "dimension_id": "countries",
                        "defaultCodes": ["2"],
                        "filter": {
                        }
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "year",
                    "componentType": {
                        "class": "col-sm-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": [],
                        "filter": {
                        }
                    }
                },
                //  C.filter.aggregation
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_code: ['CISP']
            },

            items: [
                /* {
                 type: 'map',
                 class: "col-xs-12",

                 // labels
                 labels: {
                 // labels to dynamically substitute the title and subtitle
                 default: {},

                 // template to be applied to the config.template for the custom object
                 template: {
                 title: {
                 en: "{{item}} {{element}} by country",
                 fr: "{{item}} {{element}} par pays",
                 es: "{{item}} {{element}} por país"
                 },
                 subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                 }
                 },

                 //height:'250px',
                 config: {
                 layer: {},
                 template: {

                 }
                 },
                 allowedFilter: [ 'item', 'year', 'element', 'aggregation'],
                 deniedTemplateFilter: [],
                 filter: {
                 // TODO: remove the area (in theory should be automatically detected from the domain dimensions/schema)
                 area: ["5000>", "351"],
                 element:['6110'],
                 "group_by": 'year',
                 "order_by": 'area'
                 }
                 },
                 */
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels
                    labels: {

                        // labels to dinamically substitute the title and subtitle
                        default: {
                            aggregation: C.i18n.average
                        },

                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Agriculture, Forestry and Fishing Share of Total, {{countries}}"

                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: ['item'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['element','area']
                        },
                        template: {
                            //height:'250px'
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
                    allowedFilter: ['countries','item', 'year', 'element'],
                    deniedTemplateFilter: [],

                    filter: {
                        operator:'AVG',
                        element:['6139'],

                        "group_by": 'year',
                        "order_by": 'value DESC',

                    }
                },

                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Agriculture Orientation Index, {{countries}}"

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
                            seriesDimensions: ['element', 'item', 'area']
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['item', 'year', 'element', 'countries'],
                    //deniedOnLoadFilter: ['area'],
                    filter: {
                        element:['6112']
                    }
                },

                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Investment Ratio, {{countries}}"

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
                            seriesDimensions: ['element', 'item', 'area']
                        },
                        template: {},
                        creator: {}
                    },
                    allowedFilter: ['item', 'year', 'element', 'countries'],
                    //deniedOnLoadFilter: ['area'],
                    filter: {
                        element:['6151']

                    }
                }

            ]
        }

    };
});
