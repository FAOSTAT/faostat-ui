/*global define*/

define(function () {

    'use strict';

    return {

        download: {
            "target": "1.FOREST AREA AND CHARACTERISTICS.zip"
        },

        filter: [
            {
                "type": "distinct",
                "uid": "FLUDE_TOPIC_1",
                "column": "indicator",
                "containerType": "baseContainer",
                "title": "Indicator",
                "defaultCodes": ["Forest"],
                "components": [
                    {
                        "type": "codelist",
                        "componentType": "dropDownList-FENIX",
                        "lang": "EN",
                        "uid" : "FLUDE_INDICATORS",
                        "title": {"EN": "Distinct"},
                        // name is the ID output in tehe filter getValues()
                        "name": "indicator",
                        "config": {
                            "defaultsource": []
                        }

                    }
                ]
            },
            {
                "type": "static",
                "containerType": "baseContainer",
                "title": "Year",
                "components": [
                    {
                        "type": "time",
                        "componentType": "dropDownList-FENIX",
                        "lang": "EN",
                        "title": {"EN": "Year"},
                        "name": "year",
                        config: {
                            "defaultsource": [
                                {"value": "2015", "label": "2015", "selected": true},
                                {"value": "2010", "label": "2010", "selected": false},
                                {"value": "2005", "label": "2005", "selected": false},
                                {"value": "2000", "label": "2000", "selected": false},
                                {"value": "1990", "label": "1990", "selected": false}
                            ]
                        }
                    }
                ]
            },
            {
                "type": "codelist",
                "containerType": "baseContainer",
                "title": "Domains",
                "components": [
                    {
                        "uid": "FLUDE_DOMAINS",
                        "type": "codelist",
                        "name": "domain",
                        "componentType": "dropDownList-FENIX",
                        "lang": "EN",
                        "title": {"EN": "Codelist"},

                        config: {
                            "defaultsource": [
                                //{"value": null, "label": "All", "selected": true},
                                //{"value": null, "label": "All", "selected": true, "removeFilter": true},
                            ],
                            "enableMultiselection": true
                        }
                    }
                ]
            },
            {
                "type": "codelist",
                "containerType": "baseContainer",
                "title": "Incomes",
                "components": [
                    {
                        "uid": "FLUDE_INCOMES",
                        "type": "codelist",
                        "componentType": "dropDownList-FENIX",
                        "lang": "EN",
                        "title": {"EN": "Codelist"},
                        "name": "incomes",
                        config: {
                            "defaultsource": [
                                //{"value": null, "label": "All", "selected": true},
                            ],
                            "enableMultiselection": true
                        }
                    }
                ]
            },
            {
                "type": "codelist",
                "containerType": "baseContainer",
                "title": "Subregions",
                "components": [
                    {
                        "uid": "FLUDE_SUBREGIONS",
                        "type": "codelist",
                        "componentType": "dropDownList-FENIX",
                        "lang": "EN",
                        "title": {"EN": "Codelist"},
                        "name": "subregion",
                        config: {
                            "defaultsource": [
                                //{"value": null, "label": "All", "selected": true},
                            ],
                            "enableMultiselection": true
                        }
                    }
                ]
            }
        ],

        dashboard: {
            //data cube's uid
            uid: "FLUDE_TOPIC_1",

            //data base filter
            filter: [],

            //bridge configuration
            bridge: {

                type: "d3p"

            },

            /*
             * in case bridge is WDS this is the cube metadata.
             * if bridge is D3P this is ignored
             * */
            metadata: {},

            items: [
              /*  {
                    id: 'item-1',
                    type: 'map',
                    class: "fx-map-chart",
                    //needed if layout = injected
                    container: "#item-1",
                    config: {
                        container: "#item-1",
                        leaflet: {
                            zoomControl: false,
                            attributionControl: true,
                            scrollWheelZoom: false,
                            minZoom: 2
                        }
                    },
                    // for now it takes the id, TODO: add uid as well
                    allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                    forbiddenValues: {
                        year: {time: [{from: 2015, to: 2015}]},
                        domain: {removeFilter: true}
                    },
                    filter: [
                        {
                            "name": "filter",
                            "parameters": {
                                "rows": {
                                    "year": {
                                        "time": [
                                            {
                                                "from": 2015,
                                                "to": 2015
                                            }
                                        ]
                                    },
                                    "indicator": {
                                        "codes": [
                                            {
                                                "uid": "FLUDE_INDICATORS",
                                                "codes": [
                                                    "Forest"
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                },*/
                {
                    id: 'item-2',
                    type: 'chart',
                    class: "fx-timeseries-ecample",
                    //needed if layout = injected
                    //container: "#item-2",
                    config: {
                        //container: "#item-2",
                        adapter: {
                            type: "standard",
                            xDimensions: 'time',
                            yDimensions: 'element',
                            valueDimensions: 'value',
                            seriesDimensions: ['country']
                        },
                        template: {
                            //"title": "Top 25..."
                        },
                        creator: {
                            chartObj: {
                                chart: {
                                    type: "column"
                                },
                                tooltip: {
                                    valueSuffix: ' 1000 HA'
                                }
                            }
                        }
                    },
                    // for now it takes the id, TODO: add uid as well
                    allowedFilter: ['indicator', 'year', 'domain', 'incomes', 'subregion'],
                    filter: [
                        {
                            "name": "filter",
                            "parameters": {
                                "rows": {
                                    "year": {
                                        "time": [
                                            {
                                                "from": 2015,
                                                "to": 2015
                                            }
                                        ]
                                    },
                                    "indicator": {
                                        "codes": [
                                            {
                                                "uid": "FLUDE_INDICATORS",
                                                "codes": [
                                                    "Forest"
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            "name": "order",
                            "parameters": {
                                "value": "DESC"
                            }
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 25,
                                "page": 1
                            }
                        }
                    ]
                }

            ]
        }

    }
});