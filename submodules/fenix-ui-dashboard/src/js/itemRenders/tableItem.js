/*global define, amplify */
define([
    'jquery',
    'underscore',
    'fx-t-c/start',
    'amplify'
], function ($, _, TableCreator) {

    'use strict';

    var defaultOptions = {

    };

    function TableItem(options) {

        this.o = $.extend(true, {}, defaultOptions, options);

        this._bindEventListeners();

        this.tableCreator = new TableCreator();

    }

    TableItem.prototype._bindEventListeners = function () {

    };

    TableItem.prototype._getProcess = function () {

        return this.o.filter || [];
    };

    TableItem.prototype.render = function () {

        var process = this._getProcess();

        this.bridge.query(process)
            .then(_.bind(this._onQuerySuccess, this), _.bind(this._onQueryError, this));
    };

    TableItem.prototype._onQuerySuccess = function (model) {

        var data = [];
        for (var i=0; i < 30; i++) {
             data.push(model.data[i]);
        }

        //TODO implement
        var modelTest = {
            metadata: model.metadata,
            data: data
        };

        this.o.model = model;
        //this.o.model = modelTest;

        this.tableCreator.render({
            container: this.o.config.container,
            model: this.o.model
            /*
             if you want to override the default configuration,
             options: {
             sortable: true
             }
             */

        });

    };

    TableItem.prototype.renderCharts = function(creator) {

        creator.render( this.o.config);
    };

    TableItem.prototype._onQueryError = function () {

        alert("Query error")
    };

    TableItem.prototype._unbindEventListeners = function () {

    };

    TableItem.prototype.destroy = function () {

       this._unbindEventListeners();
    };

    return TableItem;
});