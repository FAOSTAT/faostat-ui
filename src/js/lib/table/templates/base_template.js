/*global define*/
define([
        'jquery',
        'handlebars',
        'loglevel',
        'text!fs-t-c/templates/custom_template.hbs',
        'text!fs-t-c/templates/table_template.hbs',
        'bootstrap',
    ],
    function ($, Handlebars, log, template, templateTable) {

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


            var data = [
                {
                    "name": "bootstrap-table",
                    "stargazers_count": "526",
                    "forks_count": "122",
                    "description": "An extended Bootstrap table with radio, checkbox, sort, pagination, and other added features. (supports twitter bootstrap v2 and v3) "
                },
                {
                    "name": "multiple-select",
                    "stargazers_count": "288",
                    "forks_count": "150",
                    "description": "A jQuery plugin to select multiple elements with checkboxes :)"
                },
                {
                    "name": "bootstrap-show-password",
                    "stargazers_count": "32",
                    "forks_count": "11",
                    "description": "Show/hide password plugin for twitter bootstrap."
                },
                {
                    "name": "blog",
                    "stargazers_count": "13",
                    "forks_count": "4",
                    "description": "my blog"
                },
                {
                    "name": "scutech-redmine",
                    "stargazers_count": "6",
                    "forks_count": "3",
                    "description": "Redmine notification tools for chrome extension."
                }
            ];


            $table_content.find(s.TABLE).bootstrapTable({
                data: data
            });

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