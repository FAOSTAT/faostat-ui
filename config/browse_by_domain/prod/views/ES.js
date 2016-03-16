/*global define*/
define([
    'config/browse_by_domain/Config'
],function (C) {

    'use strict';

    return {

        dashboard: {

            // TODO: this should be automatically added if filter is null
            "render": true,

            //data base filter
            defaultFilter: {
                domain_codes: ['ES'],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                limit: -1,
                decimal_places: 2,
                thousand_separator: ",",
                "null_values": null,
                page_size: 0,
                page_number: 0
            },

            // labels?
            labels: {
            },

            //bridge configuration
            bridge: {

                type: "faostat",
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

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Average carbon content in the topsoil as a % in weight (%) by country in 2008",
                                fr: "La teneur moyenne en carbone dans la couche arable en % en poids (%) par pays en 2008",
                                es: "El contenido promedio de carbono en la capa superior del suelo como un % en peso (%) por país en 2008"
                            },
                            subtitle: "2008"
                        }
                    },

                    //height:'250px',
                    config: {
                        layer: {},
                        template: {}
                    },
                    allowedFilter: [],
                    deniedTemplateFilter: [],
                    filter: {
                        List1Codes: ["5000>", "351"],
                        List2Codes: ["7221"],
                        List3Codes: ["6709"],
                        List4Codes: ["2008"]
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                "en": "Average carbon content in the topsoil as a % in weight (%) in 2008 (Top 10 countries)",
                                "fr": "Average carbon content in the topsoil as a % in weight (%) in 2008 (Top 10 countries)",
                                "es": "Average carbon content in the topsoil as a % in weight (%) in 2008 (Top 10 countries)"
                            },
                            subtitle: "2008"
                        }
                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'area',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['item', 'element'],
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
                    allowedFilter: [],
                    filter: {
                        List1Codes: ["5000>"],
                        List2Codes: ["7221"],
                        List3Codes: ["6709"],
                        List4Codes: ["2008"],
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                },

                {
                    type: 'map',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // labels to dinamically substitute the title and subtitle

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                "en": "Average land degradation in GLASOD erosion degree (degrees) by country in 1991",
                                "fr": "Average land degradation in GLASOD erosion degree (degrees) by country in 1991",
                                "es": "Average land degradation in GLASOD erosion degree (degrees) by country in 1991"
                            },
                            subtitle: "1991"
                        }
                    },

                    //height:'250px',
                    config: {
                        layer: {},
                        template: {}
                    },
                    allowedFilter: [],
                    deniedTemplateFilter: [],
                    filter: {
                        List1Codes: ["5000>", "351"],
                        List2Codes: ["7220"],
                        List3Codes: ["6709"],
                        List4Codes: ["1991"]
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                "en": "Average land degradation in GLASOD erosion degree (degrees) in 1991 (Top 10 countries)",
                                "fr": "Average land degradation in GLASOD erosion degree (degrees) in 1991 (Top 10 countries)",
                                "es": "Average land degradation in GLASOD erosion degree (degrees) in 1991 (Top 10 countries)"
                            },
                            subtitle: "1991"
                        }
                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'area',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['item', 'element'],
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
                    allowedFilter: [],
                    filter: {
                        List1Codes: ["5000>"],
                        List2Codes: ["7220"],
                        List3Codes: ["6709"],
                        List4Codes: ["1991"],
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                },

                {
                    type: 'map',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // labels to dinamically substitute the title and subtitle

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                "en": "Average soil erosion expressed in GLASOD erosion degree (degrees) by country in 1991",
                                "fr": "Average soil erosion expressed in GLASOD erosion degree (degrees) by country in 1991",
                                "es": "Average soil erosion expressed in GLASOD erosion degree (degrees) by country in 1991"
                            },
                            subtitle: "1991"
                        }
                    },

                    //height:'250px',
                    config: {
                        layer: {},
                        template: {}
                    },
                    allowedFilter: [],
                    deniedTemplateFilter: [],
                    filter: {
                        List1Codes: ["5000>", "351"],
                        List2Codes: ["7219"],
                        List3Codes: ["6709"],
                        List4Codes: ["1991"]
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                "en": "Average soil erosion expressed in GLASOD erosion degree (degrees) in 1991 (Top 10 countries)",
                                "fr": "Average soil erosion expressed in GLASOD erosion degree (degrees) in 1991 (Top 10 countries)",
                                "es": "Average soil erosion expressed in GLASOD erosion degree (degrees) in 1991 (Top 10 countries)"
                            },
                            subtitle: "1991"
                        }
                    },
                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'area',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['item', 'element'],
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
                    allowedFilter: [],
                    filter: {
                        List1Codes: ["5000>"],
                        List2Codes: ["7219"],
                        List3Codes: ["6709"],
                        List4Codes: ["1991"],
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                }

            ]
        }

    }
});