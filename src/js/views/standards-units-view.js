/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
define([
    'views/base/view',
    'config/Config',
    'config/Events',
    'text!templates/standards/standards-units.hbs',
    'text!templates/standards/standards-table.hbs',
    'i18n!nls/standards-units',
    'faostatapiclient',
    'list',
    'handlebars',
    'amplify',
], function (View,
             C,
             E,
             template,
             templateTable,
             i18nLabels,
             FAOSTATAPIClient,
             List,
             Handlebars) {

    'use strict';

    var s,
        o,
        UnitsView;

    s = {

        TABLE: "#fs-units-table"

    },

    o = {

        tableSearchFilters: ['fs-mes-code', 'fs-mes-label' ]

    };

    UnitsView = View.extend({

        autoRender: true,

        className: 'standards',

        template: template,

        initialize: function (options) {
            this.o = $.extend({}, o, options);
            console.log(this.o);
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            console.log("Units");

            View.prototype.attach.call(this, arguments);

            /* Update State. */
            amplify.publish(E.STATE_CHANGE, {standards: 'standards'});

            this.initVariables();

            this.initComponents();

            this.bindEventListeners();

            this.configurePage();
        },

        initVariables: function () {

            this.FAOSTATAPIClient = new FAOSTATAPIClient();

            this.$table = this.$el.find(s.TABLE);

        },

        initComponents: function () {

            // TODO: lang
            this.FAOSTATAPIClient.units({
                lang: this.o.lang
            }).then(_.bind(this.showTable, this));

        },

        showTable: function(json) {

            var template, dynamic_data, html;

            /* Load main structure. */
            //source = $(templates).filter('#faostat_ui_standards_units_table').html();
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

            var list = new List(this.$table.selector.replace('#',''), options);

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

    return UnitsView;

});
