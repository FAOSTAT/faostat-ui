/*global define*/
define([
        'jquery',
        'handlebars',
        'loglevel',
        'text!fs-dt-c/templates/template.hbs',
        'i18n!nls/common',
        'datatables.net-bs',
        'datatables-scroller',
        'datatables-colreorder'
    ],
    function ($, Handlebars, log, template, i18n) {

        'use strict';

        var defaultOptions = {},
            s = {};

        function Base_template(container, config) {

            this.id = "table-" + Math.random().toString().replace(".", "");

            this.o = $.extend(true, {}, defaultOptions, config);

            this.o.container = container;

        }

        Base_template.prototype.render = function (model) {

            if (this._validateInput() === true) {
                this._initVariable();
                this._injectTemplate(model);
            } else {
                log.error("FAOSTAT Table has not a valid configuration", this.errors);
                throw new Error("FAOSTAT Table has not a valid configuration");
            }
        };

        Base_template.prototype._injectTemplate = function (model) {

            this.$CONTAINER = $(this.o.container);

            // inject basic structure
            var t = Handlebars.compile(template);

            this.$CONTAINER.html(t({
                id: this.id,
                class: this.o.class,
                addPanel: this.o.addPanel,
                addExport: this.o.addExport,
                title: this.o.title,
                subtitle: this.o.subtitle,
                footer: this.o.footer
            }));

            this.$TABLE = this.$CONTAINER.find('#' + this.id);

            log.info($.extend(true, {}, this.o.table, {
                data: model.data,
                columns: model.metadata.dsd
            }));

            // switch between server side (ajax) of full table rendering
            if (this.o.table.ajax !== undefined) {
                this.$TABLE.DataTable($.extend(true, {}, this.o.table, {
                    ajax: this.o.table.ajax
                    //languages: this.o.lang,
                    //height: this.o.template.height
                }));
            }else{
                this.$TABLE.DataTable($.extend(true, {}, this.o.table, {
                    data: model.data,
                    columns: model.metadata.dsd
                }));
            }

        };

        Base_template.prototype._initVariable = function () {
            this.o.$container = $(this.o.container);
        };

        Base_template.prototype._validateInput = function () {

            this.errors = {};

            if (!this.o.hasOwnProperty("container")) {
                this.errors['container'] = "'container' attribute not present";
            }

            return (Object.keys(this.errors).length === 0);
        };

        Base_template.prototype.getTable = function () {
            return this.$TABLE;
        };

        Base_template.prototype.refresh = function () {
            this.$TABLE.bootstrapTable('refresh');
        };

        Base_template.prototype.destroy = function () {
            this.$TABLE.bootstrapTable('destroy');
        };

        return Base_template;
    });