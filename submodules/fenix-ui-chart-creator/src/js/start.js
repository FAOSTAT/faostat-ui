/*global define, console*/
define([
        'require',
        'jquery',
        'fx-c-c/adapters/star_schema_adapter',
        'fx-c-c/adapters/matrix_schema_adapter',
        'fx-c-c/adapters/FENIX_adapter',
        'fx-c-c/templates/base_template',
        'fx-c-c/creators/highcharts_creator'
    ],
    function (RequireJS, $) {

        'use strict';

        var defaultOptions = {
            default: ''
        };

        function ChartCreator() {
            $.extend(true, this, defaultOptions);
            return this;
        }

        ChartCreator.prototype.init = function (config) {
            this.dfd = $.Deferred();

            var self = this;
            try {
                if (this._validateInput(config)) {
                    this.preloadResources(config);
                }
            }catch(e) {
                self.onError(e);
            }

            // Return the Promise so caller can't change the Deferred
            return this.dfd.promise();
        };

        ChartCreator.prototype.render = function (config) {

            var template = new this.templateFactory(
                    $.extend(true, {model: config.model, container: config.container}, config.template)
                ),
                creator = new this.creatorFactory(
                    $.extend(true, {container: config.container, noData: config.noData}, config.creator)
                );

            // render template
            template.render();

            var chartObj = this.adapter.prepareChart(config.adapter || {});

            // TODO: Handle the error
            try {

                // getting chart definition


                //console.log(chartObj);

                // render chart
                creator.render({chartObj: chartObj});

            }catch(e) {
                creator.noDataAvailable();
            }

            return {
                destroy: $.proxy(function () {

                    creator.destroy();
                    template.destroy();

                }, this)
            };
        };

        ChartCreator.prototype.preloadResources = function (config) {

            var baseTemplate = this.getTemplateUrl(),
                adapter = this.getAdapterUrl(config.model, (config.adapter)? config.adapter.adapterType: null),
                creator = this.getCreatorUrl(),
                self = this;

            RequireJS([
                baseTemplate,
                adapter,
                creator
            ], function (Template, Adapter, Creator) {

                self.templateFactory = Template;
                self.creatorFactory = Creator;

                // TODO: use one configuration object in this phase
                self.adapter = new Adapter($.extend(true, {model: config.model}, config.adapter));
                self.adapter.prepareData($.extend(true, {model: config.model}, config.adapter));

                if (typeof config.onReady === 'function') {
                    config.onReady(self);
                }
                self.dfd.resolve(self);
            });
        };

        ChartCreator.prototype.onError = function (e) {
            console.error("ChartCreator Error: ", e);
            // TODO: Add an Error message
            this.dfd.reject("ChartCreator Error: ", e);
        };

        ChartCreator.prototype.getAdapterUrl = function (model, adapterType) {

            // TODO add here adapter discovery logic

           // TODO: Dirty switch to check wheater there is an adapterType specified
            if (adapterType !== null && adapterType !== undefined) {
                switch(adapterType.toLocaleLowerCase()) {
                    case 'fenix': return this.adapterUrl ? this.adapterUrl : 'fx-c-c/adapters/FENIX_adapter';
                    case 'wds-array': return this.adapterUrl ? this.adapterUrl : 'fx-c-c/adapters/matrix_schema_adapter';
                    case 'wds-objects': return this.adapterUrl ? this.adapterUrl : 'fx-c-c/adapters/star_schema_adapter';
                }
            }
            else {
                // TODO: Dirty check to be modified
                // TODO: Validate the model (What to do in case or errors?)
                if (model.data && model.metadata) {
                    return this.adapterUrl ? this.adapterUrl : 'fx-c-c/adapters/FENIX_adapter';
                }
                else if (model.length > 0 && Array.isArray(model[0])) {
                    return this.adapterUrl ? this.adapterUrl : 'fx-c-c/adapters/matrix_schema_adapter';
                }
                else if (model.length > 0 && typeof model[0] === 'object') {
                    return this.adapterUrl ? this.adapterUrl : 'fx-c-c/adapters/star_schema_adapter';
                }
                else {
                    throw new Error("The are not available adapter for the current model:", model);
                }
            }
        };

        ChartCreator.prototype.getTemplateUrl = function () {
            //TODO add here template discovery logic
            return this.templateUrl? this.templateUrl: 'fx-c-c/templates/base_template';
        };

        ChartCreator.prototype.getCreatorUrl = function () {
            //TODO add here template discovery logic
            return this.creatorUrl? this.creatorUrl: 'fx-c-c/creators/highcharts_creator';
        };

        ChartCreator.prototype._validateInput = function () {
            return true;
        };

        return ChartCreator;
    });