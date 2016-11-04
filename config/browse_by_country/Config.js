/*global define*/
define([
    'jquery',
    'globals/Common',
    'config/submodules/fx-chart/highcharts_template',
    'i18n!nls/browse_by_domain'
], function ($, C, HighchartsTemplate, i18n) {

    'use strict';

    return {

        viewsBasePath: 'config/browse_by_country/prod/',

        syb: {
            url: 'http://fenixservices.fao.org/faostat/static/syb/syb_{{code}}.pdf',
            url_world: 'http://fenixservices.fao.org/faostat/static/syb/syb_5000.pdf'
        },

        // default Domain Code used to retrieve the country lists
        countriesDomainCode: 'QC',
        countriesDimensionID: 'countries',
        countriesBlacklist: [
            228,
        ],
        

        map: {
            leaflet: {
                zoomControl: false,
                attributionControl: true,
                scrollWheelZoom: false,
                touchZoom: true,
                minZoom: 1
            },
            fenix_ui_map: {
                usedefaultbaselayers: false,
                plugins: {
                    disclaimerfao: false,
                    geosearch: false,
                    mouseposition: false,
                    controlloading : true,
                    zoomcontrol: 'bottomright',
                    scalecontrol: false
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
                    scrollWheelZoom: true,
                    touchZoom: true,
                    minZoom: 1
                },
                adapter: {
                    adapterType: 'faostat',
                    modelType: 'faostat',
                    lang: C.getLocale()
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
                    modelType: 'faostat',
                    decimalPlaces: 2
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

