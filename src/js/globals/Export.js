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

        output_type: 'csv'

    };

    function Export(config) {

        this.o = $.extend(true, {}, defaultOptions, config);

        this.api = new API();

        return this;
    }

    Export.prototype.exportData = function (request, requestType) {

        log.info(this)

        var requestType = requestType || 'data',
            self = this;

        if (!request.hasOwnProperty('output_type')) {
            request.output_type = this.o.output_type;
        }

        // TODO: add google analytics event
       // amplify.publish(E.GOOGLE_ANALYTICS_PAGE_VIEW, {});

        // TODO: switch between the requestType
        this.api.data(request).then(function (csv) {
            log.debug(csv);
        }).fail(function (error) {
            self._exportResult(error);
        });

    };

    Export.prototype._exportResult = function (result) {

        var csvString = result.responseText,
            a = document.createElement('a'),
            filename = 'TEST_' + (new Date()).getTime() + '.csv';

        a.href        = 'data:text/csv;charset=utf-8;base64,' + window.btoa(csvString);
        a.target      = '_blank';
        a.download    = filename;
        document.body.appendChild(a);
        a.click();

        // TODO: clean it up from the body

    };

    return new Export();

});
