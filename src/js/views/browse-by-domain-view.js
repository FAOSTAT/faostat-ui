/*global define, _:false, $, console, amplify, require*/
define([
    'require',
    'jquery',
    'loglevel',
    'globals/Common',
    'views/base/view',
    'config/Analytics',
    'config/Config',
    'config/Routes',
    'config/Events',
    'config/browse_by_domain/Config',
    'config/browse_by_domain/Events',
    'text!templates/browse_by_domain/browse_by_domain.hbs',
    'i18n!nls/browse_by_domain',
    'handlebars',
    'lib/view/view-utils',
    'lib/dashboard-compose/dashboard-compose',
    'bootstrap',
    'amplify'
], function (Require, $, log, Common, View, A, C, ROUTE, E, CM, EM, template, i18nLabels, Handlebars, ViewUtils, DashBoardCompose) {

    'use strict';

    var s = {

            RELATED_VIEWS: "[data-role='related-views']",
            DASHBOARD_COMPOSE: "[data-role='dashboard-compose']"

        },
        defaultOptions = {},

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

                this.$RELATED_VIEWS = this.$el.find(s.RELATED_VIEWS);
                this.$DASHBOARD_COMPOSE = this.$el.find(s.DASHBOARD_COMPOSE);

            },

            initComponents: function () {

                this.createView({
                    code: this.o.code
                });

            },

            configurePage: function () {

            },

            // TODO: move to a common area for all the modules? (create a submodule?)
            createView: function(c) {

                var code = c.code || c.viewID,
                    basePath = c.basePath || CM.viewsBasePath,
                    updatedRelatedViews = (c.updatedRelatedViews !== undefined)? c.updatedRelatedViews: true,
                    self = this;

                this.$DASHBOARD_COMPOSE.empty();

                // get and render the right view
                Require([basePath + code], _.bind(function (view) {


                    // the updated related view check is used during the view tab switch. This should be
                    // maked nicer
                    if (updatedRelatedViews) {
                        ViewUtils.addRelatedViews(this.$RELATED_VIEWS, view, _.bind(this.createView, this));
                    }

                    self.dashboardCompose = new DashBoardCompose();
                    self.dashboardCompose.render($.extend(true, {},
                        view, {
                            container: self.$DASHBOARD_COMPOSE,
                            customDashBoardConfiguration: $.extend(true, {}, CM.view)
                        })
                    );

                }, this),

                    // Catch missing views
                    function (e) {
                    //display error to user
                    log.error("BrowseByDomainView.createView; empty view", e);
                    self.$DASHBOARD_COMPOSE.html("<h4 style='padding-top:35px;' class='text-center'>" + i18nLabels.missing_view + "</h4>");
                });

            },

            bindEventListeners: function () {

            },

            unbindEventListeners: function () {

            },

            dispose: function () {

                //log.info("BrowseByDomainView.dispose;");

                this.unbindEventListeners();

                if ( this.dashboardCompose && _.isFunction(this.dashboardCompose.destroy)) {
                    this.dashboardCompose.destroy();
                }

                // TODO: handle related views

                this.$el.empty();

                View.prototype.dispose.call(this, arguments);
            }

        });

    return BrowseByDomainView;
});
