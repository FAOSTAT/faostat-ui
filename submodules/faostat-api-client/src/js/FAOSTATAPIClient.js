/*global define*/
define(['jquery'], function ($) {

    'use strict';

    function FAOSTATAPIClient(config) {

        /* Store configuration. */
        this.CONFIG = {
            api_key: null,
            client_key: null,
            base_url: 'http://fenixapps2.fao.org/api/v1.0/'
        };

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

    }

    FAOSTATAPIClient.prototype.groups = function (config) {
        if (this.isValidRequest()) {
            $.ajax({
                url: 'http://fenixapps2.fao.org/api/v1.0/' + config.lang + '/groups/',
                data: {
                    datasource: config.datasource
                },
                type: 'GET',
                success: config.success,
                error: config.error,
                context: config.context
            });
        } else {
            throw 400;
        }
    };
    FAOSTATAPIClient.prototype.groupsanddomains = function (config) {
        if (this.isValidRequest()) {
            $.ajax({
                url: 'http://fenixapps2.fao.org/api/v1.0/' + config.lang + '/groupsanddomains/',
                data: {
                    datasource: config.datasource
                },
                type: 'GET',
                success: config.success,
                error: config.error,
                context: config.context
            });
        } else {
            throw 400;
        }
    };

    FAOSTATAPIClient.prototype.isValidRequest = function () {
        return true;
    };

    return FAOSTATAPIClient;

});