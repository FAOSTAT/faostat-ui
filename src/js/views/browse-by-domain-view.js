/*global define, _:false, $, console, amplify, FM*/
define([
    'views/base/view',
    'config/FAOSTAT',
    'config/Config',
    'config/Queries',
    'config/Events',
    'text!templates/browse/browse_by_domain.hbs',
    'i18n!nls/browse',
    'handlebars',
    'globals/Common',
    'FAOSTAT_UI_TREE',
    'amplify'
], function (View, F, C, Q, E, template, i18nLabels, Handlebars, Common, Tree) {

    'use strict';

    var s = {

            TREE: "#fs-browse-by-domain-tree"

        },
        o = {

        };

    var BrowseByDomainView = View.extend({

        autoRender: true,

        className: 'browse',

        template: template,

        initialize: function (options) {
            console.log(options);
            this.o = $.extend(true, {}, o, options);
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

            console.log("BrowseByDomainView");

            this.o.lang = Common.getLocale();

            //this.$table = this.$el.find(s.TABLE);
            this.$tree = this.$el.find(s.TREE);

        },

        initComponents: function () {

            this.tree = new Tree();
            this.tree.init({
                placeholder_id: this.$tree,
                code: this.o.code,
                callback: {

                    onClick: _.bind(function (callback) {

                       // TODO: here
                        console.log(callback);

                    }, this)
                }
            });

        },

        configurePage: function () {


        },

        bindEventListeners: function () {

        },

        unbindEventListeners: function () {

        },

        changeState: function() {
            console.warn("TODO: read internal state anche change URL state");
        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return BrowseByDomainView;
});
