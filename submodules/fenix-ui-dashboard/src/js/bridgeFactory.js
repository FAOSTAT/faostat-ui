/*global define, amplify */
define([
    'jquery',
    'fx-ds/bridges/d3p',
    'fx-ds/bridges/faostat',
    'amplify'
], function ($, D3P, FAOSTAT) {

    'use strict';

    var defaultOptions = { };

    function Factory(options) {

        this.o = $.extend(true, {}, defaultOptions, options);

        this.bridges = {};

        this.bridges.D3P = D3P;
        this.bridges.FAOSTAT = FAOSTAT;

        this._bindEventListeners();
    }

    Factory.prototype._bindEventListeners = function () {

    };

    Factory.prototype.getBridge = function ( item ) {

        var type = this.o.bridge.type || 'd3p';

        switch (type.toLocaleLowerCase()) {
            case "d3p" :
                return new this.bridges.D3P(item);
                break;
            case "wds" :
                break;
            case "faostat" :
                return new this.bridges.FAOSTAT(item);
                break;
        }
    };

    Factory.prototype._unbindEventListeners = function () {

    };

    Factory.prototype.destroy = function () {
       this._unbindEventListeners();
    };

    return Factory;
});