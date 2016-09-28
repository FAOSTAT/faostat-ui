/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'require',
    'views/base/view',
    'config/Analytics',
    'config/Config',
    'config/Routes',
    'config/Events',
    'config/browse_rankings/Config',
    'config/browse_rankings/Events',
    'text!templates/browse_rankings/browse_rankings.hbs',
    'text!templates/browse/view.hbs',
    'i18n!nls/browse_rankings',
    'handlebars',
    'globals/Common',
    'FAOSTAT_UI_TREE',
    'lib/dashboard-compose/dashboard-compose',
    'amplify'
], function ($, log, Require, View, A, C, ROUTES, E, CM, EM, template, templateView, i18nLabels, Handlebars, Common, Tree, DashBoardCompose) {

    'use strict';

    var s = {

            TREE: "#fs-browse-rankings-tree",
            SEARCH_TREE: "#fs-browse-rankings-search",

            VIEW_CONTAINER: "#fs-browse-rankings-view-container",
            VIEW_TITLE: "#fs-browse-rankings-view-title",
            VIEW: "#fs-browse-rankings-view",
            VIEW_NOT_AVAILABLE: "#fs-browse-rankings-view-not-available",

            DASHBOARD_COMPOSE: "[data-role='dashboard-compose']"

        },
        defaultOptions = {},

        BrowseRankingsView = View.extend({

            autoRender: true,

            className: 'browse',

            template: template,

            initialize: function (options) {

                log.info("BrowseRankings.initialize; options", options);

                this.o = $.extend(true, {}, defaultOptions, options);

                this.o.lang = Common.getLocale();

                // setting the defualt code if missing
                if (this.o.code === null || this.o.code === undefined) {
                    this.o.code = CM.defaultCode;
                }

            },

            getTemplateData: function () {
                return i18nLabels;
            },

            attach: function () {

                View.prototype.attach.call(this, arguments);

                //update State. needed?
                amplify.publish(E.STATE_CHANGE, {browse_rankings: 'browse_rankings'});

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
                this.$DASHBOARD_COMPOSE= this.$el.find(s.DASHBOARD_COMPOSE);

            },

            initComponents: function () {

                var self = this;

                this.tree = new Tree();
                this.tree.init({
                    options: CM.tree.options || null,
                    placeholder_id: this.$TREE,
                    placeholder_search: this.$el.find(s.SEARCH_TREE),
                    lang: this.o.lang,
                    code: this.o.code,
                    custom: this.parseTreeDataJsTree(CM.tree.config),
                    callback: {

                        onDomainClick: _.bind(function (callback) {

                            this.o.code = callback.id;
                            this.o.label = callback.label;
                            // change url state
                            this.changeState();

                        }, this),

                        onGroupClick: _.bind(function () {

                            this.$VIEW_CONTAINER.hide();
                            this.$VIEW_NOT_AVAILABLE.show();

                        }, this),

                        onTreeRendered: _.bind(function (callback) {

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
                this.$VIEW_TITLE.html(this.o.label);

                this.createView();

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

            },

            unbindEventListeners: function () {

            },

            changeState: function() {

                Common.changeURL(ROUTES.BROWSE_RANKINGS_CODE, [this.o.code]);

            },

            createView: function() {

                var basePath = CM.viewsBasePath,
                    code = this.o.code;

                if (this.dashboardCompose !== undefined) {
                    this.dashboardCompose.destroy();
                }

                // get and render the right view
                Require([basePath + code], _.bind(function (view) {

                        this.dashboardCompose = new DashBoardCompose();
                        this.dashboardCompose.render($.extend(true, {}, view, {
                            container: this.$DASHBOARD_COMPOSE,
                            customDashBoardConfiguration: $.extend(true, {}, CM.view)
                        }));

                    }, this),

                    // Catch missing views
                    function (e) {
                        //display error to user
                        log.error("BrowseByDomainView.createView; empty view", e);
                        self.$VIEW.html("<h4 style='padding-top:35px;' class='text-center'>" + i18nLabels.missing_view + "</h4>");
                    });

            },

            dispose: function () {

                this.unbindEventListeners();

                if ( this.dashboardCompose && _.isFunction(this.dashboardCompose.destroy)) {
                    this.dashboardCompose.destroy();
                }

                this.$el.empty();

                View.prototype.dispose.call(this, arguments);

            }

        });

    return BrowseRankingsView;
});
