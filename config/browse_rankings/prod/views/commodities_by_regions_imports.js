/*global define*/

define(function () {

    'use strict';

    return {

        "filter": {

            defaultFilter: {
                "domain_code": ["TP"]
            },

            items: [
                {
                    // id to be applied on the getData request
                    "id": "area",
                    "type": "codelist",
                    "parameter": "List1Codes",
                    "componentType": {
                        "class": "col-md-4",
                        "type": "dropDownList"
                    },
                    "config": {
                        "dimension_id": "regions",
                        "defaultCodes": ["5000"],
                        "filter": {
                        }
                    }
                },
                {
                    "id": "year",
                    "type": "codelist",
                    "parameter": "List4Codes",
                    "componentType": {
                        "class": "col-md-2",
                        "type": "dropDownList"
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
                List3Codes: ["_1"],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                decimal_places:4,
                "null_values": false,
                filter_list: "1",
                rank_type: 'DESC'
            },

            // labels
            labels: {
                // labels to dinamically substitute the title and subtitle
                default: {
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
                    class: "col-md-6",

                    // labels
                    labels: {
                        // template to be applied to the config.template for the custom object
                        template: {
                            title: {
                                en: "Top 10 Commodities, Import quantity in {{area}}",
                                fr: "Top 10 Commodities, Import quantity in {{area}}",
                                es: "Top 10 Commodities, Import quantity in {{area}}"
                            },
                            subtitle: "{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: ['item'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area', 'element']
                        },
                        template: {
                            height:'275px'
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
                    allowedFilter: ['area', 'year', 'item', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        domain_codes: ['TP'],
                        List2Codes: ["5610"],
                        limit: "10"
                    }
                },
                {
                    type: 'chart',
                    class: "col-md-6",

                    // labels
                    labels: {
                        template: {
                            title: {
                                en: "Top 10 Commodities, Import Value in {{area}}",
                                fr: "Top 10 Commodities, Import Value in {{area}}",
                                es: "Top 10 Commodities, Import Value in {{area}}"
                            },
                            subtitle: "{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            adapterType: 'faostat',
                            type: "standard",
                            xDimensions: ['item'],
                            yDimensions: 'unit',
                            valueDimensions: 'value',
                            seriesDimensions: ['area', 'element']
                        },
                        template: {
                            height:'275px'
                        },
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                }
                            }
                        }
                    },
                    allowedFilter: ['area', 'year', 'item', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        domain_codes: ['TP'],
                        List2Codes: ["5622"],
                        limit: "10"
                    }
                },

                // FORCE SPACING
                {
                    type: 'custom',
                    class: 'clearfix',
                    config: {
                        template: {},
                        model: {}
                    }
                },

                {
                    type: 'table',
                    class: "col-md-12",

                    // labels
                    labels: {
                        template: {
                            title: {
                                en: "Top 20 Commodities, Import Quantity in {{area}}",
                                fr: "Top 20 Commodities, Import Quantity in {{area}}",
                                es: "Top 20 Commodities, Import Quantity in {{area}}"
                            },
                            subtitle: "{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            columns: ['item', 'year', 'value', 'unit'],
                            showCodes: false
                        },
                        template: {
                            tableOptions: {
                                'data-search': true,
                                'data-show-header': false
                            }
                            // height: '300'
                        }
                    },
                    allowedFilter: ['area', 'year', 'item', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        domain_codes: ['TP'],
                        List2Codes: ["5610"],
                        limit: "20"
                    }
                },


                {
                    type: 'table',
                    class: "col-md-12",

                    // labels?
                    labels: {
                        template: {
                            title: {
                                en: "Top 20 Commodities, Import Value in {{area}}",
                                fr: "Top 20 Commodities, Import Value in {{area}}",
                                es: "Top 20 Commodities, Import Value in {{area}}"
                            },
                            subtitle: "{{year}}"
                        }
                    },

                    config: {
                        adapter: {
                            columns: ['item', 'year', 'value', 'unit'],
                            showCodes: false
                        },
                        template: {
                            tableOptions: {
                                'data-search': true,
                                'data-show-header': false
                            }
                            // height: '300'
                        }
                    },
                    allowedFilter: ['area', 'year', 'item', 'aggregation'],
                    deniedTemplateFilter: [],
                    filter: {
                        domain_codes: ['TP'],
                        List2Codes: ["5610"],
                        limit: "20"
                    }
                }

            ]
        }

    };
});