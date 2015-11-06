/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'globals/Common',
    'config/FAOSTAT',
    'config/Config',
    'config/Events',
    'text!lib/view/templates/view.hbs',
    'i18n!nls/compare',
    'handlebars',
    'faostatapiclient',
    'underscore',
    //'views/compare-filter-view-backup',
    'lib/compare/compare-filter',
    'q',
    'amplify'
], function ($, Common, F, C, E, template) {

    'use strict';

    var s = {

        FILTERS: '[data-role="filters"]'

    };

    var defaultOptions = {

    };

    'use strict';

    function View(options) {
        this.o = {};
        this.o.lang = Common.getLocale();
        this.o = $.extend({}, true, defaultOptions, options);
        return this;
    };

    View.prototype.initVariables = function () {

    };

    View.prototype.configurePage = function(json) {

    };

    View.prototype.dispose = function () {

    };

    return View;
});
