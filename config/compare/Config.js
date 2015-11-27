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
            whitelist: ['Q', 'G1', 'G2', 'AS', 'M',  'FB' ,'R', 'O', 'I' ,'F', 'P', 'T', 'D'],
            blacklist: [
                //'D', // (FS, HS) it doesn't have yearly data
            ]
        },

        domains: {
            blacklist: [
                //'FS', // it doesn't have yearly data
                'HS', // it doesn't have yearly data,
                'EA', // ODA
                'FT', // trade matrix
                'TM', // trade matrix
                'HS'
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
                height: '450px',
                title: i18n.chart_title
            },
            creator: {},
            prepareChart: true
        },

        table: {
            model: null,
            adapter: {
                columns: [
                    'area',
                    'partnerarea', 'reporterarea', //trade matrix
                    'recipientarea',
                    'donor',
                    'reporter',
                    'survey', // HS
                    'item',
                    'element',
                    'breakdownvar', 'breakdownsex', 'indicator', 'measure', // HS
                    'purpose',
                    'year',
                    'value',
                    'flag'
                ],
                showCodes: false
            },
            template: {
                height: '450',
                tableOptions: {
                    'data-search': true,
                    'data-pagination': true
                }
            }
        },

        getData: {

            limit:-1,
            null_values:false,
            List1Codes: null,
            List2Codes: null,
            List3Codes: null,
            List4Codes: null,
            List5Codes: null,
            List6Codes: null,
            List7Codes: null,
            page_size: 0,
            page_number: 0

        }

    };
});
