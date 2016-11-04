/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        filter: {

            defaultFilter: {
                "domain_code": ["EA"],
                "show_lists": false
            },

            items: [
                {
                    "id": "donor",
                    "type": "codelist",
                    "parameter": "donor",
                    "componentType": {
                        "class": "col-md-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "donor",
                        "defaultCodes": ["702"],
                        "filter": {}
                    }
                },
                {
                    "id": "recipientarea",
                    "type": "codelist",
                    "parameter": "recipientarea",
                    "componentType": {
                        "class": "col-md-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "recipientarea",
                        "defaultCodes": ["2"],
                        "filter": {}
                    }
                },
                {
                    "id": "item",
                    "type": "codelist",
                    "parameter": "item",
                    "componentType": {
                        "class": "col-md-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "item",
                        "defaultCodes": ["22040"],
                        "filter": {
                            "whitelist": ["22040", "22050"]
                        }
                    }
                },
                {
                    "id": "purpose",
                    "type": "codelist",
                    "parameter": "purpose",
                    "componentType": {
                        "class": "col-md-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "analyticalagg",
                        "defaultCodes": ["310"],
                        "filter": {}
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "year",
                    "componentType": {
                        "class": "col-md-2",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "defaultCodes": ['1995'],
                        "filter": {}
                    }
                },
                C.filter.aggregation,
                {
                    "id": "element",
                    "type": "codelist",
                    "parameter": "element",
                    "componentType": {
                        "class": "hidden",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "element",
                        "defaultCodes": ["6137"],
                        "filter": {}
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_code: ['EA']
            },

            // labels?
            labels: {
                // labels to dinamically substitute the title and subtitle
                default: {
                }
            },

            items: [
                {
                    type: 'map',
                    class: "col-xs-12",
                    labels: {
                        default: {},
                        template: {
                            title: {
                                en: "Development flows of {{donor}} to {{purpose}} in {{element}}",
                                fr: "Flux de développement de {{donor}} vers {{purpose}} en {{element}}",
                                es: "Flujos de desarrollo de {{donor}} hacia {{purpose}} en {{element}}"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },
                    config: {
                        template: {},
                        adapter: {
                            dimensions: {
                                geoDimensions: {
                                    dimension_id: 'recipientarea',
                                    type: 'code'
                                }
                            }
                        },
                        layer: {}
                    },
                    allowedFilter: ['donor', 'item', 'year', 'purpose', 'aggregation', 'element'],
                    deniedTemplateFilter: [],
                    filter: {
                        recipientarea: ["5000>", "351"],
                        "group_by": 'year',
                        "order_by": 'recipientarea'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",
                    labels: {
                        template: {
                            title: {
                                en: "Development flow types of {{donor}} to {{purpose}} in {{recipientarea}} {{element}}",
                                fr: "Types de flux de développement de {{donor}} vers {{purpose}} en {{recipientarea}} {{element}}",
                                es: "Tipos de flujo de desarrollo de {{donor}} hacia {{purpose}} en {{recipientarea}} {{element}}"
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
                            seriesDimensions: ['recipientarea', 'item', 'element'],
                            decimalPlaces: 2
                        },
                        template: {
                        },
                        creator: {}
                    },
                    allowedFilter: ['donor', 'element', 'year', 'purpose', 'recipientarea'],
                    filter: {
                        item: ["22040", "22050"],
                        order_by: "year ASC"
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",
                    labels: {
                        template: {
                            title: {
                                en: "Top 10 recipients of {{donor}} in {{element}}",
                                fr: "10 bénéficiaires principaux de {{donor}} en {{element}}",
                                es: "Los 10 receptores principales de {{donor}} en {{element}}"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: ['recipientarea'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['donor'],
                            decimalPlaces: 2
                        },
                        template: {},
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                }
                            }
                        }
                    },
                    allowedFilter: ['donor', 'item', 'element', 'year', 'purpose', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        recipientarea: ["5000>"],
                        "group_by": 'year',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",
                    labels: {
                        template: {
                            title: {
                                en: "Top 10 donors to {{recipientarea}} in {{element}}",
                                fr: "10 donateurs principaux vers {{recipientarea}} en {{element}}",
                                es: "Los 10 donantes principales hacia {{recipientarea}} en {{element}}"
                            },
                            subtitle: "{{#isMultipleYears year aggregation}}{{/isMultipleYears}}{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: ['donor'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['recipientarea'],
                            decimalPlaces: 2
                        },
                        template: {},
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                }
                            }
                        }
                    },
                    allowedFilter: ['recipientarea', 'item', 'element', 'year', 'purpose', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        // TODO: fix it with level 5
                        donor: ["690>", "691>", "692>"],
                        "group_by": 'year',
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                }
            ]
        }
    };
});