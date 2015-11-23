/*global define, amplify */

define([
    "jquery",
    'fx-ds/config/config',
    'fx-ds/config/config-default',
    'fx-ds/config/events',
    'fx-ds/config/errors',
    //'fx-ds/config/d3p_filters',
    //'faostatclientAPI',
    'faostatapiclient',
    'loglevel',
    "amplify"
], function ($, C, DC, E, Err, FAOSTATClientAPI, log) {

    'use strict';

    var defaultOptions = {

        requestType: "data" // data/rankings

    };

    function FAOSTAT_bridge(options) {

        this.faostatAPI = new FAOSTATClientAPI();

        this.o = $.extend(true, {}, defaultOptions, options);

        return this;
    }

    FAOSTAT_bridge.prototype.query = function (filter) {

        var requestType = (this.o.bridge)? (this.o.bridge.requestType || this.o.requestType): this.o.requestType;

        if ( typeof this.faostatAPI[requestType] == 'function') {
            return this.faostatAPI[requestType](filter);
        }else{
            log.error(requestType + " not present in faostatAPI");
            throw new Error(requestType + " not present in faostatAPI");
        }

    };

    return FAOSTAT_bridge;

});