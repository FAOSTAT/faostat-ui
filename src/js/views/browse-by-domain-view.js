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
    'fx-ds/start',
    'amplify'
], function (View, F, C, Q, E, CM, template, i18nLabels, Handlebars, Common, Tree) {

    'use strict';

    var s = {

            TREE: "#fs-browse-by-domain-tree",
            VIEW_TITLE: "#fs-browse-by-domain-view-title",
            VIEW: "#fs-browse-by-domain-view"

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
            this.renderDashBoard(obj);

        },

        configurePage: function () {

        },

        bindEventListeners: function () {

        },

        unbindEventListeners: function () {

        },

        changeState: function() {
            Common.changeURL(this.o.section + '_code', [this.o.code], false);
        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        },

        renderDashBoard: function(config) {

            require([config.basePath + config.viewID + '_fenix'], _.bind(function(view) {

                if (this.dashboard && this.dashboard.destroy) {
                    this.dashboard.destroy();
                }

                this.dashboard = new Dashboard({

                    //Ignored if layout = injected
                    container: s.VIEW,

                    layout: "fluid"
                });

                console.log(view);

               this.dashboard.render(view.dashboard);
            }, this));

        },


        // TODO: move to a common area for all the modules (create a submodule?)
        createView: function(config) {

            var container = config.container;

            // get and render the right view
            require([config.basePath + config.viewID], _.bind(function(view) {
                this.createView(view);
            }, this));

            console.log(view);

            var lang = this.o.lang,
                filters = view.filters || null,
                dashboard = view.dashboard || null;

            // create filters
            if (filters) {
                this.createFilters({
                    filters: filters,
                    lang: lang
                });
            }

            // create dashboard
            if (dashboard) {
                this.createDashboard(view.dashboard);
            }else{
                console.error("View is not defined, handle exception");
            }

        },

        createFilters: function(filters, lang) {

        },

        createDashboard: function(dashboard) {

        }

    });

    return BrowseByDomainView;
});
