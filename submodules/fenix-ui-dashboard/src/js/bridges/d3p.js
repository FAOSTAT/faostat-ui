/*global define, amplify */

define([
    "jquery",
    'fx-ds/config/config',
    'fx-ds/config/config-default',
    'fx-ds/config/events',
    'fx-ds/config/errors',
    'fx-ds/config/d3p_filters',
    'q',
    "amplify"
], function ($, C, DC, E, Err, Filters, Q) {

    'use strict';

    var defaultOptions = { };

    function D3P_bridge(options) {

        this.o = $.extend(true, {}, defaultOptions, options);

        return this;
    }

    D3P_bridge.prototype.getPage = function (page) {

        var self = this;

        return Q.Promise(function (resolve, reject) {

            var SERVICE_PREFIX = C.SERVICE_BASE_ADDRESS || DC.SERVICE_BASE_ADDRESS;

            var url = SERVICE_PREFIX + "/resources/find?perPage=" + (C.SEARCH_PER_PAGE || DC.SEARCH_PER_PAGE) + '&page=' + page;

            $.ajax({
                url: url,
                type: 'post',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(self.filter),
                success: function (response, textStatus, jqXHR) {

                    if (jqXHR.status === 204) {
                        amplify.publish(E.SEARCH_QUERY_EMPTY_RESPONSE, {});

                    }

                    resolve({response: response || [], filter: self.filter});

                },
                error: function () {
                    reject(new Error("Can't XHR " + JSON.stringify(url)));
                },

                complete: function () {
                    amplify.publish(E.SEARCH_QUERY_END, {});
                }
            });

        });
    };

    D3P_bridge.prototype.getFirstPage = function () {

        return this.getPage(1);
    };

    D3P_bridge.prototype.getPage = function (page) {

        return this.getPage(page);
    };

    D3P_bridge.prototype.query = function ( process ) {

        if (!Array.isArray(process)) {
            console.error(process);
            throw new Error(Err.INVALID_PROCESS)
        }

        var SERVICE_PREFIX = this.o.bridge.service_base_address||C.SERVICE_BASE_ADDRESS || DC.SERVICE_BASE_ADDRESS,
            D3P_PATHNAME = this.o.bridge.d3p_pathname || C.D3P_PATHNAME || DC.D3P_PATHNAME,
            D3P_QUERY_PARAMS = this.o.bridge.d3p_query_params || C.D3P_QUERY_PARAMS || DC.D3P_QUERY_PARAMS,
            url = SERVICE_PREFIX + D3P_PATHNAME + this.o.uid +D3P_QUERY_PARAMS,
            baseFilter = this.o.filter || [],
            filter = baseFilter.concat(process);

        return Q(
            $.ajax({
                url: url,
                type: 'post',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(filter)
            })
        );
    };

    return D3P_bridge;

});