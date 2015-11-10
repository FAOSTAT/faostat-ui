/*global define*/

define([
    'jquery',
    'fx-dashboard/widgets/Fx-widgets-commons',
    'packery',
    'draggabilly'
], function ($, W_Commons, Packery, Draggabilly) {

    var defaultOptions = {
            css: {
                FIT: "fit"
            }}
        , w_Commons;

    function Fx_Fluid_Grid() {
        this.o = { };
        w_Commons = new W_Commons();
    }

    Fx_Fluid_Grid.prototype.resize = function (item) {

        var $item = $(item);

        if ($item.hasClass(this.o.css.FIT)) {
            $item.removeClass(this.o.css.FIT);
            this.pckry.layout();
        } else {
            $item.addClass(this.o.css.FIT);
            this.pckry.fit($item.get(0));
        }

        return $item.get(0);
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

        var draggie = new Draggabilly(item, this. o.drag);
        // bind Draggabilly events to Packery
        this.pckry.bindDraggabillyEvents(draggie);

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
            //var draggie = new Draggabilly(elem);
            // bind Draggabilly events to Packery
            this.pckry.bindDraggabillyEvents(draggie);
        }
    };

    Fx_Fluid_Grid.prototype.preValidation = function () {

        if (!w_Commons.isElement(this.o.container)) {
            throw new Error("Fluid Grid: INVALID_CONTAINER.")
        }

        if (!this.o.hasOwnProperty("config")) {
            throw new Error("Fluid Grid: NO CONFIG")
        }

        if (!this.o.drag.hasOwnProperty("handle")) {
            throw new Error("Fluid Grid: NO HANDLER SELECTOR")
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

    return Fx_Fluid_Grid;

});