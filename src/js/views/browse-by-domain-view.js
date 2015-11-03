/*global define, _:false, $, console, amplify, FM*/
define([
    'views/base/view',
    'config/FAOSTAT',
    'config/Config',
    'config/Queries',
    'config/Events',
    'config/browse_by_domain/Config',
    'text!templates/browse/browse_by_domain.hbs',
    'i18n!nls/browse',
    'handlebars',
    'globals/Common',
    'FAOSTAT_UI_TREE',
    'amplify'
], function (View, F, C, Q, E, CM, template, i18nLabels, Handlebars, Common, Tree) {

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
                groups: {
                    blacklist: CM.groups.blacklist
                },
                domains: {
                    blacklist: CM.domains.blacklist
                },
                callback: {

                    onClick: _.bind(function (callback) {

                       // TODO: here
                        console.log(callback);
                        this.o.code = callback.id;
                        this.o.label = callback.label;

                        // change url state

                        this.changeState();

                    }, this),

                    // TODO get label on end of tree creation
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
            Common.changeURL(this.o.section + '_code', [this.o.code], false);
        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return BrowseByDomainView;
});
