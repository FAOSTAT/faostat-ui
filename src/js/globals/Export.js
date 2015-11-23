/**
 * Created by vortex on 11/20/15.
 */

/*global define*/
define([
    'jquery',
    'loglevel',
    'config/Events',
    'faostatapiclient',
    'amplify'
], function ($, log, E, API) {

    'use strict';

    var defaultOptions = {

        requestType: 'data',
        output_type: 'csv',
        name: "FAOSTAT_Export_data"

    };

    function Export(config) {

        this.o = $.extend(true, {}, defaultOptions, config);

        this.api = new API();

        return this;
    }

    Export.prototype.exportData = function (request, options) {

        // TODO: check better the requestType!
        var requestType = (options)? options.requestType: this.o.requestType,
            name = (options)? options.name: this.o.name,
            self = this;

        if (!request.hasOwnProperty('output_type')) {
            request.output_type = this.o.output_type;
        }

        // TODO: add google analytics event
       // amplify.publish(E.GOOGLE_ANALYTICS_PAGE_VIEW, {});

        // wainting
        amplify.publish(E.WAITING_SHOW);


        // switch between the requestType to faostatAPI
        if (typeof this.api[requestType] == 'function') {

            this.api[requestType](request).then(function (csv) {
                log.debug(csv);
            }).fail(function (error) {

                amplify.publish(E.WAITING_HIDE);

                self._exportResult(error, name);
            });

        }else{
            log.error(requestType + " not present in faostatAPI");
            throw new Error(requestType + " not present in faostatAPI");
        }

    };

    Export.prototype._exportResult = function (result, name) {

        var csvString = result.responseText,
            a = document.createElement('a'),
            filename = name + "_" + (new Date()).getTime() + '.csv';

        a.href        = 'data:text/csv;charset=utf-8;base64,' + window.btoa(csvString);
        a.target      = '_blank';
        a.download    = filename;
        document.body.appendChild(a);
        a.click();

        // TODO: clean it up from the body

    };

    return new Export();

});
