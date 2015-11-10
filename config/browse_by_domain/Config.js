/*global define*/
define(function () {

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
                }
            },
            chart: {
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
                }
            }

        }

    };
});

