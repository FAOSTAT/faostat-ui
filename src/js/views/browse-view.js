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
        DOMAIN: "#fs-browse-by-domain",
        COUNTRY: "#fs-browse-by-country",
        RANKINGS: "#fs-browse-rankings"
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

        },

        bindEventListeners: function () {

            var self = this;

            // bind tabs listeners
            this.$el.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

                var tab = $(e.target).attr("href") // activated tab

                if (tab == self.$domain.selector) {
                    self.initBrowseByDomain();
                }

                if (tab == self.$country.selector) {
                    self.initBrowseByCountry();
                }

                if (tab == self.$rankings.selector) {
                    self.initBrowseRankings();
                }
            });

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

                // TODO: check default options to pass to the renderer i.e. 'domain code' if passed

                this.view_domain.render();
            }

        },

        initBrowseByCountry: function() {

            if ( this.view_country === null || this.view_country === undefined) {

                // init browse by domain
                this.view_country= new CountryView();
                this.$country.html(this.view_country.$el);

                // TODO: check default options to pass to the renderer i.e. 'domain code' if passed

                this.view_country.render();
            }

        },

        initBrowseRankings: function() {

            if ( this.view_rankings === null || this.view_rankings === undefined) {

                // init rankings
                this.view_rankings = new RankingsView();
                this.$rankings.html(this.view_rankings.$el);

                // TODO: check default options to pass to the renderer i.e. 'domain code' if passed

                this.view_rankings.render();
            }
        },

        dispose: function () {

            this.unbindEventListeners();

            if ( this.view_domain != undefined) this.view_domain.dispose();
            if ( this.view_country != undefined) this.view_country.dispose();
            if ( this.view_rankings != undefined) this.view_rankings.dispose();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return BrowseView;
});
