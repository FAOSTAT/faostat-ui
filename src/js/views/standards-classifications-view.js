/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
define([
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
], function (View,
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
        OUTPUT: "#fs-classifications-output"

    },

    o = {

        tableSearchFilters: ['fs-mes-label' ]

    };

    ClassificationsView = View.extend({

        autoRender: true,

        className: 'standards',

        template: template,

        initialize: function (options) {
            this.o = $.extend({}, o, options);
            console.log(template);
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            /* Update State. */
            amplify.publish(E.STATE_CHANGE, {standards: 'standards'});

            this.initVariables();

            //var self = this;
            //
            //setTimeout(function(){
            //
            //
            //    self.initComponents();
            //
            //    self.bindEventListeners();
            //
            //    self.configurePage();
            //
            //}, 1000);

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

                        console.log(callback);
                        //TODO: make intro visible and output hidden

                        //var type = this.tree.getCodeType(),
                        //    code = callback.id,
                        //    label = callback.i;
                        //
                        //console.log(callback);
                        //
                        //if ( type === 'domain') {
                        //    // show classifications of the domaincode
                        //}
                        //else if (type === 'group') {
                        //    //TODO: make intro visible and output hidden
                        //}

                    }, this)
                }
            });

        },


        showClassification: function(code, label) {

            // hide intro
            this.$intro.hide();


            // get classification
            this.FAOSTATAPIClient.classifications({
                domain_code: code,
                datasource: C.DATASOURCE,
                lang: this.o.lang
            }).then(_.bind(function(json){

                console.log(json.data);

                var template, dynamic_data, html;

                /* Load main structure. */
                console.log(templateOutput);
                template = Handlebars.compile(templateOutput);

                dynamic_data = $.extend({}, i18nLabels);
                dynamic_data.data = json.data;
                dynamic_data.classibiction_title = label;

                html = template(dynamic_data);
                this.$output.html(html);
                this.$output.show();

            }, this));

            // show
            // fill template



            //
            //var self = this;
            //this.$intro.hide();
            //
            //// TODO: lang
            //this.FAOSTATAPIClient.methodology({
            //    id: id,
            //    datasource: C.DATASOURCE,
            //    lang: this.o.lang
            //}).then(function(json) {
            //
            //    console.log(json);
            //
            //    var template, dynamic_data, html;
            //
            //    console.log(json.data[0]);
            //
            //    /* Load main structure. */
            //    template = Handlebars.compile(templateOutput);
            //
            //    dynamic_data = $.extend({}, i18nLabels, json.data[0]);
            //    dynamic_data.methodology_title = label;
            //
            //    html = template(dynamic_data);
            //    self.$output.html(html);
            //
            //});

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
