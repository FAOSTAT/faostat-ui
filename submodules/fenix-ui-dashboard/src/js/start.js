/*global define */

define([
    'jquery',
    'fx-dashboard/controllers/dashboard-controller'
], function ($, DashboardController) {

    var o = {};

    function Start(options) {
        $.extend(true, o, options);
    }

    Start.prototype.init = function () {
        this.controller = new DashboardController();
        this.controller.show(o);
   };


    return Start;
});

