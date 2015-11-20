/*global define, _:false, console, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'config/FAOSTAT',
    'config/Config',
    'config/Queries',
    'config/Events',
    'config/browse_by_country/Config',
    'text!templates/browse_by_country/browse_by_country.hbs',
    'text!templates/browse_by_country/country_list.hbs',
    'i18n!nls/browse_by_country',
    'handlebars',
    'globals/Common',
    'faostatapiclient',
    'list',
    'amplify'
], function ($, log, View, F, C, Q, E, CM, template, templateCountryList,  i18nLabels, Handlebars, Common, FAOSTATClientAPI, List) {

    'use strict';

    var s = {

            COUNTRY_LIST: "#fs-browse-by-country-list",
            COUNTRY_PROFILE: "#fs-browse-by-country-profile",
            COUNTRY_PROFILE_TITLE: "#fs-browse-by-country-profile-title",
            COUNTRY_PROFILE_DASHBOARD: "#fs-browse-by-country-profile-dashboard",
            COUNTRY_PROFILE_BACK: "#fs-browse-by-country-profile-back"

        },

        o = {

            countrySearchFilters: 'fs-browse-by-country-search'

        },

        // GET dinamically from the route or congifiguration file
        ROUTE = {
            BROWSE_BY_COUNTRY: "browse_by_country",
            BROWSE_BY_COUNTRY_CODE: "browse_by_country_code"
        };

    var BrowseByCountryView = View.extend({

        autoRender: true,

        className: 'browse',

        template: template,

        initialize: function (options) {


            this.o = $.extend(true, {}, o, options);
            this.cache = {};

            this.o.lang = Common.getLocale();

            this.api = new FAOSTATClientAPI();

        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State. needed?
            amplify.publish(E.STATE_CHANGE, {browse: 'browse'});

            this.initVariables();

            this.initComponents();

            this.bindEventListeners();

            this.configurePage();
        },

        initVariables: function () {

            this.$COUNTRY_LIST = this.$el.find(s.COUNTRY_LIST);
            this.$COUNTRY_PROFILE = this.$el.find(s.COUNTRY_PROFILE);
            this.$COUNTRY_PROFILE_TITLE = this.$el.find(s.COUNTRY_PROFILE_TITLE);
            this.$COUNTRY_PROFILE_DASHBOARD = this.$el.find(s.COUNTRY_PROFILE_DASHBOARD);
            this.$COUNTRY_PROFILE_BACK = this.$el.find(s.COUNTRY_PROFILE_BACK);

        },

        initComponents: function () {

        },

        configurePage: function () {

            this.api.codes({
                lang: Common.getLocale(),
                datasource: C.DATASOURCE,
                domain_code: CM.countriesDomainCode,
                id: CM.countriesDimensionID,

                // TODO: Add default on CLIENT API!
                subcodelists: null,
                ord: null

            }).then(_.bind(function(result){

                this.cache.countries = result;

                // render country list or directly country page
                if ( this.o.code === null || this.o.code === undefined) {
                    this.renderCountryList();
                }
                else {
                    this.renderCountryProfile();
                }

            }, this));

        },

        renderCountryList: function() {

            this.$COUNTRY_PROFILE.hide();
            this.$COUNTRY_LIST.show();

            if ( this.$COUNTRY_LIST.find('.' + this.o.countrySearchFilters).length <= 0) {

                var countries = this.cache.countries.data,
                    t = Handlebars.compile(templateCountryList),
                    d = $.extend(true, {}, i18nLabels, {data: countries});

                this.$COUNTRY_LIST.append(t(d));

                // add list.js
                var options = {
                    valueNames: [this.o.countrySearchFilters]
                };

                new List(this.$COUNTRY_LIST.selector.replace('#', ''), options);


                this.$COUNTRY_LIST.find('.' + this.o.countrySearchFilters).on('click', _.bind(function (e) {

                    this.o.code = $(e.target).data("id");
                    this.o.section = ROUTE.BROWSE_BY_COUNTRY_CODE;

                    this.renderCountryProfile();

                    // routing
                    this.changeState();

                }, this));
            }
        },

        renderCountryProfile: function() {

            this.$COUNTRY_LIST.hide();
            this.$COUNTRY_PROFILE.show();

            var countryName = this.getCountryName();

            this.$COUNTRY_PROFILE_TITLE.html(countryName);

        },

        getCountryName: function() {

            var code = this.o.code.toString(),
                codes = this.cache.countries.data;

            var c = _.where(codes, {code: code});

            return (c.length > 0)? c[0].label: "";
        },

        bindEventListeners: function () {

            this.$COUNTRY_PROFILE_BACK.on('click', _.bind(function(){

                console.log("here");

                this.o.code = null;
                this.o.section = ROUTE.BROWSE_BY_COUNTRY;

                this.renderCountryList();

                // routing
                this.changeState();

            }, this));

        },

        unbindEventListeners: function () {

        },

        changeState: function() {
            console.warn("TODO: read internal state anche change URL state");
            // TODO: handle the country selection
            Common.changeURL(this.o.section, (this.o.code)? [this.o.code]: [], false);
        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return BrowseByCountryView;
});
