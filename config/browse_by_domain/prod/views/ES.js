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
                domain_code: ['ES']
            },

            items: [
                {
                    type: 'map',
                    class: "col-xs-12",

                    // labels
                    labels: {
                        // labels to dynamically substitute the title and subtitle

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
                        area: ["5000>", "351"],
                        element: ["7221"],
                        item: ["6709"],
                        year: ["2008"]
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
                                "fr": "La teneur moyenne en carbone dans la couche arable en % en poids (%) en 2008 (10 pays principaux)",
                                "es": "El contenido promedio de carbono en la capa superior del suelo como un % en peso (%) en 2008 (Los 10 países principales)"
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
                        area: ["5000>"],
                        element: ["7221"],
                        item: ["6709"],
                        year: ["2008"],
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
                                "fr": "Dégradation des terres moyenne exprimée en degré GLASOD d'érosion (degré) par pays en 1991",
                                "es": "Promedio de degradación de la tierra en grados de erosión GLASOD (grados) por país en 1991"
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
                        area: ["5000>", "351"],
                        element: ["7220"],
                        item: ["6709"],
                        year: ["1991"]
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
                                "fr": "Dégradation des terres moyenne exprimée en degré GLASOD d'érosion (degré) par pays en 1991 (10 pays principaux)",
                                "es": "Promedio de degradación de la tierra en grados de erosión GLASOD (grados) por país en 1991 (Los 10 países principales)"
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
                        area: ["5000>"],
                        element: ["7220"],
                        item: ["6709"],
                        year: ["1991"],
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
                                "fr": "Érosion des sols moyenne exprimée en degré GLASOD d'érosion (degré) par pays en 1991",
                                "es": "Promedio de degradación de la tierra en grados de erosión GLASOD (grados) por país en 1991"
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
                        area: ["5000>", "351"],
                        element: ["7219"],
                        item: ["6709"],
                        year: ["1991"]
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
                                "fr": "Érosion des sols moyenne exprimée en degré GLASOD d'érosion (degré) par pays en 1991 (10 pays principaux)",
                                "es": "Promedio de degradación de la tierra en grados de erosión GLASOD (grados) por país en 1991 (Los 10 países principales)"
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
                        area: ["5000>"],
                        element: ["7219"],
                        item: ["6709"],
                        year: ["1991"],
                        "order_by": 'value DESC',
                        "limit": '10'
                    }
                }

            ]
        }

    }
});