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

            template: {
                tableOptions: {
                    next_text: i18n.next,
                    previous_text: i18n.previous,
                    last_text: i18n.last,
                    first_text: i18n.first
                }
            }

        };

        function Table() {

            return this;
        }

        Table.prototype.render = function (config) {

            var c = $.extend(true, {}, defaultOptions, config);

            this.template = new Template();
            this.adapter = new Adapter();

            // prepare data
            c.filteredModel = this.adapter.prepareData(c);

            // render table
            this.template.render(c);

        };

        Table.prototype.getContainer = function () {
            return this.o.container;
        };

        Table.prototype.destroy = function () {

            log.warn("TODO: implement destroy");

        };

        return Table;
    });