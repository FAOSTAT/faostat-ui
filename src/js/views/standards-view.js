/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
define([
    'views/base/view',
    'config/Config',
    'config/Events',
    'text!templates/standards/standards.hbs',
    'i18n!nls/standards',
    'underscore',
    'views/standards-units-view',
    'views/standards-abbreviations-view',
    'amplify'
], function (View,
             C,
             E,
             template,
             i18nLabels,
             _,
             UnitsView,
             AbbreviationsView
             ) {

    'use strict';

    var s,
        StandardsView;

    s = {

        UNITS: "#fs-units",
        ABBREVIATIONS: "#fs-abbreviations"

    };

    StandardsView = View.extend({

        autoRender: true,

        className: 'standards',

        template: template,

        initialize: function (options) {
            this.options = options;
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            console.log("standards");

            View.prototype.attach.call(this, arguments);

            /* Update State. */
            amplify.publish(E.STATE_CHANGE, {standards: 'standards'});

            this.initVariables();

            this.initComponents();

            this.bindEventListeners();

            this.configurePage();
        },

        initVariables: function () {

            this.$units = this.$el.find(s.UNITS);
            this.$abbreviations = this.$el.find(s.ABBREVIATIONS);

        },

        initComponents: function () {

            // TODO: switch
            this.initUnits();
            //this.initAbbreviations();


        },

        configurePage: function () {

        },

        bindEventListeners: function () {

            var self = this;

            // bind tabs listeners
            this.$el.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

                var tab = $(e.target).attr("href") // activated tab

                if (tab == self.$units.selector) {
                    self.initUnits();
                }

                if (tab == self.$abbreviations.selector) {
                    self.initAbbreviations();
                }

            });

        },

        initUnits: function() {

            console.log("initUnits");

            if ( this.view_units === null || this.view_units === undefined) {

                // init browse by domain
                this.view_units = new UnitsView();
                this.$units.html(this.view_units.$el);
                //this.view_units.render();
            }

        },

        initAbbreviations: function() {

            console.log("initAbbreviations");

            if ( this.view_abbreviations === null || this.view_abbreviations === undefined) {

                // init browse by domain
                this.view_abbreviations = new AbbreviationsView();
                this.$abbreviations.html(this.view_abbreviations.$el);
                //this.view_abbreviations.render();

            }
        },


        unbindEventListeners: function () {

            // unbind tabs listeners
            this.$el.find('a[data-toggle="tab"]').off('shown.bs.tab');

        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return StandardsView;

});
