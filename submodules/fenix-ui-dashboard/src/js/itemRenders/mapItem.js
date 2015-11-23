/*global define, amplify */
define([
    'jquery',
    'loglevel',
    'underscore',
    'fx-m-c/start',
    'fx-ds/config/events',
    'amplify'
], function ($, log, _, MapCreator, E) {

    'use strict';

    var defaultOptions = {

        output_type: "csv"
    };

    var s = {

        EXPORT: '[data-role="export"]'

    };

    function MapItem(options) {

        this.o = $.extend(true, {}, defaultOptions, options);

        this._bindEventListeners();

        this.mapCreator = new MapCreator();

        this.mapCreator.render(this.o.config);

    }

    MapItem.prototype._bindEventListeners = function () {

    };

    MapItem.prototype._getProcess = function () {

        return this.o.filter || [];

    };

    MapItem.prototype.render = function () {

        var process = this._getProcess();

        //amplify.publish(E.LOADING_SHOW, {container: this.o.config.container});

        this.bridge.query(process).then(_.bind(this._onQuerySuccess, this), _.bind(this._onQueryError, this));

    };

    MapItem.prototype._onQuerySuccess = function (model) {

        //amplify.publish(E.LOADING_HIDE, {container: this.o.config.container});

        this.mapCreator.addLayer(model);
        this.mapCreator.addCountryBoundaries();

        this.enableExport();

    };

    MapItem.prototype._onQueryError = function () {

        log.error("Query error")

    };

    MapItem.prototype.enableExport = function () {

        var self = this;

        $(this.mapCreator.getContainer()).find(s.EXPORT).on('click', function(e){
            self.export();
        });

    };

    MapItem.prototype.export = function () {

        var process = this._getProcess();

        amplify.publish(E.EXPORT_DATA, process);

    };


    MapItem.prototype._unbindEventListeners = function () {

    };

    MapItem.prototype.destroy = function () {

       this._unbindEventListeners();
    };

    return MapItem;
});