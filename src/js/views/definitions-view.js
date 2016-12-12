/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'config/Config',
    'config/Events',
    'config/Analytics',
    'text!templates/definitions/definitions.hbs',
    'text!templates/definitions/definitions-output.hbs',
    'i18n!nls/definitions',
    'globals/Common',
    'faostatapiclient',
    'lib/definition/definition',
    'handlebars',
    'underscore',
    'amplify'
], function ($,
             log,
             View,
             C,
             E,
             A,
             template,
             templateOutput,
             i18nLabels,
             Common,
             API,
             Definition,
             Handlebars,
             _
             ) {

    'use strict';

    var s,
        DefinitionsView;

    s = {

        DEFINITIONS: "#fs-definitions-list",
        OUTPUT: "#fs-definitions-output",

        // Definition output template
        DEFINITIONS_LIST: "[data-role='definition']"

    };

    DefinitionsView = View.extend({

        autoRender: true,

        className: 'definitions',

        template: template,

        initialize: function (options) {
            this.o = $.extend(true, {}, options);
            this.o.cache = {};
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            /* Update State. */
            amplify.publish(E.STATE_CHANGE, {definitions: 'definitions'});

            this.initVariables();

            this.initComponents();

            this.configurePage();

            this.bindEventListeners();

        },

        initVariables: function () {

            this.o.lang = Common.getLocale();

            this.$definitions = this.$el.find(s.DEFINITIONS);
            this.$output = this.$el.find(s.OUTPUT);

        },

        initComponents: function () {

            var self = this;

            amplify.publish(E.LOADING_SHOW, {container: this.$definitions});

            API.definitions_types().then(_.bind(self._showDefinitions, this))
              .fail(function(e) {
                amplify.publish(E.LOADING_HIDE, {container: self.$definitions});
                //amplify.publish(E.CONNECTION_PROBLEM, {});
            });

        },

        _showDefinitions: function(d) {

            amplify.publish(E.LOADING_HIDE, {container: this.$definitions});

            var self = this,
                data = d.data,
                html = $(templateOutput).filter('#list').html(),
                t = Handlebars.compile(html);

            this.$definitions.html(t({
                    data: data,
                    title: i18nLabels.list
                })
            );

            this.$definitions.find(s.DEFINITIONS_LIST).off();
            this.$definitions.find(s.DEFINITIONS_LIST).on('click', function(e) {

                e.preventDefault();

                var code = $(this).data('code'),
                    label =  $(this).data('label');

                self.$output.empty();

                self._showOutput(code, label);

            });

        },

        _showOutput: function(code, label) {

            var label = label;

            this._analyticsDefinition(code);

            var definition = new Definition();

            definition.render({
               container: this.$output,
               type: code,
                table: {
                    title: label
                }
            });
        },

        _analyticsDefinition: function(code) {

            amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                $.extend(this, {},
                    A.definitions.selection_types,
                    {label: code})
            );

        },

        configurePage: function () {

        },

        bindEventListeners: function () {

        },

        unbindEventListeners: function () {

        },

        dispose: function () {

            this.unbindEventListeners();

            if (this.$el !== undefined) {
                this.$el.empty();
            }

            View.prototype.dispose.call(this, arguments);

        }
    });

    return DefinitionsView;

});
