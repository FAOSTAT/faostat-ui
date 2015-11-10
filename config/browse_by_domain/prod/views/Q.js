/*global define*/

define(function () {

    'use strict';

    return {

        "filter": [
            {
                "id": "items",
                "type": "codelist",
                //"title": "title",
                "componentType": {
                    "class": "col-lg-3",
                    "type": "dropDownList"
                },
                "config": {
                    "dimension_id": "items",
                    "defaultCodes": ["221"],
                    "filter": {
                        "domain_code": ["QC"],
                        "whitelist": [],
                        "blacklist": []
                    }
                }
            },
            {
                // id to be applied on the getData request
                "id": "area",
                "type": "codelist",
                "componentType": {
                    <!-- TODO: add a class instead of bootstrap -->
                    "class": "col-lg-3",
                    "type": "dropDownList"
                },
                "config": {
                    "dimension_id": "countries",
                    "defaultCodes": ["2"],
                    "filter": {
                        "domain_code": ["QC"]
                    }
                }
            },
            {
                "id": "year",
                "type": "static",
                "componentType": {
                    "class": "col-lg-2",
                    "type": "dropDownList-timerange"
                },
                "config": {
                    "data": [
                        {"code": "2012", "label": "2012", "selected": true},
                        {"code": "2011", "label": "2011", "selected": false},
                        {"code": "2010", "label": "2010", "selected": false},
                        {"code": "2009", "label": "2009", "selected": false},
                        {"code": "2008", "label": "2008", "selected": false},
                        {"code": "2007", "label": "2007", "selected": false},
                        {"code": "2006", "label": "2006", "selected": false},
                        {"code": "2005", "label": "2005", "selected": false},
                        {"code": "2004", "label": "2004", "selected": false},
                        {"code": "2003", "label": "2003", "selected": false},
                        {"code": "2002", "label": "2002", "selected": false},
                        {"code": "2001", "label": "2001", "selected": false},
                        {"code": "2000", "label": "2000", "selected": false},
                        {"code": "1999", "label": "1999", "selected": false},
                        {"code": "1998", "label": "1998", "selected": false},
                        {"code": "1997", "label": "1997", "selected": false},
                        {"code": "1996", "label": "1996", "selected": false},
                        {"code": "1995", "label": "1995", "selected": false},
                        {"code": "1994", "label": "1994", "selected": false},
                        {"code": "1993", "label": "1993", "selected": false},
                        {"code": "1992", "label": "1992", "selected": false},
                        {"code": "1991", "label": "1991", "selected": false},
                        {"code": "1990", "label": "1990", "selected": true}
                    ]
                }
            },
            {
                "id": "aggregation",
                "type": "static",
                "componentType": {
                    "class": "col-lg-2",
                    "type": "dropDownList"
                },
                "config": {
                    "defaultCodes": ["AVG"],
                    "data": [
                        // TODO: multilingual?
                        {"code": "AVG", "label": "average", "selected": true},
                        {"code": "SUM", "label": "sum", "selected": false}
                    ]
                }
            }
        ],

        //"dashboard": {}



        dashboard: {
            //data cube's uid
            uid: "FAOSTAT_QC",

            //data base filter
            filter: [],

            //bridge configuration
            bridge: {

                type: "d3p"

            },

            metadata: {},

            items:  [
                {
                    //id: 'faostat-QC-1',
                    type: 'map',
                    class: "col-lg-12",
                    //height: "450px",
                    //needed if layout = injected
                    //container: "#faostat-QC-1",
                    config: {
                        //container: "#faostat-QC-1",
                        leaflet: {
                            zoomControl: false,
                            attributionControl: true,
                            scrollWheelZoom: false,
                            minZoom: 2
                        }
                    },
                    // for now it takes the id, TODO: add uid as well
                    allowedFilter: ['year', 'element', 'item'],
                    filter: [
                        {
                            "name": "filter",
                            "parameters": {
                                "rows": {
                                    "year": {
                                        "time": [
                                            {
                                                "from": 2013,
                                                "to": 2013
                                            }
                                        ]
                                    },
                                    "element": {
                                        "codes": [
                                            {
                                                "uid": "FAOSTAT_Elements",
                                                "codes": [
                                                    "5312"
                                                ]
                                            }
                                        ]
                                    },
                                    "item": {
                                        "codes": [
                                            {
                                                "uid": "FAOSTAT_Items",
                                                "codes": [
                                                    "1717"
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    //id: 'faostat-QC-2',
                    type: 'chart',
                    class: "col-lg-6",
                    height: "300px",
                    //needed if layout = injected
                    //container: "#faostat-QC-2",
                    config: {
                        //container: "#faostat-QC-2",
                        adapter: {
                            type: "timeserie",
                            xDimensions: 'time',
                            yDimensions: 'element',
                            valueDimensions: 'value',
                            seriesDimensions: ["element"]
                        },
                        template: {
                            //"title": "Top 25..."
                        },
                        creator: {
                        }
                    },
                    // for now it takes the id, TODO: add uid as well
                    allowedFilter: ['country', 'item', 'element'],
                    filter: [
                        {
                            "name": "filter",
                            "parameters": {
                                "rows": {

                                    "country": {
                                        "codes": [
                                            {
                                                "uid": "FAOSTAT_Countries",
                                                "codes": [
                                                    "33"
                                                ]
                                            }
                                        ]
                                    },
                                    "element": {
                                        "codes": [
                                            {
                                                "uid": "FAOSTAT_Elements",
                                                "codes": [
                                                    "5312"
                                                ]
                                            }
                                        ]
                                    },
                                    "item": {
                                        "codes": [
                                            {
                                                "uid": "FAOSTAT_Items",
                                                "codes": [
                                                    "1717"
                                                ]
                                            }
                                        ]

                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    //id: 'faostat-QC-2',
                    type: 'chart',
                    class: "col-lg-6",
                    height: "450px",
                    //needed if layout = injected
                    //container: "#faostat-QC-2",
                    config: {
                        //container: "#faostat-QC-2",
                        adapter: {
                            type: "timeserie",
                            xDimensions: 'time',
                            yDimensions: 'element',
                            valueDimensions: 'value',
                            seriesDimensions: ["element"]
                        },
                        template: {
                            //"title": "Top 25..."
                        },
                        creator: {
                        }
                    },
                    // for now it takes the id, TODO: add uid as well
                    allowedFilter: ['country', 'item', 'element'],
                    filter: [
                        {
                            "name": "filter",
                            "parameters": {
                                "rows": {

                                    "country": {
                                        "codes": [
                                            {
                                                "uid": "FAOSTAT_Countries",
                                                "codes": [
                                                    "33"
                                                ]
                                            }
                                        ]
                                    },
                                    "element": {
                                        "codes": [
                                            {
                                                "uid": "FAOSTAT_Elements",
                                                "codes": [
                                                    "5312"
                                                ]
                                            }
                                        ]
                                    },
                                    "item": {
                                        "codes": [
                                            {
                                                "uid": "FAOSTAT_Items",
                                                "codes": [
                                                    "1717"
                                                ]
                                            }
                                        ]

                                    }
                                }
                            }
                        }
                    ]
                }

            ]

        }

    }
});