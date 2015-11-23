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
    'text!templates/standards/standards-classifications.hbs',
    'text!templates/standards/standards-classifications-output.hbs',
    'i18n!nls/standards-classifications',
    'faostatapiclient',
    'FAOSTAT_UI_TREE',
    'list',
    'handlebars',
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
             Tree,
             List,
             Handlebars)
    {

    'use strict';

    var s,
        o,
        ClassificationsView;

    s = {

        //TABLE: "#fs-methodology-table",
        TREE: "#fs-classifications-tree",
        INTRO: "#fs-classifications-intro",
        OUTPUT: "#fs-classifications-output",
        TABLE: '#fs-classifications-table',

        EXPORT_DATA: "[data-role='export']"

    },
    o = {

        requestType: 'classifications',

        tableSearchFilters: ['fs-mes-code', 'fs-mes-label', 'fs-mes-description' ]

    };

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

            this.FAOSTATAPIClient = new FAOSTATAPIClient();

            //this.$table = this.$el.find(s.TABLE);
            this.$tree = this.$el.find(s.TREE);
            this.$output = this.$el.find(s.OUTPUT);
            this.$intro = this.$el.find(s.INTRO);

        },

        initComponents: function () {

            this.tree = new Tree();
            this.tree.init({
                placeholder_id: this.$tree,
                //code: 'QC',
                callback: {
                    // Render Section
                    onDomainClick: _.bind(function (callback) {

                        var code =  callback.id,
                            label = callback.label;

                        this.showClassification(code, label);

                    }, this),

                    onGroupClick: _.bind(function (callback) {

                        this.$output.hide();
                        this.$intro.show();

                    }, this)
                }
            });

        },

        showClassification: function(code, label) {

            var self = this;

            // hide intro
            this.$intro.hide();


            this.$intro.hide();


            // get classification
            this.FAOSTATAPIClient[this.o.requestType]({
                domain_code: code,
                datasource: C.DATASOURCE,
                lang: this.o.lang
            }).then(_.bind(function(json){

                var t = Handlebars.compile(templateOutput),
                    data = $.extend({}, i18nLabels);

                data.rows = json.data;
                data.classsification_title = i18nLabels.classification + ' - ' + label;

                this.$output.html(t(data));

                // add list.js
                var options = {
                    valueNames: this.o.tableSearchFilters
                };

                var list = new List(s.TABLE.replace('#',''), options);

                // add export listener
                this.$output.find(s.EXPORT_DATA).on('click', function() {
                    amplify.publish(E.EXPORT_DATA,
                        {
                            domain_code: code
                        },
                        {
                            "requestType": self.o.requestType
                        }
                    );
                });


                // render output
                this.$output.show();

            }, this));

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
