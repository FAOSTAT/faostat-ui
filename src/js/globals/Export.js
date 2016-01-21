/**
 * Created by vortex on 11/20/15.
 */

/*global define, saveAs, amplify, Blob*/
define([
    'jquery',
    'loglevel',
    'config/Events',
    'faostatapiclient',
    'FileSaver',
    'tableExport',
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
        var requestType = options ? options.requestType : this.o.requestType,
            name = options ? options.name || this.o.name : this.o.name,
            self = this;

        if (!request.hasOwnProperty('output_type')) {
            request.output_type = this.o.output_type;
        }

        // TODO: add google analytics event
        // amplify.publish(E.GOOGLE_ANALYTICS_PAGE_VIEW, {});

        // waiting
        amplify.publish(E.WAITING_SHOW);

        // switch between the requestType to faostatAPI
        if (typeof this.api[requestType] === 'function') {

            this.api[requestType](request).then(function (csv) {
                //log.debug(csv);
            }).fail(function (error) {

                amplify.publish(E.WAITING_HIDE);

                //log.info(error);
                //window.btoa(unescape(encodeURIComponent(error)))
                self._exportResult(error, name);

            });

        } else {
            log.error(requestType + " not present in faostatAPI");
            throw new Error(requestType + " not present in faostatAPI");
        }

    };

    Export.prototype._exportResult = function (result, name) {

        // TODO: check if it works in all browser. There should be an issue with Sfari 8.0

        var blob = new Blob([result.responseText], {type: "data:application/csv;charset=utf-8;"}),
            d = new Date(),
            filename = name + "_" + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear() + '.csv';

        saveAs(blob, filename);

        /* var csvString = result.responseText,
         csvData = new Blob([csvString], { type: 'text/csv' }),
         csvUrl = URL.createObjectURL(csvData),
         a = document.createElement('a'),
         d = new Date(),
         filename = name + "_" + (d.getMonth()+1) +'-' + d.getDate() +'-'+ d.getFullYear() + '.csv';

         a.href = csvUrl;
         a.target = '_blank';
         a.download = filename;
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);*/

        // TODO: clean it up from the body

    };

    Export.prototype.exportTable = function (options) {

        log.info(options);

        var container = options.container,
            type = options.type || 'excel',
            d = new Date(),
            filename = (options.name) || this.o.name + "_" + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();

        // TODO: do a better validation and output message. Warning?
        if ( container === null || container === undefined) {
            log.error('Table container is not valid', container);
        }
        else {
            $(container).tableExport({
                fileName: filename,
                type: type
            });
        }

    };

    return new Export();

});
