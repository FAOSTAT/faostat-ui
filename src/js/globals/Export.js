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

        //requestType: 'data',
        requestType: 'databean',
        output_type: 'csv',
        name: "FAOSTAT_Export_data"

    };

    function Export(config) {

        this.o = $.extend(true, {}, defaultOptions, config);

        this.api = new API();

        return this;
    }

    Export.prototype.exportData = function (request, options) {

        var start = new Date();

        // TODO: check better the requestType!
        var requestType = options ? (options.requestType) || this.o.requestType : this.o.requestType,
            name = options ? options.name || this.o.name : this.o.name,
            waitingText = options ? (options.waitingText) || null : null,
            self = this,
            r = $.extend(true, {}, request);


        log.info("Export.exportData;", r, requestType, options, name);

        if (!r.hasOwnProperty('output_type')) {
            r.output_type = this.o.output_type;
        }

        // TODO: add google analytics event
        // amplify.publish(E.GOOGLE_ANALYTICS_PAGE_VIEW, {});

        // waiting
        amplify.publish(E.WAITING_SHOW, { text: waitingText});

        // switch between the requestType to faostatAPI
        if (typeof this.api[requestType] === 'function') {

            this.api[requestType](r).then(function(data) {

                //console.log("Csv", data);
                //
                amplify.publish(E.WAITING_HIDE);

                var time = new Date();

                log.info("Export.exportData; Execution query time: ", (time - start) / 1000 + "s");

                //log.info(error);
                //window.btoa(unescape(encodeURIComponent(error)))
                self._exportResult(data, name);

            }).fail(function (error) {

                console.log("FAIL", error);

                // TODO: remove it! This was caused by a wrong produce type in the APIs
                // TODO: in theory is should not be needed

               /* amplify.publish(E.WAITING_HIDE);

                var time = new Date();

                log.info("Export.exportData; Execution query time: ", (time - start) / 1000 + "s");

                //log.info(error);
                //window.btoa(unescape(encodeURIComponent(error)))
                self._exportResult(error, name);*/

            });

        } else {
            log.error(requestType + " not present in faostatAPI");
            throw new Error(requestType + " not present in faostatAPI");
        }

    };

    Export.prototype._exportResult = function (result, name) {

        log.info('EXPORT._exportResult;');

        var start = new Date();

        // TODO: check if it works in all browser. There should be an issue with Sfari 8.0

        var blob = new Blob([result], {type: "data:application/csv;charset=utf-8;"}),
            d = new Date(),
            filename = name + "_" + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear() + '.csv';

        log.info('EXPORT.saveAs;');

        saveAs(blob, filename);

        var time = new Date();

        // save memory?
        result = null;
        blob = null;

        log.info("Export.saveAs; Execution saveAs time: ", (time - start) / 1000 + "s");

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

        var start = new Date();

        log.info('EXPORT.exportTable; options: ', options);

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

    Export.prototype.exportMatrix = function (options) {

        log.info('EXPORT.exportMatrix; options: ', options);

        var csv = ConvertToCSV(options.data);

        var blob = new Blob([csv], {type: "data:application/csv;charset=utf-8;"}),
            d = new Date(),
            filename = (options.name) || this.o.name + "_" + (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();

        log.info('EXPORT.saveAs;');

        saveAs(blob, filename);


        function ConvertToCSV(objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','

                    line += array[i][index];
                }

                str += line + '\r\n';
            }

            return str;
        }

    };

    return new Export();

});
