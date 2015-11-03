/*global define,console*/
define([
        'jquery',
        'handlebars',
        'text!fx-c-c/html/templates/base_template.hbs'
    ],
    function ($, Handlebars, template) {

        'use strict';

        var defaultOptions = {
        };

        function Base_template(config) {
            // this should be always reinitialized
            this.o = {};
            $.extend(true, this.o, defaultOptions, config);
            return this;
        }

        Base_template.prototype.render = function () {

            if (this._validateInput() === true) {
                this._initVariable();
                this._injectTemplate(template);
            } else {
                console.error(this.o.errors);
                throw new Error("FENIX Chart creator has not a valid configuration");
            }

            return this;
        };

        Base_template.prototype._injectTemplate = function () {
            var source = $(template).html();
            var t = Handlebars.compile(source);
            var dynamic_data = this.o;
            var html = t(dynamic_data);
            this.o.$container.html(html);
        };

        Base_template.prototype._initVariable = function () {
            this.o.$container = $(this.o.container);
        };

        Base_template.prototype._validateInput = function () {

            this.o.errors = {};

            if (!this.o.hasOwnProperty("container")) {
                this.o.errors.container = "'container' attribute not present";
            }

            return (Object.keys(this.o.errors).length === 0);
        };

        Base_template.prototype.destroy = function () {

        };

        return Base_template;
    });