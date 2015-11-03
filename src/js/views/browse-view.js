/*global define, _:false, $, console, amplify, FM*/
define([
    'views/base/view',
    'config/FAOSTAT',
    'config/Config',
    'config/Queries',
    'config/Events',
    'text!templates/browse/browse.hbs',
    'i18n!nls/browse',
    'handlebars',
    // TODO the views probably can be loaded at runtime?
    'views/browse-by-domain-view',
    'views/browse-by-country-view',
    'views/browse-rankings-view',
    'amplify'
], function (View, F, C, Q, E, template, i18nLabels, Handlebars, DomainView, CountryView, RankingsView) {

    'use strict';

    var s = {
        DOMAIN: "#browse_by_domain",
        COUNTRY: "#browse_by_country",
        RANKINGS: "#browse_rankings"
    };

    var BrowseView = View.extend({

        autoRender: true,

        className: 'browse',

        template: template,

        // TODO: remove
        events: {
            'click': function(a) {
            }
        },

        initialize: function (options) {
            this.o = $.extend(true, {}, options);
            console.log(this.o);
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            console.log(this);

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {browse: 'browse'});

            this.initVariables();

            this.initComponents();

            this.bindEventListeners();

            this.configurePage();
        },

        initVariables: function () {

            this.$domain = this.$el.find(s.DOMAIN);
            this.$country = this.$el.find(s.COUNTRY);
            this.$rankings = this.$el.find(s.RANKINGS);

        },

        initComponents: function () {

        },

        configurePage: function () {

            // switch to the right navigation tab
            this.$el.find('.nav-tabs [data-section=' + this.o.section + ']').tab('show');

        },

        bindEventListeners: function () {

            var self = this;

            // bind tabs listeners
            this.$el.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

                var section = $(e.target).data("section"); // activated tab

                // switch tab
                self.switchStandardsTab(section);

                //Common.changeURL(section, [], false);

            });

        },

        switchStandardsTab: function(section) {

            if (section == this.$domain.data("section")) {
                this.initBrowseByDomain();
            }

            else if (section == this.$country.data("section")) {
                this.initBrowseByCountry();
            }

            else if (section == this.$rankings.data("section")) {
                this.initBrowseRankings();
            }

        },

        unbindEventListeners: function () {

            // unbind tabs listeners
            this.$el.find('a[data-toggle="tab"]').off('shown.bs.tab');

        },

        initBrowseByDomain: function() {

            if ( this.view_domain === null || this.view_domain === undefined) {

                // init browse by domain
                this.view_domain = new DomainView();
                this.$domain.html(this.view_domain.$el);

            }
            else {
                // TODO: force URL changing of the current view
                this.view_domain.changeState();
            }

        },

        initBrowseByCountry: function() {

            if ( this.view_country === null || this.view_country === undefined) {

                // init browse by domain
                this.view_country= new CountryView();
                this.$country.html(this.view_country.$el);

            }
            else {
                // TODO: force URL changing of the current view
                this.view_country.changeState();
            }

        },

        initBrowseRankings: function() {

            if ( this.view_rankings === null || this.view_rankings === undefined) {

                // init rankings
                this.view_rankings = new RankingsView();
                this.$rankings.html(this.view_rankings.$el);

            }
            else {
                // TODO: force URL changing of the current view
                this.view_rankings.changeState();
            }
        },

        dispose: function () {

            this.unbindEventListeners();

            if ( this.view_domain !== undefined) this.view_domain.dispose();
            if ( this.view_country !== undefined) this.view_country.dispose();
            if ( this.view_rankings !== undefined) this.view_rankings.dispose();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return BrowseView;
});
