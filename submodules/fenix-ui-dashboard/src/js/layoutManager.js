/*global define*/
define([
    "jquery",
    "underscore",
    'fx-ds/config/errors',
    'fx-ds/config/events',
    'fx-ds/config/config',
    'fx-ds/config/config-default',
    "text!fx-ds/templates/dashboard.hbs",
    "fx-common/structures/fx-fluid-grid",
    "loglevel",
], function ($, _, Err, E,  C, DC, template, FluidGrid, log) {

    'use strict';

    var defaultOptions = { };

    function LM(o) {

        this.o = $.extend(true, {}, defaultOptions, o);

        //Init auxiliary variables
        this._initVariables();

        this._bindEventListeners();

        this._initLayout();
    }

    LM.prototype._initVariables = function () {

        this.$container = $(this.o.container);

    };

    LM.prototype._bindEventListeners = function () {

    };

    LM.prototype._initLayout = function () {

        switch (this.o.layout.toLowerCase()) {
            case 'injected' :

                this.addItem = this._addItemInjectedLayout;

                break;
            case 'fluid' :

                this.$container.html(template);

                this.$gridContainer = this.$container.find(this.o.grid.container);

                //packery
                //var gridConf = $.extend(true, this.o.grid, {
                //    container: this.$container.find(this.o.grid.container)[0]
                //});

                //this.grid = new FluidGrid().init(gridConf).render();

                this.addItem = this._addItemFluidLayout;

                break;
            default :

                throw new Error(Err.INVALID_LAYOUT_CONFIGURATION);
                break;
        }

    };

    LM.prototype.addItem = function (item) {
        //This is just a placeholder. Reference to _initLayout for the real implementation
    };

    LM.prototype._addItemInjectedLayout = function (html, item) {

        var $container = $(item.container);

        if ($container.length === 0) {
            log.error(Err.INVALID_ITEM_CONTAINER_ON_INJECTED_LAYOUT, item);
            throw new Error(Err.INVALID_ITEM_CONTAINER_ON_INJECTED_LAYOUT)
        }

        $container.html(html);

    };

    LM.prototype._addItemFluidLayout = function ( html, item ) {

        //log.log(item);
        //this.grid.addItem(html);

        this.$gridContainer.append(html);

    };

    LM.prototype.clear = function () {

        //this.grid.clear();
    };

    LM.prototype._unbindEventListeners = function () {


    };

    LM.prototype.destroy = function () {

        this._unbindEventListeners();

        //this.grid.destroy();

    };

    return LM;
});