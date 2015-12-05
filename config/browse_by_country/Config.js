/*global define*/
define([
    'jquery',
    'config/submodules/fx-chart/highcharts_template',
    'i18n!nls/browse_by_domain'
], function ($, HighchartsTemplate, i18n) {

    'use strict';

    return {

        viewsBasePath: 'config/browse_by_country/prod/',

        // default Domain Code used to retrieve the country lists
        countriesDomainCode: 'QC',
        countriesDimensionID: 'countries',

        map: {
            leaflet: {
                zoomControl: false,
                attributionControl: true,
                scrollWheelZoom: false,
                minZoom: 1
            },
            fenix_ui_map: {
                usedefaultbaselayers: false,
                plugins: {
                    disclaimerfao: false,
                    geosearch: false,
                    mouseposition: false,
                    controlloading : true,
                    zoomcontrol: 'bottomright'
                },
                guiController: {
                    overlay: false,
                    baselayer: false,
                    wmsLoader: false
                },
                gui: {
                    disclaimerfao: false
                }
            },
            zoomn: {
                layer: 'gaul0_faostat_3857',
                column: 'faost_code'
            }

        },

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
                    height: '250px',
                    addExport: true,
                    export: i18n.export_data
                }
            },

            table: {
                adapter: {},
                template: {
                    addExport: true,
                    export: i18n.export_data
                }
            }



        }

    };
});

