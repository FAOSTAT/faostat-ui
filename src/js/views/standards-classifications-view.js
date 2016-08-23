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
    'globals/Common',
    'text!templates/standards/standards-classifications.hbs',
    'text!templates/standards/standards-classifications-output.hbs',
    'i18n!nls/standards-classifications',
    'faostatapiclient',
    'FAOSTAT_UI_TREE',
    'lib/table/table',
    'handlebars',
    'amplify'
], function ($,
             log,
             View,
             C,
             E,
             A,
             Common,
             template,
             templateOutput,
             i18nLabels,
             API,
             Tree,
             Table,
             Handlebars)
    {

    'use strict';

    var s = {

        //TABLE: "#fs-methodology-table",
        TREE: "#fs-classifications-tree",
        SEARCH_TREE: "[data-role='search-tree']",

        INTRO: "#fs-classifications-intro",
        OUTPUT: "#fs-classifications-output",

        TABLE: "[data-role='table']",
        EXPORT_DATA: "[data-role='export']",
        TABLE_TOOLBAR: "#fs-classification-table-toolbar"

    },
    o = {

        requestType: 'classifications',

        cache: {}

    },

    ClassificationsView = View.extend({

        autoRender: true,

        className: 'standards',

        template: template,

        initialize: function (options) {
            this.o = $.extend(true, {}, o, options);
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            /* Update State. */
            amplify.publish(E.STATE_CHANGE, {standards: 'standards'});

            this.initVariables();

            this.initComponents();

            this.bindEventListeners();

            this.configurePage();

        },

        initVariables: function () {

            this.o.lang = Common.getLocale();

            //this.$table = this.$el.find(s.TABLE);
            this.$tree = this.$el.find(s.TREE);
            this.$output = this.$el.find(s.OUTPUT);
            this.$intro = this.$el.find(s.INTRO);

        },

        initComponents: function () {

            this.tree = new Tree();
            this.tree.init({
                placeholder_id: this.$tree,
                placeholder_search: this.$el.find(s.SEARCH_TREE),
                //code: 'QC',
                callback: {
                    // Render Section
                    onDomainClick: _.bind(function (callback) {

                        var code =  callback.id,
                            label = callback.label;

                        this._analyticsSelection(code);

                        this.showClassification(code, label);

                        amplify.publish(E.SCROLL_TO_SELECTOR, {container: this.$output});

                    }, this),

                    onGroupClick: _.bind(function (callback) {

                        this.$output.hide();
                        this.$intro.show();

                        amplify.publish(E.SCROLL_TO_SELECTOR, {container: this.$output});

                    }, this)
                }
            });

        },

        showClassification: function(code, label) {

            // hide intro
            this.$intro.hide();
            this.$output.empty();
            this.$output.show();

            this.o.code = code;
            this.o.label = label;

            amplify.publish(E.LOADING_SHOW, {container: this.$output});

            // get classification
            API[this.o.requestType]({
                    domain_code: code
                })
                .then(_.bind(this.showTable, this))
                .fail(function(e) {
                    amplify.publish(E.CONNECTION_PROBLEM, {});
                });

        },

        showTable: function(model) {

            amplify.publish(E.LOADING_HIDE, {container: this.$output});

            var t = Handlebars.compile(templateOutput),
                data = $.extend(true, {}, i18nLabels),
                label = this.o.label,
                self = this;

            data.classsification_title = label;

            this.$output.html(t(data));

            this.$table = this.$el.find(s.TABLE);
            this.$export_data = this.$el.find(s.EXPORT_DATA);
            this.$table_toolbar = this.$el.find(s.TABLE_TOOLBAR);

            var table = new Table();

            // TODO: this should come from the service or anyway should be read from the first row of the model.data
            model.metadata.dsd = [
                {
                    key: "code",
                    label: i18nLabels.code_title
                },{
                    key: "label",
                    label: i18nLabels.label_title
                },{
                    key: "description",
                    label: i18nLabels.description_title
                }

            ];

            table.render({
                container: this.$table,
                model: model,
                adapter: {
                },
                template: {
                    tableClass: null,
                    // TODO: add in config
                    height: '650',
                    tableOptions: {
                        'data-pagination': true,
                        'data-sortable': false,
                        'data-search': true,
                        'data-show-toggle': true,
                        // TODO: change with selectors
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

            this.$table_toolbar.show();

            this.o.matrix = this.createExportMatrix();

            this.$export_data.on('click', function() {

                log.info(self.o.matrix);

                amplify.publish(E.EXPORT_MATRIX_DATA,
                    {
                        data: self.o.matrix
                    }
                );

                self._analyticsDownload(self.o.code);
                
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

        _analyticsSelection: function (code) {

            amplify.publish(E.GOOGLE_ANALYTICS_EVENT, {
                category: A.classifications.selection.category,
                action: A.classifications.selection.action,
                label: code
            });

        },

        _analyticsDownload: function (code) {

            amplify.publish(E.GOOGLE_ANALYTICS_EVENT, {
                category: A.classifications.download.category,
                action: A.classifications.download.action,
                label: code
            });

        },

        configurePage: function () {

        },

        bindEventListeners: function () {

        },

        unbindEventListeners: function () {

        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return ClassificationsView;

});
