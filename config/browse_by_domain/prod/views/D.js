/*global define*/

define(function () {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["FS"]
            },

            items: [
                {
                    // id to be applied on the getData request
                    "id": "area",
                    "type": "codelist",
                    "parameter": "List1Codes",
                    "componentType": {
                        <!-- TODO: add a class instead of bootstrap -->
                        "class": "col-lg-5",
                        "type": "dropDownList"
                        //"multiple": true
                    },
                    "config": {
                        "dimension_id": "area",
                        "defaultCodes": ["249"],
                        //"defaultCodes": ["5000"],
                        "filter": {
                        }
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_code: 'FS',
                List2Codes: [6120],
                List4Codes: [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2009, 2010, 2011, 2012],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                decimal_places: 2,
                decimal_separator: ".",
                limit: -1,
                thousand_separator: ",",
                "null_values": null,
                // TODO: remove it the page_size!!!
                page_size: 0,
                per_page: 0,
                page_number: 0
            },

            // labels?
            labels: {

                // labels to dinamically substitute the title and subtitle
                default: {
                }

            },


            //bridge configuration
            bridge: {

                type: "faostat",
                requestType: 'data' // data, rankings

            },

            metadata: {},

            items: [
               /* {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Prevalence of undernourishment (%) - 3 years average",
                                fr: "Prevalence of undernourishment (%) - 3 years average",
                                es: "Prevalence of undernourishment (%) - 3 years average"
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
                            seriesDimensions: ['area', 'item']
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
                        List3Codes: [21004],
                        order_by: 'year'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Average dietary supply adequacy (%)",
                                fr: "Average dietary supply adequacy (%)",
                                es: "Average dietary supply adequacy (%)"
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
                            seriesDimensions: ['area', 'item']
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
                        List3Codes: [21010],
                        order_by: 'year'
                    }
                },
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Domestic food price level index (index)",
                                fr: "Domestic food price level index (index)",
                                es: "Domestic food price level index (index)"
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
                            seriesDimensions: ['area', 'item']
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
                        List3Codes: [21018],
                        order_by: 'year'
                    }
                },*/
                {
                    type: 'chart',
                    class: "col-xs-12",

                    // labels?
                    labels: {
                        // temp[template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Percentage of children under 5 years of age who are underweight (%)",
                                fr: "Percentage of children under 5 years of age who are underweight (%)",
                                es: "Percentage of children under 5 years of age who are underweight (%)"
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
                            seriesDimensions: ['area', 'item']
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
                            },
                            onBefore: function(){},
                        },
                        template: {
                        }
                    },
                    allowedFilter: ['area', 'year'],
                    filter: {
                        List3Codes: [21027],
                        order_by: 'year'
                    }
                }
            ]
        }

    }
});