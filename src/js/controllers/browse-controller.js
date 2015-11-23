/*global define*/
define([
    'loglevel',
    'controllers/base/controller',
    'views/browse-view',
    'faostatapiclient',
    'config/Config',
    'config/browse_by_country/Config'
], function (log, Controller, View, FAOSTATClientAPI, C, CC) {

    'use strict';

    var BrowseController = Controller.extend({

        show: function (params, section) {
            this.view = new View({
                region: 'main',
                section: section,
                lang: params.lang,
                code: params.code !== undefined ? params.code: undefined
            });
        },

        show_browse_by_domain: function (params) {
            //TODO: can be switched to the "name" section from ChaplinJS routes.js definition?
            this.show(params, 'browse_by_domain');
        },

        show_browse_by_country: function (params) {
            this.show(params, 'browse_by_country');
        },

        show_browse_rankings: function (params) {

            this.show(params, 'browse_rankings');

/*
            this.api.codes({
                lang: Common.getLocale(),
                datasource: C.DATASOURCE,
                domain_code: CC.countriesDomainCode,
                id: CC.countriesDimensionID,

                // TODO: Add default on CLIENT API!
                subcodelists: null,
                ord: null

            }).then(_.bind(function(codes){

                this.show(params, 'browse_rankings');
            }, this));*/

        }

    });

    return BrowseController;
});
