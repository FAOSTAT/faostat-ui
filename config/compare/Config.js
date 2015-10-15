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
                       max: 2013
                   },
                   step: 1
               }
            },

            groups: {
                blacklist: ['P']
            },

            domains: {
                blacklist: ['QC']
            },

            // this will blacklist all the IDs that should not be created as filters
            filters: {
                blacklistCodesID: ['yeargroup']
            },

            // numeber of maximum series shown in the chart
            seriesLimit: 20,

            // chart definition
            chart: {

            }

        };
});
