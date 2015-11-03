/*global define*/
define(function () {

    'use strict';

    return {

        timerange: {
            options: {
                bounds: {
                    min: 1961,
                    max: 2050
                },
                defaultValues:{
                    min: 1990,
                    max: 2014
                },
                step: 1
            }
        },

        groups: {
            blacklist: ['P']
        },

        domains: {
            blacklist: ['QD']
        },

        // this will blacklist all the IDs that should not be created as filters
        filters: {
            blacklistCodesID: ['yeargroup']
        },

        series: {
            blacklistCodesID: ['yeargroup']
        },

        // numeber of maximum series shown in the chart
        seriesLimit: 20,

        // chart definition
        chart: {
            model: null,
            adapter: {
                adapterType: 'faostat',
                type: "timeserie",
                xDimensions: 'yeargroup',
                yDimensions: 'unit',
                valueDimensions: 'value',
                seriesDimensions: ['areagroup', 'elementgroup', 'itemgroup']
            },
            template: {},
            creator: {},
            prepareChart: true
        },

        getData: {
            limit:-1,
            null_values:false,
            thousand_separator:",",
            decimal_separator:".",
            decimal_places:2,
            List1Codes: null,
            List2Codes: null,
            List3Codes: null,
            List4Codes: null,
            List5Codes: null,
            List6Codes: null,
            List7Codes: null,
            output_type: 'arrays'
        }

    };
});
