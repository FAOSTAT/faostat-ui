/*global define, _:false, console, amplify, FM, L, FMCONFIG*/
define([
    'require',
    'jquery',
    'loglevel',
    'views/base/view',
    'config/Analytics',
    'config/Config',
    'config/Routes',
    'config/Events',
    'config/browse_by_country/Config',
    'text!templates/browse_by_country/browse_by_country.hbs',
    'text!templates/browse_by_country/country_list.hbs',
    'text!templates/browse_by_country/country_profile.hbs',
    'i18n!nls/browse_by_country',
    'handlebars',
    'globals/Common',
    'faostatapiclient',
    //'list',
    'fx-ds/start',
    'lib/view/view-utils',
    'lib/filters/filter-box',
    //'aos',
    //'holmes',
    //'microlight',
    'fenix-ui-map',
    'amplify',
    'instafilta',
    // TODO: this should be removed and loaded by default on the map
    // workaround for urlWMS in the layer definition
    'fenix-ui-map-config'
], function (Require, $, log, View, A, C, ROUTE, E, CM,
             template,
             templateCountryList,
             templateCountryProfile,
             i18nLabels, Handlebars, Common, API,
             // List,
             Dashboard, ViewUtils,
             FilterBox
            // ,AOS
             //,holmes
            // ,microlight
) {

    'use strict';

    var s = {

            COUNTRY_LIST_CONTAINER: "#fs-browse-by-country-list-container",
            //COUNTRY_LIST: "#fs-browse-by-country-list",
            COUNTRY_PROFILE: "#fs-browse-by-country-profile",

            SEARCH: "[data-role='search']",

            // country profile
            COUNTRY_PROFILE_SECTIONS: '[data-role="sections"]',
            COUNTRY_PROFILE_DASHBOARDS: "#fs-browse-by-country-profile-dashboards",
            COUNTRY_PROFILE_BACK: "#fs-browse-by-country-profile-back",
            COUNTRY_PROFILE_MAP: "#fs-browse-by-country-profile-map",

            // MODAL
            COUNTRY_LIST_MODAL_BUTTON: '[data-role="select-country"]',
            COUNTRY_LIST_MODAL: '#fs-country-indicators-list-modal',
            COUNTRY_LIST_MODAL_CONTENT: '[data-role="country-list"]',
            APPLY_CHANGES_MODAL: '[data-role="country-list-apply-changes"]'

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

                if( this.o.code !== undefined && this.o.code !== null){
                    this.o.code = this.o.code.split(",");
                }

            },

            getTemplateData: function () {
                return {};
            },

            attach: function () {

                View.prototype.attach.call(this, arguments);

                //update State. needed?
                amplify.publish(E.STATE_CHANGE, {browse_by_country: 'browse_by_country'});

                this.initVariables();

                this.initComponents();

                this.bindEventListeners();

                this.configurePage();

            },

            initVariables: function () {

                this.$COUNTRY_LIST_CONTAINER = this.$el.find(s.COUNTRY_LIST_CONTAINER);
                this.$COUNTRY_PROFILE = this.$el.find(s.COUNTRY_PROFILE);

            },

            initComponents: function () {

            },

            configurePage: function () {

                var self = this;

                amplify.publish(E.LOADING_SHOW, {container: this.$el});

                API.codes({
                    domain_code: CM.countriesDomainCode,
                    blacklist: CM.countriesBlacklist,
                    id: CM.countriesDimensionID
                }).then(function (result) {

                    amplify.publish(E.LOADING_HIDE, {container: self.$el});

                    self.cache.countries = result;

                    // render country list or directly country page
                    if (self.o.code === null || self.o.code === undefined) {
                        self.renderCountryList();
                    }
                    else {
                        self.renderCountryProfile();
                    }

                    })
                .fail(function(e) {
                    log.error("BrowseByCountryView.configurePage", e);
                    amplify.publish(E.LOADING_HIDE, {container: self.$el});
                    amplify.publish(E.CONNECTION_PROBLEM);
                });

            },

            renderCountryList: function () {

                var templateFilter = (this.o.lang === 'en' || this.o.lang === 'es' || this.o.lang === 'fr' || this.o.lang === 'ru')? '#country_list_latin': '#country_list_other';

                this.$COUNTRY_PROFILE.hide();
                this.$COUNTRY_LIST_CONTAINER.show();

                //if (this.$COUNTRY_LIST_CONTAINER.find('.' + this.o.countrySearchFilters).length <= 0) {

                var countries = this.cache.countries.data,
                    html = $(templateCountryList).filter(templateFilter).html(),
                    t = Handlebars.compile(html),
                    d = {};

                // format data
                _.each(countries, function(c) {
                    var letter = c.label[0];
                    d[letter] = d[letter] || { data: []};
                    c.link = '#' + Common.getURI(ROUTE.BROWSE_BY_COUNTRY_CODE, [c.code]);
                    d[letter].data.push(c);
                });

                // labels
                this.$COUNTRY_LIST_CONTAINER.append(t({
                        // labels
                        country_indicators: i18nLabels.country_indicators,
                        country_list: i18nLabels.country_list,
                        data: d
                    }));


                /* Search **/
                /*this.$SEARCH = this.$COUNTRY_LIST_CONTAINER.find(s.SEARCH);

                 // focus on search
                 this.$SEARCH.focus();

                 this.$SEARCH.instaFilta({
                 //markMatches: true,
                 //scope: '.country-list-container',
                 beginsWith: true,
                 typeDelay: 200,
                 onFilterComplete: function(matchedItems) {

                 log.info(matchedItems)

                 // show/hide no data div
                 //if (matchedItems) {
                 // matchedItems.length > 0 ? self.$NO_DATA.hide() : self.$NO_DATA.show();
                 //}
                 }
                 });*/

                //}
                

            },


            renderCountryProfile: function() {

                var html = $(templateCountryProfile).filter('#country_profile').html(),
                    t = Handlebars.compile(html),
                    basePath = CM.viewsBasePath,
                    countryName = this.getCountryName(),
                    code = this.o.code;

                this.$COUNTRY_PROFILE.empty();
                this.$COUNTRY_LIST_CONTAINER.hide();
                this.$COUNTRY_PROFILE.show();

                this.$COUNTRY_PROFILE.html(t({
                    // labels
                    country_name: countryName,
                    sections: i18nLabels.sections || "Sections",
                    back_to_country_list: i18nLabels.back_to_country_list,
                    topics: i18nLabels.topics,
                    //country_indicators: i18nLabels.country_indicators,
                    map_disclaimer: i18nLabels.map_disclaimer,
                    url_back_country_list: Common.getURI(ROUTE.BROWSE_BY_COUNTRY)
                }));

                this.$COUNTRY_PROFILE_DASHBOARDS = this.$COUNTRY_PROFILE.find(s.COUNTRY_PROFILE_DASHBOARDS);
                this.$COUNTRY_PROFILE_MAP = this.$COUNTRY_PROFILE.find(s.COUNTRY_PROFILE_MAP);
                this.$COUNTRY_PROFILE_SECTIONS = this.$COUNTRY_PROFILE.find(s.COUNTRY_PROFILE_SECTIONS);

                // initialize map
                this.initializeMap(code);

                log.info("------------", code);

                // get and render the right view
                Require([basePath + "country_profile"], _.bind(function(views) {

                    this.renderCountryProfileSections(views);

                    // workaround to load the views
                    var index=0;
                    _.each(views, _.bind(function(view, key) {

                        setTimeout(_.bind(function () {
                            this.renderCountryProfileDashboard(view, key);
                            //AOS.init();
                        },this), 1000 + (index++ * 300));

                    }, this));

                }, this));


                // modal
                this.bindModal();

            },

            bindModal: function() {

                // modal
                var self = this;
                this.$COUNTRY_LIST_MODAL_BUTTON = this.$COUNTRY_PROFILE.find(s.COUNTRY_LIST_MODAL_BUTTON);

                this.$COUNTRY_LIST_MODAL_BUTTON.off();
                this.$COUNTRY_LIST_MODAL_BUTTON.on('click', function(e) {

                    e.preventDefault();

                    var defaultCodes = self.o.code;

                    if (self.$COUNTRY_LIST_MODAL === undefined) {

                        var html = $(templateCountryProfile).filter('#country-list-modal').html(),
                            t = Handlebars.compile(html);

                        self.$COUNTRY_PROFILE.append(t({}));

                    }

                    self.$COUNTRY_LIST_MODAL = self.$COUNTRY_PROFILE.find(s.COUNTRY_LIST_MODAL);

                    self.$COUNTRY_LIST_MODAL.show();


                    self.$COUNTRY_LIST_MODAL_CONTENT = self.$COUNTRY_LIST_MODAL.find(s.COUNTRY_LIST_MODAL_CONTENT);

                    if ( self.countryListFilter !== undefined) {
                        self.countryListFilter.destroy();
                    }

                    self.countryListFilter = new FilterBox(),
                        config = {
                            container: self.$COUNTRY_LIST_MODAL_CONTENT,
                            filter: {
                                items: [
                                    {
                                        "id": "countries",
                                        "type": "codelist",
                                        "title": "",
                                        "componentType": {
                                            "class": "col-m2-12",
                                            "type": "dropDownList",
                                            "multiple": true
                                        },
                                        "config": {
                                            "dimension_id": "countries",
                                            "defaultCodes": defaultCodes,
                                            "filter": {
                                                "domain_code": ["QC"],
                                                "show_lists": false,
                                                blacklist: CM.countriesBlacklist
                                            }
                                        }
                                    }
                                ]
                            }
                        };

                    self.countryListFilter.render(config, false);


                    self.$APPLY_CHANGES_MODAL = self.$COUNTRY_LIST_MODAL.find(s.APPLY_CHANGES_MODAL);

                    self.$APPLY_CHANGES_MODAL.off();
                    self.$APPLY_CHANGES_MODAL.on('click', function() {

                        // waits the modal to hide
                        self.$COUNTRY_LIST_MODAL.on('hidden.bs.modal', function(){
                            self.o.code = self.countryListFilter.getFilters()[0].codes;
                            self.changeState();
                        });
                        self.$COUNTRY_LIST_MODAL.modal('hide');

                    });

                });

            },

            renderCountryProfileSections: function(views) {

                var html = $(templateCountryProfile).filter('#sections').html(),
                    t = Handlebars.compile(html),
                    sections = [],
                    self = this;

                _.each(views, _.bind(function(view, key) {

                    sections.push({
                        title: view.title,
                        index: key
                    });

                }, this));


                this.$COUNTRY_PROFILE_SECTIONS.html(t({
                    sections: sections
                }));


                this.$COUNTRY_PROFILE_SECTIONS.find('a').on('click', function(e) {

                    e.preventDefault();

                    var index = $(this).data('dashboard-index');

                    amplify.publish(E.SCROLL_TO_SELECTOR,
                        {
                            container: self.$COUNTRY_PROFILE_DASHBOARDS.find('[data-dashboard-index='+ index +']')
                        });
                });

            },

            renderCountryProfileDashboard: function(view, key) {

                var $container = this._createRandomElement(this.$COUNTRY_PROFILE_DASHBOARDS, false),
                    html = $(templateCountryProfile).filter('#dashboard').html(),
                    t = Handlebars.compile(html),
                    title = view.title || "",
                    dashboard = view.dashboard || null,
                    code = this.o.code,
                    lang = this.o.lang;

                log.info("BrowseByCountryView.renderCountryProfileDashboard;", key, title, dashboard);

                // render dashboard
                if (dashboard !== null) {

                    $container.html(t({
                        title: title,
                        icon: view.icon,
                        description: (view.description)? view.description[Common.getLocale()] || view.description["en"] : null,
                        index: key
                    }));

                    var $dashboard = $container.find('[data-role="dashboard"]');

                    // adding default country
                    dashboard.defaultFilter = $.extend({}, dashboard.defaultFilter, {
                        List1Codes: code}
                        );
                    //dashboard.defaultFilter = $.extend(true, {}, dashboard.defaultFilter, { List1Codes: [code, '3]});


                    this.renderDashboard($.extend({}, dashboard, {
                        container: $dashboard,
                        layout: 'fluid',
                        lang: lang}));

                }else{
                    log.error("View is not defined, handle exception");
                }

            },

            initializeMap: function(code) {

                this.$COUNTRY_PROFILE_MAP.empty();

                //if ( this.fenixMap === undefined) {
                this.m = new FM.Map(this.$COUNTRY_PROFILE_MAP, CM.map.fenix_ui_map, CM.map.leaflet);
                this.m.createMap();

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

                var MapQuestOpen_Aerial = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
                    type: 'sat',
                    ext: 'jpg',
                    attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
                    subdomains: '1234'
                });

                // https: also suppported.
                var Esri_OceanBasemap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
                    maxZoom: 13
                });

                // https: also suppported.
                var Esri_WorldGrayCanvas = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
                    maxZoom: 16
                });


                // added dirty baselayer
                //this.m.map.addLayer(Esri_WorldGrayCanvas);
                this.m.map.addLayer(Esri_WorldPhysical);

                var boundary = {
                    layers: 'fenix:gaul0_line_3857',
                    layertitle: 'Country Boundaries',
                    urlWMS: FMCONFIG.BASEURL_MAPS,
                    opacity: '0.5'
                };

                this.m.addLayer(new FM.layer(boundary));

                var highlight = new FM.layer({
                    layers: 'gaul0_faostat_3857',
                    layertitle: '',
                    urlWMS: FMCONFIG.BASEURL_MAPS,
                    style: 'highlight_polygon',
                    cql_filter: "faost_code IN ('" + code.join("','") +"')",
                    hideLayerInControllerList: true,
                    lang: 'en'
                });
                this.m.addLayer(highlight);

                var CartoDB_PositronOnlyLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                    subdomains: 'abcd',
                    maxZoom: 19,
                    zIndex: 1000,
                    opacity: 0.9
                });

                this.m.map.addLayer(CartoDB_PositronOnlyLabels);

                // highlight country
                // TODO: how to check for old countries (i.e. USSR) or new (i.e. south sudan)?
                this.m.zoomTo('gaul0_faostat_3857', "faost_code", code);

