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
        whitelist: ['Q', 'QC'],

        // default cofing to be applied to each view
        view: {

            map: {
                leaflet: {
                    zoomControl: false,
                    attributionControl: false,
                    scrollWheelZoom: false,
                    minZoom: 1
                },
                adapter: {
                    adapterType: 'faostat',
                    modelType: 'faostat'
                },
                template: {
                    class: 'test',
                    height: '350px',
                    footer: i18n.map_footer,
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
                    title: "Production quantities by country",
                    subtitle: "Average 1993-2013",
                    addExport: true,
                    export: i18n.export_data
                }
            }

        }

    };
});

