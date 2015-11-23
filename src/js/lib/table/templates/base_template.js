/*global define*/
define([
        'jquery',
        'handlebars',
        'loglevel',
        'text!fs-t-c/templates/custom_template.hbs',
        'text!fs-t-c/templates/table_template.hbs'
    ],
    function ($, Handlebars, log, template, templateTable) {

        'use strict';

        var defaultOptions = {},
            s = {
              TABLE_CONTENT: '[data-role="content"]'
            };

        function Base_template() {
           this.o =  $.extend(true, {}, defaultOptions);
        }

        Base_template.prototype.render = function (config) {

            this.o =  $.extend(true, {}, this.o, config);

            log.info("herheh")

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
            this.o.$container.html(t(this.o.template || {}));

            // inject table
            var $table_content = this.o.$container.find(s.TABLE_CONTENT);

            var t = Handlebars.compile(templateTable);
            $table_content.html(t({}));

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

        return Base_template;
    });