/*global define*/
define([
        'jquery',
        'handlebars',
        'loglevel',
        'text!fs-t-c/templates/custom_template.hbs',
        'text!fs-t-c/templates/table_template.hbs',
       /*'text!lib/table/templates/custom_template.hbs',
        'text!lib/table/templates/table_template.hbs',*/
        'i18n!nls/common',
        'bootstrap-table'
    ],
    function ($, Handlebars, log, template, templateTable, i18n) {

        'use strict';

        var defaultOptions = {},
            s = {
              TABLE_CONTENT: '[data-role="content"]',
              TABLE: '[data-role="table"]'
            };

        function Base_template() {
           this.o =  $.extend(true, {}, defaultOptions);
        }

        Base_template.prototype.render = function (config) {

            this.o =  $.extend(true, {}, this.o, config);

            if (this._validateInput() === true) {
                this._initVariable();
                this._injectTemplate();
            } else {
                //console.error(this.errors);
                throw new Error("FENIX Map creator has not a valid configuration");
            }
        };

        Base_template.prototype._injectTemplate = function () {

            // inject basic structure
            var t = Handlebars.compile(template);
            // this.o.$container.html(t(this.o.template || {}));
            this.o.$container.html(t($.extend(true, {download_data: i18n.download_data}, this.o.template || {})));

            // inject table
            var $table_content = this.o.$container.find(s.TABLE_CONTENT);
            var t = Handlebars.compile(templateTable);
            var d  = $.extend(true,  {}, this.o.template, this.o.filteredModel);
            $table_content.html(t(d));

            this.$TABLE = $table_content.find(s.TABLE);

            //log.info("Table._injectTemplate; o:", this.o, this.o.template.ajax);


            // http://bootstrap-table.wenzhixin.net.cn/documentation/
            //formatLoadingMessage 'Loading, please wait…'
            // formatNoMatches

            // switch between server side (ajax) of full table rendering
            if (this.o.template.ajax !== undefined) {
                this.$TABLE.bootstrapTable({
                    ajax: this.o.template.ajax,
                    locale: this.o.lang,
                    height: this.o.template.height
                });
            }else{
                this.$TABLE.bootstrapTable({
                    data: this.o.model.data,
                    locale: this.o.lang,
                    height: this.o.template.height
                });

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
            this.o.$container.empty();
        };

        return Base_template;
    });