/*global define*/
define([
        'jquery',
        'loglevel',
        'handlebars',
        'fs-t-c/templates/base_template',
        'fs-t-c/adapters/FAOSTAT_adapter',
        'i18n!nls/common'
    ],
    function ($, log, Handlebars, Template, Adapter, i18n) {

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
            config.filteredModel = this.adapter.prepareData(config);

            log.warn("Add i18n to table");

            // render table
            this.template.render(config);

        };

        Table.prototype.getContainer = function () {
            return this.o.container;
        };

        Table.prototype.destroy = function () {

            log.warn("TODO: implement destroy")

        };

        return Table;
    });