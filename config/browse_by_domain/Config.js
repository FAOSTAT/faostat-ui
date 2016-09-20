/*global define*/
define([
    'jquery',
    'globals/Common',
    'config/submodules/fx-chart/highcharts_template',
    'i18n!nls/browse_by_domain'
], function ($, C, HighchartsTemplate, i18n) {

    'use strict';

    return {

        viewsBasePath: 'config/browse_by_domain/prod/views/',

        // default selected code
        defaultCode: 'Q',

        // blacklist groups/domains with no views implemented
        blacklist: ['TM'],

        // temporary whitelist
        whitelist: [
            'Q', 'QC', 'QD', 'QA', 'QL', 'QP', 'QI',
            'T', 'TP', 'TA', //'TM',
            'FB', 'FBS', 'BC', 'BL', 'CC', 'CL',
            'P', 'PI', //'PP'
            'R', 'RL', 'RF', 'RV', 'RP', 'OE',
            'O', 'OA',
            'F', 'FO',
            'I', 'EA', 'RM', 'IG', 'IC',
            'M', 'MK',
            'E', 'EC', 'EF', 'EL', 'EK', 'EP', 'ES', 'EW', //'EE',
            //'AS', 'AF', 'AE',
            'X', 'FA',
            'D', 'FS',
            'G1', 'GE', 'GM', 'GR', 'GU', 'GP', 'GA', 'GV', 'GH', 'GB', 'GN', //'GY'
            'G2', 'GF', 'GC', 'GG', 'GI'
        ],

        i18n: i18n,

        // default aggregation filter.
        // if needed alter the configuration in custom views
        filter: {
            aggregation: {
                "id": "aggregation",
                "type": "static",
                // TODO: check data parameter
                "parameter": "operator",
                "componentType": {
                    "class": "col-xs-4 col-sm-4 col-md-2",
                    "type": "dropDownList"
                },
                "config": {
                    "defaultCodes": ["AVG"],
                    "data": [
                        {"code": "AVG", "label": i18n.average},
                        {"code": "SUM", "label": i18n.sum}
                    ]
                }
            }
        },

        // default config to be applied to each view
        view: {

            map: {
                leaflet: {
                    zoomControl: false,
                    attributionControl: true,
                    scrollWheelZoom: false,
                    touchZoom: true,
                    minZoom: 1
                },
                fenix_ui_map: {
                    usedefaultbaselayers: false
                },
                layer: {
                    //colors: ['#004529', '#238B45', '#74C476', '#E1E1E1', '#74C476', '#FFD34A', '#FF9400', '#DE0000'],
                    //ranges: [-20000,-10000,-1,0, 1,10000,100000],
                    //classification: "custom"

                    //colors: "004529,238B45,74C476,E1E1E1,FFD34A,FF9400,DE0000",
                    //ranges: "-20000,-10000,-1,1,10000,100000"
                    // intervals: 3,
                },
                adapter: {
                    adapterType: 'faostat',
                    modelType: 'faostat',
                    lang: C.getLocale()
                },
                template: {
                    class: '',
                    height: '350px',
                    footer: '<p><i>' + i18n.map_disclaimer + '</i></p>',
                    addExport: true,
                    export: i18n.export_data
                }
            },
            chart: {
                adapter: {
                    adapterType: 'faostat',
                    modelType: 'faostat',
                    decimalPlaces: 2
                },
                creator: {
                    chartObj: HighchartsTemplate
                },
                template: {
                    height: '300px',
                    //title: "Production quantities by country",
                    //subtitle: "Average 1993-2013",
                    addExport: true,
                    export: i18n.export_data
                }
            }

        }

    };
});

