/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
define([
    'jquery',
    'views/base/view',
    'config/Config',
    'config/Events',
    'globals/Common',
    'text!templates/standards/standards-abbreviations.hbs',
    'text!templates/standards/standards-table.hbs',
    'i18n!nls/standards-methodology',
    'faostatapiclient',
    'list',
    'handlebars',
    'amplify'
], function ($,
             View,
             C,
             E,
             Common,
             template,
             templateTable,
             i18nLabels,
             FAOSTATAPIClient,
             List,
             Handlebars) {

    'use strict';

    var s,
        o,
        AbbreviationsView;

    s = {

        TABLE: "#fs-abbreviations-table",
        EXPORT_DATA: "[data-role='export']"

    },

    o = {

        // this is used for export
        requestType: 'abbreviations',

        tableSearchFilters: ['fs-mes-code', 'fs-mes-label' ]

    };

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

            this.FAOSTATAPIClient = new FAOSTATAPIClient();

            this.$table = this.$el.find(s.TABLE);
            this.$export_data = this.$el.find(s.EXPORT_DATA);

        },

        initComponents: function () {

            amplify.publish(E.LOADING_SHOW, {container: this.$table});

            this.FAOSTATAPIClient[this.o.requestType]({
                datasource: C.DATASOURCE,
                lang: this.o.lang
            }).then(_.bind(this.showTable, this));

        },

        showTable: function(json) {

            amplify.publish(E.LOADING_HIDE, {container: this.$table});

            var template, dynamic_data, html;

            /* Load main structure. */
            template = Handlebars.compile(templateTable);
            dynamic_data = {
                rows: json.data
            };
            $.extend(dynamic_data, i18nLabels);
            html = template(dynamic_data);
            this.$table.append(html);

            // add list.js
            var options = {
                valueNames: this.o.tableSearchFilters,
                page: 200000
            };

            var list = new List(this.$table.selector.replace('#',''), options);

        },

        configurePage: function () {

        },

        bindEventListeners: function () {

            var self = this;

            this.$export_data.on('click', function() {
                amplify.publish(E.EXPORT_DATA,
                    {},
                    {
                        "requestType": self.o.requestType
                    }
                );
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
