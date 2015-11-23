define(['jquery', "fx-rp-plugins-factory", 'amplify'], function ($, PluginFactory) {

    'use strict';


    var EXPORT_ACCESS_POINT = '/fenix/export';


    function FenixReports() {
        this._$pluginChosen = null;
    };


    FenixReports.prototype.init = function (plugin) {
        if (typeof plugin !== 'undefined' && plugin !== null && plugin !== '') {
            this._$pluginChosen = PluginFactory(plugin);
        }
        else {
            throw new Error('please define a valid plugin name');
        }
    };


    FenixReports.prototype.exportData = function (config, url, successCallBack, errorCallback) {

        url += EXPORT_ACCESS_POINT;

        var payload = this._$pluginChosen.process(config);

        $.ajax({
            url: url,
            crossDomain: true,
            type: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            success: function (data) {

                var locUrl = url + '?' + data.substr(data.indexOf('id'));

                if ($.isFunction(successCallBack))
                    successCallBack(locUrl);

                window.location = locUrl;
            },
            beforeSend: function () {
                amplify.publish('fx.reports.hasSent');
            },
            complete: function () {
                amplify.publish('fx.reports.hasCompleted');
            },
            error: function (jqXHR, textStatus, errorThrown) {

                alert("error occurred");

                if ($.isFunction(errorCallback))
                    errorCallback({
                        'jqXHR': jqXHR,
                        'textStatus': textStatus,
                        'errorThrown': errorThrown
                    });
                }
        });
    };

    return FenixReports;
})