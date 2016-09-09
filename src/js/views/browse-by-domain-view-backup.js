/*global define, _:false, $, console, amplify, require*/
define([
    'require',
    'jquery',
    'loglevel',
    'views/base/view',
    'config/Analytics',
    'config/Config',
    'config/Routes',
    'config/Events',
    'config/browse_by_domain/Config',
    'config/browse_by_domain/Events',
    'text!templates/browse_by_domain/browse_by_domain.hbs',
    'text!templates/browse/view.hbs',
    'i18n!nls/browse_by_domain',
    'handlebars',
    'globals/Common',
    'lib/filters/filter-box',
    'fx-ds/start',
    'lib/view/view-utils',
    'underscore.string',
    'bootstrap',
    'amplify'
], function (Require, $, log, View, A, C, ROUTE, E, CM, EM, template, templateView, i18nLabels, Handlebars, Common, FilterBox, Dashboard, ViewUtils, _s) {

    'use strict';

    var s = {

            VIEW_TITLE: "#fs-browse-by-domain-view-title",
            VIEW: "#fs-browse-by-domain-view",
            RELATED_VIEWS: "#fs-browse-by-domain-view-related-views",
            DOWNLOAD_INTERACTIVE_LINK: '[data-role="download-interactive-link"]',
            DOWNLOAD_BULK_LINK: '[data-role="download-bulk-link"]',

            FILTER_BOX: "[data-role='filter-box']",
            DASHBOARD: "[data-role='dashboard']"

        },
        defaultOptions = {
            // TODO: replaceit with random div
            requestKey: 0,
            section: ROUTE.BROWSE_BY_DOMAIN_CODE
        },

        BrowseByDomainView = View.extend({

            autoRender: true,

            className: 'browse',

            template: template,

            initialize: function (options) {

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

                this.initVariables();

                this.initComponents();

                this.bindEventListeners();

                this.configurePage();
            },

            initVariables: function () {

                this.$VIEW_TITLE = this.$el.find(s.VIEW_TITLE);
                this.$VIEW = this.$el.find(s.VIEW);
                this.$RELATED_VIEWS = this.$el.find(s.RELATED_VIEWS);

            },

            initComponents: function () {

                this.updateView();

            },

            updateView: function() {

                var code = this.o.code,
                    title = this.o.label;

                this.$DOWNLOAD_INTERACTIVE_LINK = this.$el.find(s.DOWNLOAD_INTERACTIVE_LINK);
                this.$DOWNLOAD_INTERACTIVE_LINK.off('click');

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

                amplify.subscribe(EM.ON_FILTER_CHANGE, this, this.updateDashboard);
                amplify.subscribe(EM.ON_FILTER_INVALID_SELECTION, this, this.onFilterInvalidSelection);

            },

            unbindEventListeners: function () {

                amplify.unsubscribe(EM.ON_FILTER_CHANGE, this.updateDashboard);
                amplify.unsubscribe(EM.ON_FILTER_INVALID_SELECTION, this.onFilterInvalidSelection);

            },

            // TODO: move to a common area for all the modules? (create a submodule?)
            createView: function(c) {

                var lang = this.o.lang,
                    basePath = c.basePath || CM.viewsBasePath,
                    updatedRelatedViews = (c.updatedRelatedViews !== undefined)? c.updatedRelatedViews: true,
                    self = this;

                this.$VIEW.empty();

                // get and render the right view
                Require([basePath + c.viewID], _.bind(function (view) {

                    var filter = view.filter || null,
                        dashboard = view.dashboard || null,
                        requestKey = ++this.o.requestKey,
                        t = Handlebars.compile(templateView);

                    // extending view
                    view = $.extend(true, {}, c.config, view);

                    // set comments
                    ViewUtils.setDashboardComment(view);

                    /* Load main structure. */
                    this.$VIEW.append(t(view));

                    // update related views
                    // TODO: review the relatedViews template part
                    if (updatedRelatedViews) {
                        ViewUtils.addRelatedViews(this.$RELATED_VIEWS, view, _.bind(this.createView, this));
                    }

                    this.$FILTER_BOX = this.$VIEW.find(s.FILTER_BOX);
                    this.$DASHBOARD = this.$VIEW.find(s.DASHBOARD);

                    // render filters
                    if (filter !== null) {

                        this.filterBox = new FilterBox();
                        this.filterBox.render({
                            filter: filter,
                            // override event listener for the filter change (custom for browse by domain)
                            E: $.extend(true, {}, EM),
                            container: this.$FILTER_BOX,
                            lang: lang
                        }).then(_.bind(function() {
                            this.renderDashboard(view);
                        }, this));

                    }else{
                        // render dashboard
                        if (dashboard !== null) {
                            this.renderDashboard(view);
                        }
                        else {
                            log.error("BrowseByDomainView.createView;View is not defined, handle exception");
                        }
                    }

                }, this),

                    // Catch missing views
                    function (e) {
                    //display error to user
                    log.error("BrowseByDomainView.createView; empty view", e);
                    self.$VIEW.html("<h4 style='padding-top:35px;' class='text-center'>" + i18nLabels.missing_view + "</h4>");
                });

            },

            renderDashboard: function(view) {

                var lang = this.o.lang,
                    config = $.extend(true, {}, view.dashboard, {
                    container: this.$DASHBOARD,
                    layout: 'fluid',
                    lang: lang
                });

                this.dashboard = new Dashboard();

                // setting default filter options (i.e. language and datasouce)
                config.defaultFilter = ViewUtils.defaultFilterOptions(config.defaultFilter);
                _.each(config.items, _.bind(function(item) {
                    item.config = ViewUtils.defaultItemOptions(item, CM.view);
                }, this));

                config._name = 'by_domain';
                this.dashboard.render(config);

                this.updateDashboard( {
                    isOnLoad: true
                })

            },

            updateDashboard: function(c) {

                var isOnLoad = c? c.isOnLoad || false: false;

                // track the request change
                if ( !isOnLoad ) {
                    this._analyticsOnChange();
                }

                //log.info("BrowseByDomainView.updateDashboard; this.filterBox", this.filterBox);

                // apply filters to dashboard
                this.dashboard.filter(this.filterBox.getFilters(), isOnLoad);

            },

            _analyticsOnChange: function() {

                amplify.publish(E.GOOGLE_ANALYTICS_EVENT, {
                    category: A.browse_by_domain.selection_change.category,
                    action: A.browse_by_domain.selection_change.action,
                    label: A.browse_by_domain.selection_change.label
                });

            },

            onFilterInvalidSelection: function() {

                if ( this.dashboard) {
                    this.dashboard.destroy();
                }

            },

            dispose: function () {

                log.info("BrowseByDomainView.dispose;");

                this.unbindEventListeners();

                if ( this.dashboard && _.isFunction(this.dashboard.destroy)) {
                    this.dashboard.destroy();
                }

                if ( this.filterBox && _.isFunction(this.filterBox.destroy)) {
                    this.filterBox.destroy();
                }

                this.$el.empty();

                View.prototype.dispose.call(this, arguments);
            }

        });

    return BrowseByDomainView;
});
