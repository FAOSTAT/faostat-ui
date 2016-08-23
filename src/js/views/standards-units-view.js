/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'config/Config',
    'config/Events',
    'config/Analytics',
    'globals/Common',
    'text!templates/standards/standards-units.hbs',
    'i18n!nls/standards-units',
    'faostatapiclient',
    'lib/table/table',
    'amplify'
], function ($,
             log,
             View,
             C,
             E,
             A,
             Common,
             template,
             i18nLabels,
             API,
             Table
) {

    'use strict';

    var s = {

            CONTAINER: "[data-role='container']",
            TABLE: "[data-role='table']",
            EXPORT_DATA: "[data-role='export']",
            TABLE_TOOLBAR: "#fs-units-table-toolbar"

        },

        o = {

            requestType: 'units',

            cache: {}

        },

        AbbreviationsView = View.extend({

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

                this.$table = this.$el.find(s.TABLE);
                this.$export_data = this.$el.find(s.EXPORT_DATA);
                this.$table_toolbar = this.$el.find(s.TABLE_TOOLBAR);

            },

            initComponents: function () {

                amplify.publish(E.LOADING_SHOW, {container: this.$table});

                API[this.o.requestType]().then(_.bind(this.showTable, this));

            },

            showTable: function(model) {

                amplify.publish(E.LOADING_HIDE, {container: this.$table});

                var table = new Table();

                // TODO: this should come from the service or anyway should be read from the first row of the model.data
                model.metadata.dsd = [
                    {
                        key: "code",
                        label: i18nLabels.code_title
                    },{
                        key: "label",
                        label: i18nLabels.label_title
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

            _analyticsDownload: function () {

                amplify.publish(E.GOOGLE_ANALYTICS_EVENT, {
                    category: A.units.download.category,
                    action: A.units.download.action,
                    label: ""
                });

            },

            configurePage: function () {

            },

            bindEventListeners: function () {

                var self = this;

                this.$export_data.on('click', function() {

                    amplify.publish(E.EXPORT_MATRIX_DATA,
                        {
                            data: self.o.matrix
                        }
                    );

                    self._analyticsDownload();
                    
                });

            },

            unbindEventListeners: function () {

                this.$export_data.off('click');

            },

            dispose: function () {

                this.unbindEventListeners();

                View.prototype.dispose.call(this, arguments);
            }
        });

    return AbbreviationsView;

});
