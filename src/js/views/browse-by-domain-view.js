/*global define, _:false, $, console, amplify, require*/
define([
    'views/base/view',
    'config/FAOSTAT',
    'config/Config',
    'config/Queries',
    'config/Events',
    'config/browse_by_domain/Config',
    'text!templates/browse/browse_by_domain.hbs',
    'i18n!nls/browse_by_domain',
    'handlebars',
    'globals/Common',
    'FAOSTAT_UI_TREE',
    'lib/filters/filter-box',
    'fx-ds/start',
    'amplify'
], function (View, F, C, Q, E, CM, template, i18nLabels, Handlebars, Common, Tree, FilterBox, Dashboard) {

    'use strict';

    var s = {

            TREE: "#fs-browse-by-domain-tree",
            VIEW_TITLE: "#fs-browse-by-domain-view-title",
            //VIEW: "#fs-browse-by-domain-view",
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

            this.$FILTER_BOX = this.$el.find(s.FILTER_BOX);
            this.$DASHBOARD = this.$el.find(s.DASHBOARD);

        },

        initComponents: function () {

            this.tree = new Tree();
            this.tree.init({
                placeholder_id: this.$TREE,
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

                        // change url state

                        // initialize the view

                        //this.changeState();

                    }, this)

                }
            });

        },

        updateView: function() {
            var code = this.o.code,
                label = this.o.label;

            this.$VIEW_TITLE.html(label);

            var obj = {
                container: this.$VIEW,
                basePath:CM.viewsBasePath,
                viewID: code
            }

            //this.createView(obj);
            this.createView(obj);

        },

        configurePage: function () {

        },

        bindEventListeners: function () {

            amplify.subscribe(E.VIEW_FILTER_CHANGE, _.bind(this.updateDashboard, this));

        },

        unbindEventListeners: function () {

            amplify.unsubscribe(E.VIEW_FILTER_CHANGE, _.bind(this.updateDashboard, this));

        },

        changeState: function() {
            Common.changeURL(this.o.section + '_code', [this.o.code], false);
        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        },




        // TODO: move to a common area for all the modules? (create a submodule?)
        createView: function(config) {

            var container = config.container,
                lang = this.o.lang;

            // get and render the right view
            require([config.basePath + config.viewID], _.bind(function(view) {

                var filter = view.filter || null,
                    dashboard = view.dashboard || null;

                // render structure (structure i.e. change view on click selection)

                // render filters
                if (filter) {
                    this.renderFilter({
                        filter: filter,
                        container: this.$FILTER_BOX,
                        lang: lang
                    });
                }

                // render dashboard
                if (dashboard) {
                    this.renderDashboard($.extend(true, {}, view.dashboard, {
                        container: this.$DASHBOARD,
                        layout: 'fluid',
                        //layout: 'injected',
                        lang: lang}));
                }else{
                    console.error("View is not defined, handle exception");
                }

            }, this));

        },

        renderFilter: function(config) {
            // dispose old filters

            // create filters
            if (this.filterBox && this.filterBox.destroy) {
                this.filterBox.destroy();
            }

            this.filterBox = new FilterBox();
            this.filterBox.render(config);

            // on change getFilters and apply to dashboard

        },

        renderDashboard: function(config) {

            if (this.dashboard && this.dashboard.destroy) {
                this.dashboard.destroy();
            }

            try {

                this.dashboard = new Dashboard();
                this.dashboard.render(config);


            }catch (e) {
                console.error(e);
            }

            //console.log(this.container.length);
            // create dashboard

            // on change recreate dshboard

        },

        updateDashboard: function() {

            console.log(this);
            // getFilters
            var filters = this.filterBox.getFilters();

            // apply filters to dashboard
            //this.dashboard.filter(filters);

        }

    });

    return BrowseByDomainView;
});
