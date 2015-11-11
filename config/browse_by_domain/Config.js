/*global define*/
define(['jquery', 'config/submodules/fx-chart/highcharts_template'], function ($, HighchartsTemplate) {

    'use strict';

    return {

        viewsBasePath: 'config/browse_by_domain/prod/views/',

        // default selected code
        defaultCode: 'Q',

        // blacklist groups/domains with no views implemented
        blacklist: ['TM'],

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
                }
            },
            chart: {
                adapter: {
                    adapterType: 'faostat',
                    modelType: 'faostat'
                },
                creator: {
                    chartObj: HighchartsTemplate
                }
            }

        }

    };
});

