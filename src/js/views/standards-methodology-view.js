/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'config/Config',
    'config/Events',
    'globals/Common',
    'text!templates/standards/standards-methodology.hbs',
    'text!templates/standards/standards-methodology-output.hbs',
    'i18n!nls/standards-methodology',
    'faostatapiclient',
    'handlebars',
    'FAOSTAT_UI_TREE',
    'jstree',
    'amplify'
], function ($,
             log,
             View,
             C,
             E,
             Common,
             template,
             templateOutput,
             i18nLabels,
             FAOSTATAPIClient,
             Handlebars,
             Tree
) {

    'use strict';

    var s,
        o,
        MethodologyView;

    s = {

        //TABLE: "#fs-methodology-table",
        TREE: "#fs-methodology-tree",
        INTRO: "#fs-methodology-intro",
        OUTPUT: "#fs-methodology-output"

    },

    o = {

        tableSearchFilters: ['fs-mes-label' ]

    };

    MethodologyView = View.extend({

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

            //this.$table = this.$el.find(s.TABLE);
            this.$tree = this.$el.find(s.TREE);
            this.$output = this.$el.find(s.OUTPUT);
            this.$intro = this.$el.find(s.INTRO);

        },

        initComponents: function () {

            // TODO: lang
            this.FAOSTATAPIClient.methodologies({
                datasource: C.DATASOURCE,
                lang: this.o.lang
            }).then(_.bind(this.showMethodologies, this));

        },

        showMethodologies: function(json) {

            var self = this;
            var data = [];
            _.each(json.data, function(d) {
                data.push({
                    id: d.code,
                    text: d.label
                });
            });

            this.tree = new Tree();
            this.tree.init({
               // options: CM.tree.options || null,
                placeholder_id: this.$tree,
                lang: this.o.lang,
                code: this.o.code,
                custom: data,
                callback: {

                    onClick: _.bind(function (e) {

                        self.showMethodology(e.id, e.label)

                    }, this),

                    onTreeRendered:  _.bind(function (callback) {

                    }, this)

                }
            });

        },

        showMethodology: function(id, label) {

            var self = this;
            this.$intro.hide();

            // TODO: lang
            this.FAOSTATAPIClient.methodology({
                id: id,
                datasource: C.DATASOURCE,
                lang: this.o.lang
            }).then(function(json) {

                /* Load main structure. */
                var t = Handlebars.compile(templateOutput),
                    data = $.extend({}, i18nLabels, json.data[0]);

                data.methodology_title = label;

                self.$output.html(t(data));

            });

        },

        parseTreeData: function(json) {

            var lang = this.o.lang,
                code = this.o.code;

            var data = [];

            _.each(json, function(d) {

                var v = {
                    id: d.id,
                    text: d.title[lang.toLowerCase()] || d.title[lang],
                    state: {
                        expanded: true
                    },
                    nodes: []
                };

                _.each(d.views, function(view) {
                    v.nodes.push({
                        id: view.id,
                        text: view.title[lang.toLowerCase()] || d.title[lang],
                        state: {
                            selected: (view.id === code)
                        }
                    });
                });

                data.push(v);

            });

            return data;

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

    return MethodologyView;

});
