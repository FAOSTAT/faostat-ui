/*global define*/
define([
        'require',
        'jquery',
        'fx-t-c/templates/base_template',
        'fx-t-c/adapters/d3s_jqwidgets'
    ],
    function (RequireJS, $) {

        'use strict';

        var defaultOptions = {
            default: ''
        };

        function TableCreator() {
            $.extend(true, this, defaultOptions);
        }

        TableCreator.prototype.render = function (config) {

/*
            config.model = this.testData();
*/
            if (this._validateInput(config)) {
                this.preloadResources(config);
            }
        };



        TableCreator.prototype.preloadResources = function (config) {

            var baseTemplate = this.getTemplateUrl(),
                adapter = this.getAdapterUrl(),
                self = this;

            RequireJS([
                baseTemplate,
                adapter
            ], function (Template, Adapter) {

                self.template = new Template();
                self.adapter = new Adapter();

                //currently both of them are sync fns
                self.template.render(config);
                self.adapter.render(config);
            });
        };

        TableCreator.prototype.getAdapterUrl = function () {
            //TODO add here adapter discovery logic
            return this.adapterUrl ? this.adapterUrl : 'fx-t-c/adapters/d3s_jqwidgets';
        };

        TableCreator.prototype.getTemplateUrl = function () {
            //TODO add here template discovery logic
            return this.templateUrl ? this.templateUrl : 'fx-t-c/templates/base_template';
        };

        TableCreator.prototype._validateInput = function () {
            return true;
        };

        TableCreator.prototype.destroy = function () {

            if (this.template) {
                this.template.destroy();
            }

            if (this.adapter) {
                this.adapter.destroy();
            }

        };

        TableCreator.prototype.applyEvent = function (event) {
            return this.adapter.applyEvent(event);
        };

        TableCreator.prototype.setCodelist = function(callback) {
            // TODO
        }



        return TableCreator;
    });