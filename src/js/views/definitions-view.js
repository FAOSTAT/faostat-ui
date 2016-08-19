/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'config/Config',
    'config/Events',
    'config/Analytics',
    'text!templates/definitions/definitions.hbs',
    'text!templates/definitions/definitions-output.hbs',
    'i18n!nls/definitions',
    'globals/Common',
    'faostatapiclient',
    'lib/table/table',
    'handlebars',
    'underscore',
    'amplify'
], function ($,
             log,
             View,
             C,
             E,
             A,
             template,
             templateOutput,
             i18nLabels,
             Common,
             FAOSTATAPIClient,
             Table,
             Handlebars,
             _
             ) {

    'use strict';

    var s,
        DefinitionsView;

    s = {

        DEFINITIONS: "#fs-definitions-list",
        OUTPUT: "#fs-definitions-output",

        // Definition output template
        DEFINITIONS_LIST: "[data-role='definition']",
        DEFINITION_TABLE: "[data-role='table']",

        TABLE: "[data-role='table']",
        EXPORT_DATA: "[data-role='export']",
        TABLE_TOOLBAR: "[data-role='table-toolbar']"

    };

    DefinitionsView = View.extend({

        autoRender: true,

        className: 'definitions',

        template: template,

        initialize: function (options) {
            this.o = $.extend(true, {}, options);
            this.o.cache = {};
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            /* Update State. */
            amplify.publish(E.STATE_CHANGE, {definitions: 'definitions'});

            this.initVariables();

            this.initComponents();

            this.configurePage();

            this.bindEventListeners();

        },

        initVariables: function () {

            this.o.lang = Common.getLocale();

            this.api = new FAOSTATAPIClient();

            this.$definitions = this.$el.find(s.DEFINITIONS);
            this.$output = this.$el.find(s.OUTPUT);

        },

        initComponents: function () {

            var self = this;

            amplify.publish(E.LOADING_SHOW, {container: this.$definitions});

            this.api.definitions_types({
                datasource: C.DATASOURCE,
                lang: this.o.lang
            }).then(_.bind(self._showDefinitions, this))
              .fail(function(e) {
                amplify.publish(E.LOADING_HIDE, {container: self.$definitions});
                //amplify.publish(E.CONNECTION_PROBLEM, {});
            });

        },

        _showDefinitions: function(d) {

            amplify.publish(E.LOADING_HIDE, {container: this.$definitions});

            var self = this,
                data = d.data,
                html = $(templateOutput).filter('#list').html(),
                t = Handlebars.compile(html);

            this.$definitions.html(t({
                    data: data,
                    title: i18nLabels.list
                })
            );

            this.$definitions.find(s.DEFINITIONS_LIST).off();
            this.$definitions.find(s.DEFINITIONS_LIST).on('click', function(e) {

                e.preventDefault();

                var code = $(this).data('code'),
                    label =  $(this).data('label')

                self.$output.empty();

                self._showOutput(code, label);

            });

        },

        _showOutput: function(code, label) {

            var self = this,
                label = label;

            this._analyticsDefinition(code);

            amplify.publish(E.LOADING_SHOW, {container: this.$output});

            this.api.definitions_by_type({
                datasource: C.DATASOURCE,
                lang: this.o.lang,
                type: code
            }).then(function(d) {

                var html = $(templateOutput).filter("#output").html(),
                    t = Handlebars.compile(html);

                amplify.publish(E.LOADING_HIDE, {container: self.$output});

                self.$output.html(t({
                    label: label
                }));

                amplify.publish(E.SCROLL_TO_SELECTOR, {
                    container: self.$output,
                });

                self.$table = self.$output.find(s.TABLE);
                self.$export_data = self.$output.find(s.EXPORT_DATA);
                self.$table_toolbar = self.$output.find(s.TABLE_TOOLBAR);

                self._showTable(d);

            })
            .fail(function(e) {
                amplify.publish(E.LOADING_HIDE, {container: self.$table});
            });

        },

        _showTable: function(model, code) {

            var table = new Table(),
                self = this;

            // se
            model.metadata.dsd = [];
            _.each(model.data[0], function(v, key) {
                model.metadata.dsd.push({
                    key: key,
                    label: key
                })
            });

            table.render({
                container: this.$table,
                model: model,
                adapter: {
                },
                template: {
                    tableClass: null,
                    height: '650',
                    tableOptions: {
                        'data-pagination': true,
                        'data-sortable': false,
                        'data-search': true,
                        'data-show-toggle': true,
                        'data-toolbar': s.TABLE_TOOLBAR
                    },
                    sortable: true,
                    addPanel: false,
                    addExport: false
                },
                remote: {
                    enabled: false,
                    request: {}
                }
            });

            this.o.cache.model = model;

            this.o.matrix = this.createExportMatrix();

            this.$export_data.off();
            this.$export_data.on('click', function() {

                amplify.publish(E.EXPORT_MATRIX_DATA,
                    {
                        data: self.o.matrix
                    }
                );

                self._analyticsDefinitionDownload(code);

            });

        },

        createExportMatrix: function () {

            var model = this.o.cache.model,
                dsd = model.metadata.dsd,
                data = model.data,
                matrix = [],
                v = [];

            v = [];
            _.each(dsd, function(d) {
                v.push(d.label || "");
            });
            matrix.push(v);

            _.each(data, function(row) {
                v = [];
                _.each(dsd, function(d) {
                    v.push(row[d.key] || "");
                });
                matrix.push(v);
            });

            return matrix;

        },

        _analyticsDefinition: function(code) {

            amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                $.extend(this, {},
                    A.definitions.selection,
                    {label: code})
            );

        },

        _analyticsDefinitionDownload: function(code) {

            amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                $.extend(this, {},
                    A.definitions.download,
                    {label: code})
            );

        },

        configurePage: function () {

        },

        bindEventListeners: function () {

        },

        unbindEventListeners: function () {

        },

        dispose: function () {

            this.unbindEventListeners();

            this.$el.empty();

            View.prototype.dispose.call(this, arguments);

        }
    });

    return DefinitionsView;

});
