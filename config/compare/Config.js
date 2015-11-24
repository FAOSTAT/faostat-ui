    /*global define*/
define([
    'i18n!nls/compare'
],function (i18n) {

    'use strict';

    return {

        timerange: {
            options: {
                bounds: {
                    min: 1961,
                    max: 2050
                },
                defaultValues:{
                    min: 1961,
                    max: 2013
                },
                step: 1
            }
        },

        // TODO: DO THE BLACKLIST!!!!!
        groups: {
            blacklist: [
                //'D', // (FS, HS) it doesn't have yearly data
            ]
        },

        domains: {
            blacklist: [
                //'FS', // it doesn't have yearly data
                'HS' // it doesn't have yearly data
            ]
        },

        // this will blacklist all the IDs that should not be created as filters
        filters: {
            blacklistCodesID: ['year']
        },

        // numeber of maximum series shown in the chart
        seriesLimit: 20,

        // chart definition
        chart: {
            model: null,
            adapter: {
                adapterType: 'faostat',
                type: "timeserie",
                xDimensions: 'year',
                yDimensions: 'unit',
                valueDimensions: 'value',
                seriesDimensions: [
                    'area',
                    'partnerarea', 'reporterarea', //trade matrix
                    'recipientarea',
                    'donor',
                    'reporter',
                    'survey', // HS
                    'item',
                    'element',
                    'breakdownvar', 'breakdownsex', 'indicator', 'measure', // HS
                    'purpose' // ODA

                ]
            },
            template: {
                height: '300px',
                title: i18n.chart_title
            },
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
            page_size: 100000
            //output_type: 'arrays'
        }

    };
});
