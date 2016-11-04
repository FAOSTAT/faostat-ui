/*global define*/

define(function () {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["FS"],
                "show_lists": false
            },

            items: [
                {
                    "id": "area",
                    "type": "codelist",
                    "parameter": "area",
                    "componentType": {
                        "class": "col-xs-8 col-sm-6 col-md-4",
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
                        "class": "hidden",
                        "type": "dropDownList-timerange"
                    },
                    "config": {
                        "dimension_id": "year",
                        "filter": {}
                    }
                }

            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_code: ['FS'],
                element: [6120]
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
                                en: "Prevalence of undernourishment (%) - 3 years average",
                                fr: "Prévalence de la sous-alimentation (%) (moyenne sur 3 ans)",
                                es: "Prevalencia de la subalimentación (%) (promedio de 3 años)"
                            },
                            subtitle: "{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'year',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area', 'item'],
                            decimalPlaces: 1
                        },
                        creator: {
                            chartObj: {
                                xAxis: {
                                    labels: {
                                        rotation: -45
                                    }
                                }
                            }
                        },
                        template: {
                        }
                    },
                    allowedFilter: ['area', 'year'],
                    filter: {
                        item: [21004],
                        order_by: 'year'
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
                                en: "Average dietary supply adequacy (%)",
                                fr: "Suffisance des apports énergétiques alimentaires moyens (%) (moyenne sur 3 ans)",
                                es: "Suficiencia del suministro medio de energía alimentaria (%) (promedio de 3 años)"
                            },
                            subtitle: "{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'year',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area', 'item'],
                            decimalPlaces: 1
                        },
                        creator: {
                            chartObj: {
                                xAxis: {
                                    labels: {
                                        rotation: -45
                                    }
                                }
                            }
                        },
                        template: {
                        }
                    },
                    allowedFilter: ['area', 'year'],
                    filter: {
                        item: [21010],
                        order_by: 'year'
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
                                en: "Domestic food price level index (index)",
                                fr: "Indice national des prix des aliments (indice)",
                                es: "Índice nacional de precios de los alimentos (índice)"
                            },
                            subtitle: "{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: 'year',
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area', 'item'],
                            decimalPlaces: 2
                        },
                        creator: {
                            chartObj: {
                                xAxis: {
                                    labels: {
                                        rotation: -45
                                    }
                                }
                            }
                        },
                        template: {
                        }
                    },
                    allowedFilter: ['area', 'year'],
                    filter: {
                        item: [21018],
                        order_by: 'year'
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
                                en: "Percentage of children under 5 years of age who are underweight (%)",
                                fr: "Pourcentage des enfants de moins de 5 ans présentant une insuffisance pondérale (%)",
                                es: "Porcentaje de niños menores de 5 años aquejados de insuciencia ponderal (%)"
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
                            seriesDimensions: ['area', 'item'],
                            decimalPlaces: 2
                        },
                        creator: {
                            chartObj: {
                                chart: {
                                    // type: "column"
                                },
                                xAxis: {
                                    labels: {
                                        rotation: -45
                                    },
                                    ordinal: false
                                },
                                plotOptions: {
                                    series: {
                                        //lineWidth: 0,
                                        connectNulls: false // by default
                                    }
                                }
                            }
                        },
                        template: {
                        }
                    },
                    allowedFilter: ['area', 'year'],
                    filter: {
                        item: [21027],
                        order_by: 'year'
                    }
                }
            ]
        }

    }
});