/*
                var wmsLayer = L.tileLayer.wms('http://fenix.fao.org:20900/geoserver/fenix/wms', {
                    layers: 'fenix:gaul0_3857',
                    format: 'application/json;type=utfgrid',
                    style: 'polygon'
                }).addTo(this.m.map);
*/

/*                var utfGrid = new L.UtfGrid('http://{s}.tiles.mapbox.com/v3/milkator.press_freedom/{z}/{x}/{y}.grid.json?callback={cb}', {
                    resolution: 4,
                    maxZoom: 5
                });*/



                /*var teaLayer = L.tileLayer.wms("http://fenix.fao.org:20200/geoserver/wms", {
                    layers: 'earthstat:tea_area_3857',
                    format: 'image/png',
                    transparent: true
                });

                var riceLayer = L.tileLayer.wms("http://fenix.fao.org:20200/geoserver/wms", {
                    layers: 'earthstat:rice_area_3857',
                    format: 'image/png',
                    transparent: true
                });


                this.m.map.addLayer(teaLayer);*/


            },

            getCountryName: function () {

                var code = this.o.code,
                    codes = this.cache.countries.data;

                var r = [];
                _.each(code, function(c) {
                    var v = _.where(codes, {code: c.toString()});
                    if (v.length > 0) {
                        r.push(v[0].label);
                    }
                });

                return r.join(", ");

            },

            renderDashboard: function(config) {

                var dashboard = new Dashboard();
                // setting default filter options (i.e. language and datasouce)
                config.defaultFilter = ViewUtils.defaultFilterOptions(config.defaultFilter);
                _.each(config.items, _.bind(function(item) {
                    item.config = ViewUtils.defaultItemOptions(item, CM.view);
                }, this));

                config.render =  true;

                config._name = 'by_country';
                dashboard.render(config);

                log.info("------------", config)

                // save dashboard for destroy
                if (this.dashboards === undefined) {
                    this.dashboards = [];
                }

                this.dashboards.push(dashboard);

            },

            _createRandomElement: function($CONTAINER, empty) {

                var empty = (empty !== undefined && typeof(empty) === "boolean")? empty : true,
                    id = Math.random().toString().replace(".", "");

                if(empty == true) {
                    $CONTAINER.empty();
                }

                $CONTAINER.append("<div id='"+ id +"'>");

                return $CONTAINER.find('#' + id);

            },

            bindEventListeners: function () {

            },

            unbindEventListeners: function () {

                if (this.$COUNTRY_PROFILE_BACK) {
                    this.$COUNTRY_PROFILE_BACK.off('click');
                }

            },

            // TODO: pass the right section instead of being implicit?
            changeState: function () {

                var code = this.o.code ? this.o.code.join(",") : null;

                // dirty fix or should be like that?
                Common.changeURL((code)? ROUTE.BROWSE_BY_COUNTRY_CODE: ROUTE.BROWSE_BY_COUNTRY, (code) ? [code] : [], false);

                // dirty fix for invalidate size. TODO: remove it from here
                if (this.m) {
                    this.m.map.invalidateSize();
                }
            },

            destroyDashBoards: function () {

                if (this.dashboards !== undefined) {

                    _.each(this.dashboards, function(dashboard) {

                        if ( _.isFunction(dashboard.destroy)) {
                            dashboard.destroy();
                        }
                    });
                }

            },

            dispose: function () {

                this.unbindEventListeners();

                this.destroyDashBoards();

                this.$el.empty();

                View.prototype.dispose.call(this, arguments);
            }
        });

    return BrowseByCountryView;
});
