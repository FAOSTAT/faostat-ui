/*global define*/
define([
    'jquery',
    'config/submodules/fx-chart/highcharts_template',
    'i18n!nls/browse_by_domain'
], function ($, HighchartsTemplate, i18n) {

    'use strict';

    return {

        viewsBasePath: 'config/browse_by_domain/prod/views/',

        // default selected code
        defaultCode: 'Q',

        // blacklist groups/domains with no views implemented
        blacklist: ['TM'],

        // temporary whitelist
        whitelist: [
            'Q', 'QC', 'QD', 'QA',
            'T', 'TP', 'TA',
            'FB', 'FBS', 'BC', 'BL', 'CC', 'CL',
            'I', 'EA',
            'R', 'RL',
            'D', 'FS',
            'G1', 'GE'
        ],

        // default cofing to be applied to each view
        view: {

            map: {
                leaflet: {
                    zoomControl: false,
                    attributionControl: true,
                    scrollWheelZoom: false,
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
                    modelType: 'faostat'
                },
                template: {
                    class: 'test',
                    height: '350px',
                    footer: '<p>' + i18n.map_footer + '</p>',
                    addExport: true,
                    export: i18n.export_data
                }
            },
            chart: {
                adapter: {
                    adapterType: 'faostat',
                    modelType: 'faostat'
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

