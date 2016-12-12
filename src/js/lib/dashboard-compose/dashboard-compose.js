/*global define, amplify*/
define([
        'jquery',
        'loglevel',
        'globals/Common',
        'config/Events',
        'config/Analytics',
        'text!lib/dashboard-compose/templates/template.hbs',
        'i18n!nls/common',
        'handlebars',
        'lib/filters/filter-box',
        'fx-ds/start',
        'lib/view/view-utils',
        'amplify'
    ],
    function ($, log, Common, E, A, template, i18n, Handlebars, FilterBox, DashBoard, ViewUtils) {

        'use strict';

        var defaultOptions = {

                // analytics
                view: {
                    analyticsLabel: "",
                    event: {
                        ON_FILTER_CHANGE: E.ON_FILTER_CHANGE,
                        ON_FILTER_INVALID_SELECTION: E.ON_FILTER_INVALID_SELECTION
                    },
                    //customDashBoardConfiguration: $.extend({}, this, CM.view)
                },
                A: {
                    onChange: $.extend(true, {},  A.browse_by_domain.selection_change)
                }
            },

            s = {
                FILTER_BOX: '[data-role="filter"]',
                DASHBOARD: '[data-role="dashboard"]'
            };

        function DashBoardComposer() {
            return this;
        }

        DashBoardComposer.prototype.render = function(config) {

            this.o = $.extend(true, {}, defaultOptions);

            // setting lang. It is override by config if it needed
            this.o.lang = Common.getLocale();

            // setting view
            this.o.view = $.extend(true, {}, this.o.view, config);

            // setting event
            // TODO: review it
            this.o.view.event.ON_FILTER_CHANGE = this.o.view.event.ON_FILTER_CHANGE + Math.random().toString().replace(".", "");
            this.o.view.event.ON_FILTER_INVALID_SELECTION = this.o.view.event.ON_FILTER_INVALID_SELECTION + Math.random().toString().replace(".", "");

            if (this.o.view.container !== undefined) {
                this.$CONTAINER = $(this.o.view.container);
                if(this.$CONTAINER.length <= 0) {
                    log.error("DashBoardComposer.render; Invalid container in configuration", config);
                    // TODO: throw error?
                }
            }else{
                log.error("DashBoardComposer.render; Missing container in configuration", config);
            }

            var t = Handlebars.compile(template);

            this.$CONTAINER.html(t({
                comment: this.o.view.comment,
                filter: this.o.view.filter
            }));

            this.$FILTER_BOX = this.$CONTAINER.find(s.FILTER_BOX);
            this.$DASHBOARD = this.$CONTAINER.find(s.DASHBOARD);

            this._createView(this.o.view);

            this._bindEventListeners();

            return this;
        };

        DashBoardComposer.prototype._createView = function(view) {


            var lang = this.o.lang,
                filter = view.filter || null,
                dashboard = view.dashboard || null,
                event = view.event;

            // render filters
            if (filter !== null) {

                this.filterBox = new FilterBox();
                this.filterBox.render({
                    filter: filter,
                    // override event listener for the filter change (custom for browse by domain)
                    E: event,
                    container: this.$FILTER_BOX,
                    lang: lang
                }).then(_.bind(function() {
                    // render dashboard
                    this._renderDashboard(view);
                }, this));

            }else {
                // render dashboard without filters
                if (dashboard !== null) {
                    this._renderDashboard(view);
                }
                else {
                    log.error("DashBoardComposer._createView;View is not defined, handle exception");
                }
            }

        };

        DashBoardComposer.prototype._renderDashboard = function(view) {

            var lang = this.o.lang,
                customDashBoardConfiguration = this.o.view.customDashBoardConfiguration,
                config = $.extend(true, {}, view.dashboard, {
                    container: this.$DASHBOARD,
                    layout: 'fluid',
                    lang: lang
                });

            this.dashboard = new DashBoard();

            _.each(config.items, function(item) {
                item.config = ViewUtils.defaultItemOptions(item, customDashBoardConfiguration);
            });

            this.dashboard.render(config);

            this._updateDashboard( {
                isOnLoad: true
            });

        };

        // TODO: review a bit the isOnLoad behaviour
        DashBoardComposer.prototype._updateDashboard = function(c) {

            var isOnLoad = c? c.isOnLoad || false: false;

            // track the request change
            if ( !isOnLoad ) {
                this._analyticsOnChange();
            }

            // apply filters to dashboard
            if (this.filterBox !== undefined) {
                this.dashboard.filter(this.filterBox.getFilters(), isOnLoad);
            }else{
                this.dashboard.filter([], isOnLoad);
            }

        };

        DashBoardComposer.prototype._analyticsOnChange = function() {

            if (this.o.A) {
                amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                    $.extend(true, {}, this.o.A.onChange, {
                        label: this.o.view.analyticsLabel
                    })
                );
            }

        };

        DashBoardComposer.prototype._onFilterInvalidSelection = function() {

            if ( this.dashboard) {
                this.dashboard.clear();
            }

        };

        DashBoardComposer.prototype._bindEventListeners = function () {

            amplify.subscribe(this.o.view.event.ON_FILTER_CHANGE, this, this._updateDashboard);
            amplify.subscribe(this.o.view.event.ON_FILTER_INVALID_SELECTION, this, this._onFilterInvalidSelection);

        };

        DashBoardComposer.prototype._unbindEventListeners = function () {

            amplify.unsubscribe(this.o.view.event.ON_FILTER_CHANGE, this._updateDashboard);
            amplify.unsubscribe(this.o.view.event.ON_FILTER_INVALID_SELECTION, this._onFilterInvalidSelection);

        };

        DashBoardComposer.prototype.destroy = function () {

            log.info("DashBoardComposer.destroy;");

            this._unbindEventListeners();

            if ( this.dashboard && _.isFunction(this.dashboard.destroy)) {
                this.dashboard.destroy();
            }

            if ( this.filterBox && _.isFunction(this.filterBox.destroy)) {
                this.filterBox.destroy();
            }

            this.$CONTAINER.empty();

        };

        return DashBoardComposer;

    });