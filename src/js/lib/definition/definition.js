/*global define, _:false, $, amplify, FM */
define([
    'jquery',
    'loglevel',
    'globals/Common',
    'config/Config',
    'config/Events',
    'config/Analytics',
    'text!lib/definition/templates/templates.hbs',
    'handlebars',
    'faostatapiclient',
    'lib/table/table',
    'underscore',
    'underscore.string',
    'amplify'
], function ($, log, Common, C, E, A, templates, Handlebars, FAOSTATAPIClient, Table, _, _s) {

    'use strict';

    var s = {
            OUTPUT: "[data-role='output']",

            TABLE: "[data-role='table']",
            EXPORT_DATA: "[data-role='export']",
            TABLE_TOOLBAR: "[data-role='table-toolbar']"
        },

        defaultOptions = {
            table: {
                height: '650',
                pageSize: 250
            }
        };

    function Definition() {
        return this;
    }

    Definition.prototype.render = function (options) {

        this.o = $.extend(true, {}, defaultOptions, options);

        if (!this.o.hasOwnProperty('container')) {
            log.error('Definitions.render; Missing container option', this.o);
        }

        this.o.lang = Common.getLocale();
        this.o.cache = {};

        this.api = new FAOSTATAPIClient();

        this._initVariables();

        this._configurePage();

    };

    Definition.prototype._initVariables = function () {

        this.FAOSTATAPIClient = new FAOSTATAPIClient();

        this.$CONTAINER = $(this.o.container);

        var html = $(templates).filter("#template").html(),
            t = Handlebars.compile(html);

        this.$CONTAINER.html(t({
            label: this.o.label
        }));

        // init variables
        this.$OUTPUT = this.$CONTAINER.find(s.OUTPUT);
    };

    Definition.prototype._configurePage = function () {

        // TODO: add more checks?
        if(this.o.hasOwnProperty('domain_code') && this.o.hasOwnProperty('type')) {
            this._definition_domain();
        }
        else if(this.o.hasOwnProperty('type')) {
            this._definition_by_type();
        }
        else {
            log.error('Definition._configurePage; missing domain_code or type from configuration', this.o);
            throw new Error('Definition._configurePage; missing domain_code or type from configuration', this.o);
        }

    };

    Definition.prototype._definition_by_type = function () {

        var self = this,
            lang = this.o.lang,
            type = this.o.type;

        amplify.publish(E.LOADING_SHOW, {container: this.$OUTPUT});

        this.api.definitions_by_type({
            datasource: C.DATASOURCE,
            lang: lang,
            type: type
        }).then(function (model) {

            log.info("Definition._definition_by_type");

            // show table and output
            self._show(model);

            // TODO: refactor
            self.$EXPORT_DATA.off();
            self.$EXPORT_DATA.on('click', function () {

                amplify.publish(E.EXPORT_MATRIX_DATA,
                    {
                        data: self.o.matrix
                    }
                );

                self._analyticsDefinitionTypesDownload(type);

            });

        })
        .fail(function (e) {
            amplify.publish(E.LOADING_HIDE, {container: self.$OUTPUT});
        });

    };

    Definition.prototype._definition_domain = function () {

        var self = this,
            lang = this.o.lang,
            domain_code = this.o.domain_code,
            type = this.o.type,
            analyticsLabel = domain_code + " - " + type;

        amplify.publish(E.LOADING_SHOW, {container: this.$OUTPUT});

        this.api.definitions_domain_by_type({
            datasource: C.DATASOURCE,
            lang: lang,
            domain_code: domain_code,
            type: type
        }).then(function (model) {

            log.info("Definition._definition_by_type");

            // show table and output
            self._show(model);

            // TODO: refactor
            self.$EXPORT_DATA.off();
            self.$EXPORT_DATA.on('click', function () {

                amplify.publish(E.EXPORT_MATRIX_DATA,
                    {
                        data: self.o.matrix
                    }
                );

                self._analyticsDefinitionDomainDownload(analyticsLabel);

            });

        })
            .fail(function (e) {
                amplify.publish(E.LOADING_HIDE, {container: self.$OUTPUT});
            });

    };

    Definition.prototype._show = function(model) {

        var self = this;

        var html = $(templates).filter("#output").html(),
            t = Handlebars.compile(html);

        amplify.publish(E.LOADING_HIDE, {container: self.$OUTPUT});

        this.$OUTPUT.html(t());

        amplify.publish(E.SCROLL_TO_SELECTOR, {
            container: self.$OUTPUT
        });

        this.$TABLE = self.$OUTPUT.find(s.TABLE);
        this.$EXPORT_DATA = self.$OUTPUT.find(s.EXPORT_DATA);
        this.$TABLE_TOOLBAR = self.$OUTPUT.find(s.TABLE_TOOLBAR);

        this._showTable(model);

    };

    Definition.prototype._showTable = function (model) {

        log.info("Definition._showTable", model);

        var table = new Table(),
            self = this;

        // se
        model.metadata.dsd = [];
        _.each(model.data[0], function (v, key) {
            model.metadata.dsd.push({
                key: key,
                label: key
            })
        });

        table.render({
            container: this.$TABLE,
            model: model,
            adapter: {},
            template: {
                title: this.o.table.title,
                tableClass: null,
                height: this.o.table.height,
                tableOptions: {
                    'data-page-size': this.o.table.pageSize,
                    'data-pagination': true,
                    'data-search': true,
                    'data-show-toggle': true,
                    //'data-toolbar': self.$TABLE_TOOLBAR.selector
                    'data-toolbar': s.TABLE_TOOLBAR
                },
                sortable: true,
                addPanel: true, //TODO: make it configurable
                addExport: false
            }
        });

        this.o.cache.model = model;

        this.o.matrix = this._createExportMatrix();

    };

    Definition.prototype._createExportMatrix = function () {

        log.info('Definition._createExportMatrix;');

        var model = this.o.cache.model,
            dsd = model.metadata.dsd,
            data = model.data,
            matrix = [],
            v = [];

        v = [];
        _.each(dsd, function (d) {
            v.push(d.label || "");
        });
        matrix.push(v);

        _.each(data, function (row) {
            v = [];
            _.each(dsd, function (d) {
                v.push(row[d.key] || "");
            });
            matrix.push(v);
        });

        return matrix;

    };

    Definition.prototype._analyticsDefinitionTypesDownload = function (label) {

        amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
            $.extend(this, {},
                A.definitions.download_types,
                {label: label})
        );

    };

    Definition.prototype._analyticsDefinitionDomainDownload = function (label) {

        amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
            $.extend(this, {},
                A.definitions.download_domain,
                {label: label})
        );

    };

    Definition.prototype._bindEventListeners = function () {

    };

    Definition.prototype._unbindEventListeners = function () {

    };

    Definition.prototype.destroy = function () {

        log.info("Definition.destroy;");

        this._unbindEventListeners();

        // destroy all filters
        if (this.$CONTAINER !== undefined) {
            this.$CONTAINER.empty();
        }

    };

    return Definition;
});
