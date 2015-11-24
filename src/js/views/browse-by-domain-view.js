/*global define, _:false, $, console, amplify, require*/
define([
    'require',
    'jquery',
    'loglevel',
    'views/base/view',
    'config/FAOSTAT',
    'config/Config',
    'config/Queries',
    'config/Events',
    'config/browse_by_domain/Config',
    'config/browse_by_domain/Events',
    'text!templates/browse_by_domain/browse_by_domain.hbs',
    'text!templates/browse/view.hbs',
    'i18n!nls/browse_by_domain',
    'handlebars',
    'globals/Common',
    'FAOSTAT_UI_TREE',
    'lib/filters/filter-box',
    'fx-ds/start',
    'lib/view/view-utils',
    'amplify'
], function (Require, $, log, View, F, C, Q, E, CM, EM, template, templateView, i18nLabels, Handlebars, Common, Tree, FilterBox, Dashboard, ViewUtils) {

    'use strict';

    var s = {

            TREE: "#fs-browse-by-domain-tree",
            VIEW_TITLE: "#fs-browse-by-domain-view-title",
            VIEW: "#fs-browse-by-domain-view",
            RELATED_VIEWS: "#fs-browse-by-domain-view-related-views",

            FILTER_BOX: "[data-role='filter-box']",
            DASHBOARD: "[data-role='dashboard']"

        },

        o = {

        };

    var BrowseByDomainView = View.extend({

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

            //this.$table = this.$el.find(s.TABLE);
            this.$TREE = this.$el.find(s.TREE);
            this.$VIEW_TITLE = this.$el.find(s.VIEW_TITLE);
            this.$VIEW = this.$el.find(s.VIEW);
            this.$RELATED_VIEWS = this.$el.find(s.RELATED_VIEWS);

        },

        initComponents: function () {

            this.tree = new Tree();
            this.tree.init({
                placeholder_id: this.$TREE,
                datasource: C.DATASOURCE,
                lang: this.o.lang,
                code: this.o.code,
                blacklist: CM.blacklist || [],
                callback: {

                    onClick: _.bind(function (callback) {

                        this.o.code = callback.id;
                        this.o.label = callback.label;

                        // update view
                        this.updateView();

                        // change url state
                        this.changeState();

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

        updateView: function() {
            var code = this.o.code,
                title = this.o.label;

            this.$VIEW_TITLE.html(title);
            this.$RELATED_VIEWS.empty();

            var obj = {
                container: this.$VIEW,
                containerRelatedViews: this.$RELATED_VIEWS,
                basePath:CM.viewsBasePath,
                viewID: code
            };

            this.createView(obj);

        },

        configurePage: function () {

        },

        bindEventListeners: function () {

            amplify.subscribe(EM.ON_FILTER_CHANGE, _.bind(this.updateDashboard, this));

        },

        unbindEventListeners: function () {

            amplify.unsubscribe(EM.ON_FILTER_CHANGE, _.bind(this.updateDashboard, this));

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
                        E: {
                            ON_FILTER_CHANGE: EM.ON_FILTER_CHANGE
                        },
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
            log.info(this.filterBox)
            var filters = this.filterBox.getFilters();

            // apply filters to dashboard
            this.dashboard.filter(filters, isOnLoad);

        }

    });

    return BrowseByDomainView;
});
