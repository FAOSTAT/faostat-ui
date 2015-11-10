/*global define*/

define([
    'jquery',
    'packery',
    'draggabilly'
], function ($, Packery, Draggabilly) {

    'use strict';

    var defaultOptions = {
        css: {
            FIT: "fit"
        },
        s : {
            COURTESY_MESSAGE: ".fx-courtesy"
        }
    };

    function Fx_Fluid_Grid() {
        this.o = {};
    }

    Fx_Fluid_Grid.prototype.resize = function (item) {

        var $item = $(item);

        if ($item.hasClass(this.o.css.FIT)) {
            this.setItemWidth(item, 'half');
        } else {
            this.setItemWidth(item, 'full');
        }

        return $item.get(0);
    };

    Fx_Fluid_Grid.prototype.setItemWidth = function (item, width) {

        var $item = $(item);

        if (width === 'full') {
            $item.addClass(this.o.css.FIT);
            this.pckry.fit($item.get(0));
        } else {
            $item.removeClass(this.o.css.FIT);
        }

        this.pckry.layout();

    };

    Fx_Fluid_Grid.prototype.getElementsCounts = function () {
        return this.pckry.getItemElements().length;
    };

    Fx_Fluid_Grid.prototype.addItem = function (item) {

        var self = this;

        // append elements to container
        this.o.container.appendChild(item);
        // add and lay out newly appended elements
        this.pckry.appended(item);

        if (this.o.drag) {

            var draggie = new Draggabilly(item, this.o.drag);
            // bind Draggabilly events to Packery
            this.pckry.bindDraggabillyEvents(draggie);
        }


        this.pckry.layout();

        setTimeout(function () {
            self.pckry.layout();
        }, 100);

    };

    Fx_Fluid_Grid.prototype.removeItem = function (item) {
        // remove clicked element
        this.pckry.remove(item);
        // layout remaining item elements
        this.pckry.layout();
    };

    Fx_Fluid_Grid.prototype.initStructure = function () {

        this.pckry = new Packery(this.o.container, this.o.config);

        var itemElems = this.pckry.getItemElements();

        for (var i = 0; i < itemElems.length; i++) {
            var elem = itemElems[i];
            // make element draggable with Draggabilly
            var draggie = new Draggabilly(elem, this.o.drag);
            // bind Draggabilly events to Packery
            this.pckry.bindDraggabillyEvents(draggie);
        }
    };

    Fx_Fluid_Grid.prototype.preValidation = function () {

        if ($(this.o.container).length === 0) {
            throw new Error("Fluid Grid: INVALID_CONTAINER.");
        }

        this.o.container = $(this.o.container)[0];

        if (!this.o.hasOwnProperty("config")) {
            throw new Error("Fluid Grid: NO CONFIG");
        }

        if (this.o.drag && !this.o.drag.hasOwnProperty("handle")) {
            throw new Error("Fluid Grid: NO HANDLER SELECTOR");
        }

    };

    Fx_Fluid_Grid.prototype.clear = function () {
        this.pckry.remove(this.pckry.getItemElements());
    };

    Fx_Fluid_Grid.prototype.render = function (options) {

        $.extend(this.o, options);

        this.preValidation();

        this.initStructure();

        return this;
    };

    Fx_Fluid_Grid.prototype.init = function (options) {

        $.extend(this.o, defaultOptions);
        $.extend(this.o, options);

        return this;
    };

    Fx_Fluid_Grid.prototype.getElementsCounts = function () {

        return this.pckry.getItemElements().length;
    };

    Fx_Fluid_Grid.prototype.showCourtesyMessage = function () {

        $(this.o.container).find(this.o.s.COURTESY_MESSAGE).fadeIn();
    };

    Fx_Fluid_Grid.prototype.hideCourtesyMessage = function () {

        $(this.o.container).find(this.o.s.COURTESY_MESSAGE).fadeOut(200);
    };

    Fx_Fluid_Grid.prototype.destroy = function () {

        this.pckry.destroy();
    };

    return Fx_Fluid_Grid;

});