/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'require',
    'views/base/view',
    'config/FAOSTAT',
    'config/Config',
    'config/Events',
    'config/browse_rankings/Config',
    'config/browse_rankings/Events',
    'text!templates/browse_rankings/browse_rankings.hbs',
    'text!templates/browse/view.hbs',
    'i18n!nls/browse_rankings',
    'handlebars',
    'globals/Common',
    'FAOSTAT_UI_TREE',
    'lib/filters/filter-box',
    'fx-ds/start',
    'lib/view/view-utils',
    'amplify'
], function ($, log, Require, View, F, C, E, CM, EM, template, templateView, i18nLabels, Handlebars, Common, Tree, FilterBox, Dashboard, ViewUtils) {

    'use strict';

    var s = {

            TREE: "#fs-browse-rankings-tree",

            VIEW_CONTAINER: "#fs-browse-rankings-view-container",
            VIEW_TITLE: "#fs-browse-rankings-view-title",
            VIEW: "#fs-browse-rankings-view",
            VIEW_NOT_AVAILABLE: "#fs-browse-rankings-view-not-available",

            FILTER_BOX: "[data-role='filter-box']",
            DASHBOARD: "[data-role='dashboard']"

        },
        
        o = {

        };

    var BrowseRankingsView = View.extend({

        autoRender: true,

        className: 'browse',

        template: template,

        initialize: function (options) {
            this.o = $.extend(true, {}, o, options);

            this.o.lang = Common.getLocale();

            // setting the defualt code if missing
            if (this.o.code === null || this.o.code === undefined) {
                this.o.code = CM.defaultCode;
            }

            console.log(this.o.section);
            this.changeState();

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

            this.$TREE = this.$el.find(s.TREE);

            this.$VIEW_CONTAINER = this.$el.find(s.VIEW_CONTAINER);
            this.$VIEW_TITLE = this.$el.find(s.VIEW_TITLE);
            this.$VIEW = this.$el.find(s.VIEW);
            this.$VIEW_NOT_AVAILABLE = this.$el.find(s.VIEW_NOT_AVAILABLE);


        },

        initComponents: function () {

            this.tree = new Tree();
            this.tree.init({
                options: CM.tree.options || null,
                placeholder_id: this.$TREE,
                lang: this.o.lang,
                code: this.o.code,
                custom: this.parseTreeDataJsTree(CM.tree.config),
                callback: {

                    onDomainClick: _.bind(function (callback) {

                        this.o.code = callback.id;
                        this.o.label = callback.label;

                        log.info(this.o);

                        // update view
                        this.updateView();

                        // change url state
                        this.changeState();

                    }, this),

                    onGroupClick: _.bind(function (callback) {

                        this.$VIEW_CONTAINER.hide();
                        this.$VIEW_NOT_AVAILABLE.show();

                    }, this),

                    onTreeRendered:  _.bind(function (callback) {

                        this.o.code = callback.id;
                        this.o.label = callback.label;

                        // update view
                        this.updateView();

                    }, this)


                }
            });

        },

        configurePage: function () {

        },

        updateView: function () {

            this.$VIEW_NOT_AVAILABLE.hide();
            this.$VIEW_CONTAINER.show();

            var code = this.o.code,
                label = this.o.label;

            this.$VIEW_TITLE.html(label);

            var obj = {
                container: this.$VIEW,
                basePath:CM.viewsBasePath,
                viewID: code
            };

            this.createView(obj);

        },

        parseTreeData: function(json) {

            var lang = this.o.lang,
                code = this.o.code,
                data = [];

            _.each(json, function(d) {

                var v = {
                    id: d.id,
                    text: d.title[lang.toLowerCase()] || d.title[lang],
                    state: {
                        expanded: true
                    },
                    nodes: []
                };

                _.each(d.views, function(view) {
                    v.nodes.push({
                        id: view.id,
                        text: view.title[lang.toLowerCase()] || d.title[lang],
                        state: {
                            selected: (view.id === code)
                        }
                    });
                });

                data.push(v);

            });

            return data;

        },

        parseTreeDataJsTree: function(json) {

            var lang = this.o.lang,
                data = [];

            _.each(json, function(d) {
                var parentID = d.id;
                data.push({
                    id: parentID,
                    text: d.title[lang.toLowerCase()] || d.title[lang],
                    parent: '#'

                });

                _.each(d.views, function(view) {
                    data.push({
                        id: view.id,
                        text: view.title[lang.toLowerCase()] || d.title[lang],
                        parent: parentID

                    });
                });

            });
            return data;

        },

        bindEventListeners: function () {

            amplify.subscribe(EM.ON_FILTER_CHANGE, this, this.updateDashboard);

        },

        unbindEventListeners: function () {

            amplify.subscribe(EM.ON_FILTER_CHANGE, this.updateDashboard);

        },

        changeState: function() {

            Common.changeURL(this.o.section + '_code', [this.o.code], false);

        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        },

        // TODO: move to a common area for all the modules? (create a submodule?)
        createView: function(c) {

            var lang = this.o.lang,
                basePath = c.basePath || CM.viewsBasePath,
                updatedRelatedViews = (c.updatedRelatedViews !== undefined)? c.updatedRelatedViews: true;

            this.$VIEW.empty();

            // get and render the right view
            Require([basePath + c.viewID], _.bind(function(view) {

                // extending view
                view = $.extend(true, {}, c.config, view);

                // set comments
                ViewUtils.setDashboardComment(view);

                /* Load main structure. */
                var t = Handlebars.compile(templateView);
                this.$VIEW.append(t(view));

                // update related views
                // TODO: review the relatedViews template part
                if ( updatedRelatedViews) {
                    ViewUtils.addRelatedViews(this.$RELATED_VIEWS, view, _.bind(this.createView, this));
                }

                this.$FILTER_BOX = this.$VIEW.find(s.FILTER_BOX);
                this.$DASHBOARD = this.$VIEW.find(s.DASHBOARD);

                var filter = view.filter || null,
                    dashboard = view.dashboard || null;

                // render filters
                if (filter !== null) {
                    this.renderFilter({
                        filter: filter,
                        // override event listener for the filter change (custom for browse by domain)
                        E: $.extend(true, {}, EM),
                        container: this.$FILTER_BOX,
                        lang: lang
                    });
                }

                // render dashboard
                if (dashboard !== null) {
                    this.renderDashboard($.extend(true, {}, view.dashboard, {
                        container: this.$DASHBOARD,
                        layout: 'fluid',
                        //layout: 'injected',
                        lang: lang}));
                }else{
                    log.error("View is not defined, handle exception");
                }

            }, this));

        },

        renderFilter: function(config) {

            // create filters
            if (this.filterBox && this.filterBox.destroy) {
                this.filterBox.destroy();
            }

            this.filterBox = new FilterBox();

            // render filters
            this.filterBox.render(config, false);

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

            this.dashboard.render(config);

        },

        updateDashboard: function(c) {

            var isOnLoad = (c)? c.isOnLoad || false: false;

            // getFilters
            var filters = this.filterBox.getFilters();

            // apply filters to dashboard
            this.dashboard.filter(filters, isOnLoad);

        }

    });

    return BrowseRankingsView;
});
