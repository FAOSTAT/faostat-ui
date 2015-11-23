/*global define, _:false, amplify, FM*/
define([
    'jquery',
    'globals/Common',
    'config/Events',
    'text!lib/filters/templates/filter.hbs',
    'i18n!nls/filter',
    'handlebars',
    'underscore',
    'loglevel',
    'select2',
    'amplify'
], function ($, Common, E, templateFilter, i18nLabels, Handlebars, _, log) {

    'use strict';

    function View() {

        return this;
    }

    View.prototype.init = function(c) {

        this.o = $.extend(true, {}, c);

    };

    // TODO: move to a common area for all the modules? (create a submodule?)
    View.prototype.createView = function(c) {

        var lang = Common.getLocale(),
            view = this.o.view,
            updatedRelatedViews = (c.updatedRelatedViews !== undefined)? c.updatedRelatedViews: true;

        // extending view
        var view = $.extend(true, {}, c.config, view);

        // prepare data
        //comment
        if (view.hasOwnProperty('comment')) {
            // TODO: switch to handlebars helpers with language
            if (view.comment.hasOwnProperty('text')) {
                view.comment.text = view.comment.text[lang] || view.comment.text;
            }
            if (view.comment.hasOwnProperty('pdf')) {
                view.comment.url = C.PDF_BASEPATH + lang.toUpperCase() + "/" + view.comment.pdf;
            }
        }

        /* Load main structure. */
        var t = Handlebars.compile(templateView);
        this.$VIEW.append(t(view));


        // TODO: review the relatedViews template part
        if ( updatedRelatedViews) {

            var t = Handlebars.compile(templateRelatedViews);
            this.$RELATED_VIEWS.html(t({relatedViews: view.relatedViews}));

            this.$RELATED_VIEWS.find('.nav-tabs').on('click', _.bind(function (e) {
                var viewID = $(e.target).data("view");

                this.createView({
                    viewID: viewID,
                    updatedRelatedViews: false
                })

            }, this));

        }

        this.$FILTER_BOX = this.$VIEW.find(s.FILTER_BOX);
        this.$DASHBOARD = this.$VIEW.find(s.DASHBOARD);

        var filter = view.filter || null,
            dashboard = view.dashboard || null;

        // render structure (structure i.e. change view on click selection)

        // render filters
        if (filter !== null) {
            this.renderFilter({
                filter: filter,
                // overrride event listener for the filter change (custom for browse by domain)
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

    },

        View.prototype.renderFilter = function(config) {

        // create filters
        if (this.filterBox && this.filterBox.destroy) {
            this.filterBox.destroy();
        }

        this.filterBox = new FilterBox();

        // render filters
        this.filterBox.render(config, false);

    },

        View.prototype.renderDashboard = function(config) {

        if (this.dashboard && this.dashboard.destroy) {
            this.dashboard.destroy();
        }

        this.dashboard = new Dashboard();

        // setting default filter options (i.e. language and datasouce)
        config.defaultFilter = this.defaultFilterOptions(config.defaultFilter);
        _.each(config.items, _.bind(function(item) {
            item.config = this.defaultItemOptions(item);
        }, this));

        this.dashboard.render(config);

    },


    View.prototype.updateDashboard = function(c) {

        var isOnLoad = (c)? c.isOnLoad || false: false;

        // getFilters
        var filters = this.filterBox.getFilters();

        // apply filters to dashboard
        this.dashboard.filter(filters, isOnLoad);

    },

    View.prototype.defaultFilterOptions = function(config) {

        return $.extend(
            true,
            {},
            config,
            {
                lang: this.o.lang,
                datasource: C.DATASOURCE
            }
        );

    },

    View.prototype.defaultItemOptions = function(item) {

        if (item.type) {
            if (CM.view && CM.view.hasOwnProperty(item.type) && item.hasOwnProperty('config')) {
                return $.extend(true, {}, CM.view[item.type], item.config);
            }
        }

        return {};

    }

    return View;
});
