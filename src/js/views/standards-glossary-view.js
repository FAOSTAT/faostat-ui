/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
define([
    'views/base/view',
    'config/Config',
    'config/Events',
    'globals/Common',
    'text!templates/standards/standards-glossary.hbs',
    'text!templates/standards/standards-glossary-table.hbs',
    'i18n!nls/standards-glossary',
    'faostatapiclient',
    'list',
    'handlebars',
    'amplify'
], function (View,
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
        GlossaryView;

    s = {

        TABLE: "#fs-glossary-table"

    },

    o = {

        tableSearchFilters: ['fs-mes-code', 'fs-mes-label', 'fs-mes-source' ]

    };

    GlossaryView = View.extend({

        autoRender: true,

        className: 'standards',

        template: template,

        initialize: function (options) {
            this.o = $.extend({}, o, options);
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

        },

        initComponents: function () {

            // TODO: lang
            this.FAOSTATAPIClient.glossary({
                datasource: C.DATASOURCE,
                lang: this.o.lang
            }).then(_.bind(this.showTable, this));

        },

        showTable: function(json) {

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
                valueNames: this.o.tableSearchFilters
            };

            new List(this.$table.selector.replace('#',''), options);

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

    return GlossaryView;

});