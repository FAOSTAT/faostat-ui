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

            adapter: {

                show_codes: false,
                show_flags: true,
                show_unit: true,
                decimal_places: 2,
                decimal_separator: '.',
                thousand_separator: ','
            },
            template: {
                tableOptions: {
                    next_text: i18n.next,
                    previous_text: i18n.previous,
                    last_text: i18n.last,
                    first_text: i18n.first
                },
                addPanel: true,
                sortable: true,

                //
                remote: {
                    enabled: true,
                    request: {}
                }
            }

        };

        function Table() {

            return this;
        }

        Table.prototype.render = function (config) {

            this.o = $.extend(true, {}, defaultOptions, config);

            this.template = new Template();
            this.adapter = new Adapter();

            // prepare data
            this.o.filteredModel = this.adapter.prepareData(this.o);

            log.info("Table.render; config:", this.o);

            // render table
            this.template.render(this.o);

        };

        Table.prototype.getContainer = function () {
            return this.o.container;
        };

        Table.prototype.formatData = function (model) {

           log.info('Table.formatData;', model);

           this.o.model = model || this.o.model;
           this.o.model.data = this.adapter.formatData(this.o.model);

           return this.o.model.data;
        };

        Table.prototype.refresh = function () {

        };

        Table.prototype.destroy = function () {

            log.warn("TODO: implement destroy");

        };

        return Table;
    });