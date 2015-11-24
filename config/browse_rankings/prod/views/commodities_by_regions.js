/*global define*/

define(function () {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["QC"]
            },

            items: [
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "List4Codes",
                    "componentType": {
                        "class": "col-lg-2",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "year",
                        //"defaultCodes": [],
                        "filter": {}
                    }
                }
            ]
        },

        dashboard: {

            //data base filter
            defaultFilter: {
                domain_codes: ['QA', 'QC', 'QD', 'QL', 'QP'],
                List2Codes: ["5510"],
                List3Codes: ["_1"],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                "null_values": null,
                filter_list: "1",
                rank_type: 'DESC'
            },

            // labels?
            labels: {
                // labels to dinamically substitute the title and subtitle
                default: {
                    /*aggregation: {
                     en: "Average",
                     fr: "Moyenne",
                     es: "Promedio"
                     },
                     year: "1993 - 2013",
                     area: {
                     "en": "Afghanistan",
                     "fr": "Afghanistan",
                     "es": "Afghanistan"
                     },
                     item: {
                     "en": "Rice, milled",
                     "fr": "Rice, milled",
                     "es": "Rice, milled"
                     }*/
                }
            },


            //bridge configuration
            bridge: {

                type: "faostat",
                requestType: 'rankings' // data, rankings

            },

            metadata: {},

            items: [
                //EXEC Warehouse.dbo.usp_Rank @DomainCode = '(QA,QC,QD,QL,QP)', @List1Codes = '(''2'')', @List2Codes = '(''5510'')', @List3Codes = '(''_1'')', @List4Codes = '(''2013'')', @FilterList = 1, @RankType = 'DESC', @NoResults = 10, @Lang = 'E'
                {
                    type: 'chart',
                    class: "col-xs-6",

                    // labels?
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Production of {{item}} top 5 producers",
                                fr: "Production of {{item}} top 5 producers",
                                es: "Production of {{item}} top 5 producers"
                            },
                            subtitle: "{{aggregation}} {{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: ['element'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area']
                        },
                        template: {
                            height:'250px'
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
                    allowedFilter: ['year', 'item', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        List1Codes: ["5000"],
                        //"order_by": 'value DESC',
                        limit: "10"
                    }
                }

/*
                {
                    type: 'table',
                    class: "col-xs-12 col-md-6",

                    // labels?
                    labels: {
                        // labels to dinamically substitute the title and subtitle
                        default: {},

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Production quantities of {{item}} by country",
                                fr: "Production quantities of {{item}} by country",
                                es: "Production quantities of {{item}} by country"
                            },
                            subtitle: "{{aggregation}} {{year}}"
                        }
                    },


                    //height:'250px',
                    config: {
                        adapter: {
                            columns: ['area', 'value', 'unit'],
                            showCodes: false
                        },
                        template: {
                            height: '350', // important is without px!!
                            tableOptions: {
                                'data-search': true
                            }
                        }
                    },
                    allowedFilter: ['item', 'year', 'element', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        // TODO: remove the List1Codes (in theory should be automatically detected from the domain dimensions/schema)
                        List1Codes: ["5000>"],
                        List2Codes: ["_"],
                        "group_by": 'year',
                        "order_by": 'value DESC',
                        limit: 10
                    }
                },
                {
                    type: 'table',
                    class: "col-xs-12 col-md-6",

                    // labels?
                    labels: {
                        // labels to dinamically substitute the title and subtitle
                        default: {},

                        // temp[late to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Production quantities of {{item}} by country",
                                fr: "Production quantities of {{item}} by country",
                                es: "Production quantities of {{item}} by country"
                            },
                            subtitle: "{{aggregation}} {{year}}"
                        }
                    },


                    //height:'250px',
                    config: {
                        adapter: {
                            columns: ['area', 'value', 'unit', 'flag'],
                            showCodes: false
                        },
                        template: {
                            height: '350', // important is without px!!
                            tableOptions: {
                                'data-search': false
                            }
                        }
                    },
                    allowedFilter: ['item', 'year', 'element', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        // TODO: remove the List1Codes (in theory should be automatically detected from the domain dimensions/schema)
                        List1Codes: ["5000>"],
                        "group_by": 'year',
                        "order_by": 'value ASC',
                        limit: 10
                    }
                }*/
            ]
        }

    }
});