/*global define*/
define(function () {

        'use strict';

        return {


            groups: {
                blacklist: ""
            },

            domains: {
                blacklist: ""
            },

            // this will blacklist all the IDs that should not be created as filters
            filters: {
                blacklistCodesID: ['yeargroup']
            }


        };
});
