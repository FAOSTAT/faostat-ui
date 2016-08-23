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
    'text!templates/standards/standards-methodology.hbs',
    'text!templates/standards/standards-methodology-output.hbs',
    'i18n!nls/standards-methodology',
    'faostatapiclient',
    'handlebars',
    'FAOSTAT_UI_TREE',
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
        SEARCH_TREE: "[data-role='search-tree']",

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

            //this.$table = this.$el.find(s.TABLE);
            this.$tree = this.$el.find(s.TREE);
            this.$output = this.$el.find(s.OUTPUT);
            this.$intro = this.$el.find(s.INTRO);

        },

        initComponents: function () {

            var self = this;

            amplify.publish(E.LOADING_SHOW, {container: this.$tree});

            // TODO: lang
            API.methodologies()
                .then(_.bind(this.showMethodologies, this))
                .fail(function(e) {
                    amplify.publish(E.LOADING_HIDE, {container: self.$tree});
                    amplify.publish(E.CONNECTION_PROBLEM, {});
                });

        },

        showMethodologies: function(json) {

            amplify.publish(E.LOADING_HIDE, {container: this.$tree});

            var self = this;
            var data = [];
            _.each(json.data, function(d) {
                data.push({
                    id: d.code,
                    text: d.label,
                    li_attr: {
                        id: d.code,
                        label: d.label
                    },

                });
            });

            this.tree = new Tree();
            this.tree.init({
                // options: CM.tree.options || null,
                placeholder_id: this.$tree,
                placeholder_search: this.$el.find(s.SEARCH_TREE),
                code: this.o.code,
                custom: data,
                callback: {

                    onClick: _.bind(function (e) {

                        self.showMethodology(e.id, e.label);

                        amplify.publish(E.SCROLL_TO_SELECTOR, { container: self.$output});

                    }, this),

                    onTreeRendered: _.bind(function (callback) {

                    }, this)

                }
            });

        },

        showMethodology: function(id, label) {

            var self = this;
            this.$intro.hide();

            // Analytics
            this._analytics(id);

            amplify.publish(E.LOADING_SHOW, {container: self.$output});

            // TODO: lang
            API.methodology({
                id: id
            }).then(function(json) {

                amplify.publish(E.LOADING_HIDE, {container: self.$output});

                /* Load main structure. */
                var t = Handlebars.compile(templateOutput),
                    data = $.extend({}, i18nLabels, json.data[0]);

                data.methodology_title = label;

                self.$output.html(t(data));

            });

        },

        _analytics: function (id) {

            amplify.publish(E.GOOGLE_ANALYTICS_EVENT, {
                category: A.methodology.selection.category,
                action: A.methodology.selection.action,
                label: id
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

    return MethodologyView;

});
