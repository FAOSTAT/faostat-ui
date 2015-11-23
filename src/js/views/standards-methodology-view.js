/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
define([
    'jquery',
    'views/base/view',
    'config/Config',
    'config/Events',
    'globals/Common',
    'text!templates/standards/standards-methodology.hbs',
    'text!templates/standards/standards-methodology-output.hbs',
    'i18n!nls/standards-methodology',
    'faostatapiclient',
    'handlebars',
    'jstree',
    'amplify'
], function ($,
             View,
             C,
             E,
             Common,
             template,
             templateOutput,
             i18nLabels,
             FAOSTATAPIClient,
             Handlebars) {

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
                lang: this.o.lang,
            }).then(_.bind(this.showMethodologies, this));

        },

        showMethodologies: function(json) {

            var self = this;

            var data = json.data;
            var payload = [];
            /* Iterate over domains. */
            for (var i = 0; i < data.length; i++) {
                payload.push({
                    id: data[i].code,
                    text: data[i].label,
                    parent: '#'
                });
            }

            /* Init JSTree. */
            this.$tree.jstree({

                plugins: ['unique', 'search', 'types', 'wholerow'],

                core: {
                    data: payload,
                    themes: {
                        icons: false,
                        responsive: true
                    }
                },

                search: {
                    show_only_matches: true,
                    close_opened_onclear: false
                }

            });

            /* Implement node selection. */
            this.$tree.on('activate_node.jstree', function (e, data) {

                self.showMethodology(data.node.id, data.node.text)
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
