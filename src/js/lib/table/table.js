/*global define*/
define([
        'jquery',
        'loglevel',
        'handlebars',
        'fs-t-c/templates/base_template',
        'fs-t-c/adapters/FAOSTAT_adapter'
    ],
    function ($, log, Handlebars, Template, Adapter) {

        'use strict';

        var defaultOptions = {

        };

        function Table() {

            return this;
        }

        Table.prototype.render = function (config) {

            this.o = $.extend(true, {}, defaultOptions, config);

            this.template = new Template();
            this.adapter = new Adapter();

            // prepare data

            // render table
            this.template.render(config);

        };

        Table.prototype.getContainer = function () {
            return this.o.container;
        };

        return Table;
    });