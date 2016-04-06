/*global define, _:false, console, amplify, FM, L*/
define([
    'require',
    'jquery',
    'loglevel',
    'views/base/view',
    'config/FAOSTAT',
    'config/Config',
    'config/Routes',
    'config/Events',
    'config/browse_by_country/Config',
    'text!templates/browse_by_country/browse_by_country.hbs',
    'text!templates/browse_by_country/country_list.hbs',
    'i18n!nls/browse_by_country',
    'handlebars',
    'globals/Common',
    'faostatapiclient',
    'list',
    'fx-ds/start',
    'lib/view/view-utils',
    'fenix-ui-map',
    'amplify'
], function (Require, $, log, View, F, C, ROUTE, E, CM, template, templateCountryList, i18nLabels, Handlebars, Common, FAOSTATClientAPI, List, Dashboard, ViewUtils) {

    'use strict';

    var s = {

            COUNTRY_LIST_CONTAINER: "#fs-browse-by-country-list-container",
            //COUNTRY_LIST: "#fs-browse-by-country-list",
            COUNTRY_PROFILE: "#fs-browse-by-country-profile",
            COUNTRY_PROFILE_TITLE: "#fs-browse-by-country-profile-title",
            COUNTRY_PROFILE_DASHBOARD: "#fs-browse-by-country-profile-dashboard",
            COUNTRY_PROFILE_BACK: "#fs-browse-by-country-profile-back",
            COUNTRY_PROFILE_MAP: "#fs-browse-by-country-profile-map"

        },

        o = {

            countrySearchFilters: 'fs-browse-by-country-search'

        },

        BrowseByCountryView = View.extend({

            autoRender: true,

            className: 'browse',

            template: template,

            initialize: function (options) {

                this.o = $.extend(true, {}, o, options);
                this.cache = {};

                this.o.lang = Common.getLocale();

                this.api = new FAOSTATClientAPI();

                this.changeState(ROUTE.BROWSE_BY_COUNTRY);

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

                this.$COUNTRY_LIST_CONTAINER = this.$el.find(s.COUNTRY_LIST_CONTAINER);
                //this.$COUNTRY_LIST = this.$el.find(s.COUNTRY_LIST);
                this.$COUNTRY_PROFILE = this.$el.find(s.COUNTRY_PROFILE);
                this.$COUNTRY_PROFILE_TITLE = this.$el.find(s.COUNTRY_PROFILE_TITLE);
                this.$COUNTRY_PROFILE_DASHBOARD = this.$el.find(s.COUNTRY_PROFILE_DASHBOARD);
                this.$COUNTRY_PROFILE_BACK = this.$el.find(s.COUNTRY_PROFILE_BACK);
                this.$COUNTRY_PROFILE_MAP = this.$el.find(s.COUNTRY_PROFILE_MAP);

            },

            initComponents: function () {

            },

            configurePage: function () {

                amplify.publish(E.LOADING_SHOW, {container: this.$el});

                this.api.codes({
                    lang: Common.getLocale(),
                    datasource: C.DATASOURCE,
                    domain_code: CM.countriesDomainCode,
                    id: CM.countriesDimensionID,

                    // TODO: Add default on CLIENT API!
                    subcodelists: null,
                    ord: null

                }).then(_.bind(function (result) {

                    amplify.publish(E.LOADING_HIDE, {container: this.$el});

                    this.cache.countries = result;

                    // render country list or directly country page
                    if (this.o.code === null || this.o.code === undefined) {
                        this.renderCountryList();
                    }
                    else {
                        this.renderCountryProfile();
                    }

                }, this));

            },

            renderCountryList: function () {

                this.$COUNTRY_PROFILE.hide();
                this.$COUNTRY_LIST_CONTAINER.show();

                if (this.$COUNTRY_LIST_CONTAINER.find('.' + this.o.countrySearchFilters).length <= 0) {

                    var countries = this.cache.countries.data,
                        t = Handlebars.compile(templateCountryList),
                        d = {};
                    //d = $.extend(true, {}, i18nLabels, {data: countries});

                    // format data
                    _.each(countries, function(c) {
                        var letter = c.label[0];
                        d[letter] = d[letter] || { data: []};
                        d[letter].data.push(c);
                    });

                    var v = [];
                    var maxSize = (countries.length / 4) + 5;
                    var col = {
                        letter: []
                    };
                    var size = 0;
                    _.each(d, function(c, key) {
                        if ( size + c.data.length > maxSize) {
                            v.push(col);

                            col = {
                                letter: []
                            };
                            size = 0;
                        }
                        var e= {};
                        e[key] = c;

                        col.letter.push(e);
                        size += c.data.length;
                    });
                    v.push(col);

                    d = $.extend(true, {}, i18nLabels, {list: v});

                    //d = $.extend(true, {}, i18nLabels, {data: countries});

                    var html = t(d);

                    this.$COUNTRY_LIST_CONTAINER.append(html);

                    // add list.js
                    var options = {
                        valueNames: [this.o.countrySearchFilters],
                        page: 200000
                    };

                    new List(this.$COUNTRY_LIST_CONTAINER.selector.replace('#', ''), options);

                    this.$COUNTRY_LIST_CONTAINER.find('.' + this.o.countrySearchFilters).on('click', _.bind(function (e) {

                        e.preventDefault();

                        this.o.code = $(e.target).data("id");
                        this.o.section = ROUTE.BROWSE_BY_COUNTRY_CODE;

                        this.renderCountryProfile();

                        // routing
                        this.changeState();

                    }, this));

                }
            },

            renderCountryProfile: function () {

                this.$COUNTRY_LIST_CONTAINER.hide();
                this.$COUNTRY_PROFILE.show();
                this.$COUNTRY_PROFILE_DASHBOARD.empty();

                var countryName = this.getCountryName(),
                    lang = this.o.lang,
                    basePath = CM.viewsBasePath,
                    code = this.o.code;

                //this.$COUNTRY_PROFILE_BACK.focus();
                this.$COUNTRY_PROFILE_TITLE.html(countryName);

                // initialize map
                this.initializeMap(this.o.code);

                // get and render the right view
                Require([basePath + "country_profile"], _.bind(function(view) {

                    // quick fix for view that should be splitted by topic
                    view = view.population;

                    var dashboard = view.dashboard || null;

                    // adding default country
                    dashboard.defaultFilter = $.extend(true, {}, dashboard.defaultFilter, { List1Codes: [code]});

                    // render structure (structure i.e. change view on click selection)

                    // render dashboard
                    if (dashboard !== null) {

                        this.renderDashboard($.extend(true, {}, view.dashboard, {
                            container: this.$COUNTRY_PROFILE_DASHBOARD,
                            layout: 'fluid',
                            lang: lang}));

                    }else{
                        log.error("View is not defined, handle exception");
                    }


                }, this));

            },

            initializeMap: function(code) {

                this.$COUNTRY_PROFILE_MAP.empty();

                //if ( this.fenixMap === undefined) {
                this.m = new FM.Map(this.$COUNTRY_PROFILE_MAP, CM.map.fenix_ui_map, CM.map.leaflet);
                this.m.createMap();
                //}

                var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                    subdomains: 'abcd',
                    maxZoom: 19,
                    zIndex: 0
                });

                var Esri_WorldPhysical = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
                    maxZoom: 19,
                    zIndex: 0
                    //opacity: 0.4
                });


                // added dirty baselyaer
                this.m.map.addLayer(Esri_WorldPhysical);

                var boundary = {
                    layers: 'fenix:gaul0_line_3857',
                    layertitle: 'Country Boundaries',
                    urlWMS: 'http://fenix.fao.org/geoserver',
                    opacity: '0.2'
                };

                this.m.addLayer(new FM.layer(boundary));

                var highlight = new FM.layer({
                    layers: 'gaul0_faostat_3857',
                    layertitle: '',
                    urlWMS: 'http://fenix.fao.org/geoserver',
                    style: 'highlight_polygon',
                    cql_filter: "faost_code IN ('" + code +"')",
                    hideLayerInControllerList: true,
                    lang: 'en'
                });
                this.m.addLayer(highlight);

                var CartoDB_PositronOnlyLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                    subdomains: 'abcd',
                    maxZoom: 19,
                    zIndex: 100000,
                    opacity: 0.9
                });

                this.m.map.addLayer(CartoDB_PositronOnlyLabels);

                // highlight country
                // TODO: how to check for old countries (i.e. USSR) or new (i.e. south sudan)?
                this.m.zoomTo('gaul0_faostat_3857', "faost_code", [code]);


            },

            getCountryName: function () {

                var code = this.o.code.toString(),
                    codes = this.cache.countries.data,
                    c = _.where(codes, {code: code});

                return (c.length > 0) ? c[0].label : "";

            },

            renderDashboard: function(config) {

                if (this.dashboard && this.dashboard.destroy) {
                    this.dashboard.destroy();
                }

                this.dashboard = new Dashboard();

                // setting default filter options (i.e. language and datasouce)
                config.defaultFilter = ViewUtils.defaultFilterOptions(config.defaultFilter);
                _.each(config.items, _.bind(function(item) {
                    item.config = ViewUtils.defaultItemOptions(item, CM.view);
                }, this));

                config.render =  true;

                config._name = 'by_country';
                this.dashboard.render(config);

            },


            bindEventListeners: function () {

                this.$COUNTRY_PROFILE_BACK.on('click', _.bind(function () {

                    this.o.code = null;
                    this.o.section = ROUTE.BROWSE_BY_COUNTRY;

                    this.renderCountryList();

                    // routing
                    this.changeState();

                }, this));

            },

            unbindEventListeners: function () {

                this.$COUNTRY_PROFILE_BACK.off('click');

            },

            // TODO: pass the right section instead of being implicit?
            changeState: function () {

                // dirty fix or should be like that?
                Common.changeURL((this.o.code)? ROUTE.BROWSE_BY_COUNTRY_CODE: ROUTE.BROWSE_BY_COUNTRY, (this.o.code) ? [this.o.code] : [], false);

                // dirty fix for invalidate size. TODO: remove it from here
                if (this.m) {
                    this.m.map.invalidateSize();
                }
            },

            dispose: function () {

                this.unbindEventListeners();

                View.prototype.dispose.call(this, arguments);
            }
        });

    return BrowseByCountryView;
});
