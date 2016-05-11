/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'config/Config',
    'config/Events',
    'text!templates/standards/standards.hbs',
    'i18n!nls/standards',
    'views/standards-units-view',
    'views/standards-abbreviations-view',
    'views/standards-methodology-view',
    'views/standards-classifications-view',
    'views/standards-glossary-view',
    'globals/Common',
    'amplify'
], function ($,
             log,
             View,
             C,
             E,
             template,
             i18nLabels,
             UnitsView,
             AbbreviationsView,
             MethodologyView,
             ClassificationsView,
             GlossaryView,
             Common
             ) {

    'use strict';

    var s,
        StandardsView;

    s = {

        UNITS: "#units",
        ABBREVIATIONS: "#abbreviations",
        METHODOLOGY: "#methodologies",
        CLASSIFICATIONS: "#classifications",
        GLOSSARY: "#glossary"

    };

    // TODO: fix routing
    
    StandardsView = View.extend({

        autoRender: true,

        className: 'standards',

        template: template,

        initialize: function (options) {
            this.o = $.extend(true, {}, options);
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

            this.configurePage();

            this.bindEventListeners();

        },

        initVariables: function () {

            this.$units = this.$el.find(s.UNITS);
            this.$abbreviations = this.$el.find(s.ABBREVIATIONS);
            this.$methodology = this.$el.find(s.METHODOLOGY);
            this.$classifications = this.$el.find(s.CLASSIFICATIONS);
            this.$glossary = this.$el.find(s.GLOSSARY);

        },

        initComponents: function () {

        },

        configurePage: function () {

            // switch to the right navigation tab
            this.$el.find('.nav-tabs [data-section=' + this.o.section + ']').tab('show');

            this.switchStandardsTab(this.o.section);

        },

        bindEventListeners: function () {

            var self = this;

            // bind tabs listeners
            this.$el.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

                var section = $(e.target).data("section"); // activated tab

                // switch tab
                //self.switchStandardsTab(section);

                // TODO: check why if was at "true"
                Common.changeURL(section, [], false);

            });

        },

        switchStandardsTab: function(section) {

            log.info("StandardsView.switchStandardsTab; section", section);

            if (section === this.$units.data("section")) {
                this.initUnits();
            }

            else if (section === this.$abbreviations.data("section")) {
                this.initAbbreviations();
            }

            else if (section === this.$methodology.data("section")) {
                this.initMethodology();
            }

            else if (section === this.$classifications.data("section")) {
                this.initClassifications();
            }

            else if (section === this.$glossary.data("section")) {
                this.initGlossary();
            }

        },

        initUnits: function() {

            if ( this.view_units === null || this.view_units === undefined) {

                // init units section
                this.view_units = new UnitsView();
                this.$units.html(this.view_units.$el);

            }

        },

        initAbbreviations: function() {

            if ( this.view_abbreviations === null || this.view_abbreviations === undefined) {

                // init abbreviations section
                this.view_abbreviations = new AbbreviationsView();
                this.$abbreviations.html(this.view_abbreviations.$el);

            }

        },

        initMethodology: function() {

            if ( this.view_methodology === null || this.view_methodology === undefined) {

                // init methodology section
                this.view_methodology = new MethodologyView();
                this.$methodology.html(this.view_methodology.$el);

            }

        },

        initClassifications: function() {

            if ( this.view_classifications === null || this.view_classifications === undefined) {

                // init classifications section
                this.view_classifications = new ClassificationsView();
                this.$classifications.html(this.view_classifications.$el);

            }

        },

        initGlossary: function() {

            if ( this.view_glossary === null || this.view_glossary === undefined) {

                // init classifications section
                this.view_glossary = new GlossaryView();
                this.$glossary.html(this.view_glossary.$el);

            }

        },

        unbindEventListeners: function () {

            // unbind tabs listeners
            this.$el.find('a[data-toggle="tab"]').off('shown.bs.tab');

        },

        dispose: function () {

            this.unbindEventListeners();

            log.info(this)

            // TODO: all the dispose
            if ( this.view_units !== undefined) {
                this.view_units.dispose();
            }
            if ( this.view_abbreviations !== undefined) {
                this.view_abbreviations.dispose();
            }
            if ( this.view_glossary !== undefined) {
                this.view_glossary.dispose();
            }
            if ( this.view_classifications !== undefined) {
                this.view_classifications.dispose();
            }
            if ( this.view_methodology !== undefined) {
                this.view_methodology.dispose();
            }

            this.$el.empty();

            View.prototype.dispose.call(this, arguments);

        }
    });

    return StandardsView;

});
