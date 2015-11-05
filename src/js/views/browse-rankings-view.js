/*global define, _:false, $, console, amplify, FM*/
define([
    'views/base/view',
    'config/FAOSTAT',
    'config/Config',
    'config/Queries',
    'config/Events',
    'config/browse_rankings/Config',
    'text!templates/browse/browse_rankings.hbs',
    'i18n!nls/browse_rankings',
    'handlebars',
    'globals/Common',
    'FAOSTAT_UI_TREE',
    'amplify'
], function (View, F, C, Q, E, CM, template, i18nLabels, Handlebars, Common, Tree) {

    'use strict';

    var s = {

            TREE: "#fs-browse-rankings-tree",
            VIEW_TITLE: "#fs-browse-rankings-view-title",
            VIEW: "#fs-browse-rankings-view"

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

            // TODO: handle change state
            this.changeState();

            this.$TREE = this.$el.find(s.TREE);

        },

        initComponents: function () {

            this.tree = new Tree();
            this.tree.init({
                options: CM.tree.options || null,
                placeholder_id: this.$TREE,
                lang: this.o.lang,
                code: this.o.code,
                custom: this.parseTreeData(CM.tree.config),
                callback: {

                    onClick: _.bind(function (callback) {

                        this.o.code = callback.id;
                        this.o.label = callback.label;

                        console.log(callback.id);

                        // update view
                        this.updateView();

                        // change url state
                        this.changeState();

                    }, this),

                    onTreeRendered:  _.bind(function (callback) {

                        this.o.code = callback.id;
                        this.o.label = callback.label;

                        console.log(callback.id);
                        // update view
                        this.updateView();

                        // change url state

                        // initialize the view

                        //this.changeState();

                    }, this)


                }
            });

        },

        configurePage: function () {

        },

        updateView: function () {

        },


        parseTreeData: function(json) {

            var lang = this.o.lang;

            var data = [];

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
            console.log(this.o.code);
            Common.changeURL(this.o.section + '_code', [this.o.code], false);
        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return BrowseRankingsView;
});
