/*global define*/

define(function () {

    'use strict';

    return {

        "filter": [
            {
                "id": "items",
                "type": "codelist",
                // TODO: in theory that should come from the dimensions schema!!
                "parameter": "List3Codes",
                //"title": "title",
                "componentType": {
                    "class": "col-lg-3",
                    "type": "dropDownList"
                },
                "config": {
                    "dimension_id": "items",
                    "defaultCodes": ["515"],
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
                "parameter": "List1Codes",
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
                "parameter": "List4Codes",
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
                // TODO: check data parameter
                "parameter": "aggregation",
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

        dashboard: {

            //data base filter
            filter: {
                lang: 'en',
                datasource: 'production',
                decimal_places: 2,
                decimal_separator: ".",
                limit: -1,
                thousand_separator: ",",
                "null_values": null
            },

            //bridge configuration
            bridge: {

                type: "faostat"

            },

            metadata: {},

            items:  [
                {
                    //id: 'faostat-QC-1',
                    type: 'map',
                    class: "col-lg-12",
                    height:'250px',
                    config: {
                        leaflet: {
                            zoomControl: false,
                            attributionControl: true,
                            scrollWheelZoom: false,
                            minZoom: 1
                        },
                        adapter: {
                            adapterType: 'faostat',
                            modelType: 'faostat'
                        }
                    },
                    // for now it takes the id, TODO: add uid as well
                    allowedFilter: ['aggregation', 'item'],
                    filter:
                        {
                            domain_code: 'QC',
                            List1Codes: ["5000>"],
                            List2Codes: ["2510"],
                            List3Codes: ["515"],
                            List4Codes: ["2011"],
                            List5Codes: null,
                            List6Codes: null,
                            List7Codes: null
                        }
                }

            ]

        }

    }
});