    /*global define*/
define([
    'i18n!nls/compare'
],function (i18n) {

    'use strict';

    return {

        timerange: {
/*            options: {
                bounds: {
                    min: 1961,
                    max: 2050
                },
                defaultValues:{
                    min: 1961,
                    max: 2013
                },
                step: 1
            }*/
            options: {
                type: "double",
                min: 1961,
                max: 2050,
                from: 1961,
                to: 2014,
                //grid: true,
                grid_num: 10,
                step: 1,
                prettify_enabled: false,
                drag_interval: true
            }
        },

        // TODO: DO THE BLACKLIST!!!!!
        groups: {
            whitelist: ['Q', 'G1', 'G2', 'AS', 'M',  'FB' ,'R', 'O', 'I' ,'F', 'P', 'T', 'E'],
            blacklist: [
                //'D', // (FS, HS) it doesn't have yearly data
            ]
        },

        domains: {
           /* blacklist: [
                //'FS', // it doesn't have yearly data
                'HS', // it doesn't have yearly data,
                'EA', // ODA
                'FT', // trade matrix
                'TM', // trade matrix
                'HS',
                'PM',
                'GY', // Synthetic Fertilizers
                'PM'
            ],*/
            whitelist: [
                'QC', 'QD', 'QA', 'QL', 'QL', 'QI', 'QV',
                //'FS', // FS doesn't have yearly data!
                'TP', 'TA', 'TI',
                'FBS', 'BC', 'BL', 'CC', 'CL',
                'PP', 'PI', 'PA', 'CP', 'PD',
                'RV', 'RP', 'RT', 'RL', 'OE',
                'OA',
                'CS', 'RM', 'RY', 'IC', 'EA',
                'MK', 'EC',
                'EE', 'EF', 'EL', 'EK', 'EP', 'ES', 'EW',
                'GT', 'GE', 'GM', 'GR', 'GY', 'GU', 'GP', 'GA', 'GV', 'GH', 'GB', 'GN',
                'GL', 'GF', 'GC', 'GG', 'GI',
                'FO',
                'AF', 'AE',
                'FA'

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
                type: "timeserie_compare",
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
