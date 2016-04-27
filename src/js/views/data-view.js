/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'config/FAOSTAT',
    'config/Config',
    'config/Events',
    'globals/Common',
    'config/Routes',
    'text!templates/data/data.hbs',
    'i18n!nls/download',
    'lib/groups/groups',
    'amplify'
], function ($, log, View, F, C, E, Common, ROUTE,
             template, i18nLabels,
             Groups
) {

    'use strict';

    var s = {

        GROUPS: "#fs-data-groups"

    },

    defaultOptions = {

    },

    DataView = View.extend({

        autoRender: true,

        className: 'download',

        template: template,

        initialize: function (options) {

            log.info("DataView.initialize; options", options);

            this.o = $.extend(true, {}, defaultOptions, options);
            this.o.lang = Common.getLocale();

            // TODO: useful?
            this.options = $.extend(true, {}, options);

        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {data: 'data'});

            this.initVariables();

            this.initComponents();

            this.configurePage();

            this.bindEventListeners();
        },

        initVariables: function () {

            this.$GROUPS = this.$el.find(s.GROUPS);

        },

        initComponents: function () {

            this.groups = new Groups();

            this.groups.render({
                container: this.$GROUPS
            });

        },

        configurePage: function () {

        },

        bindEventListeners: function () {

            // subscribe group event listener
            //amplify.subscribe();

        },

        changeState: function(options) {

           /* var section = (options && options.hasOwnProperty('section'))? options.section: this.o.section,
                id = (options && options.hasOwnProperty('id'))? options.id: this.o.selected.id,
                force = (options && options.hasOwnProperty('force'))? options.force: false;

            log.info('ChangeState: ', section, id, force);

            Common.changeURL(section, [id], force);*/

        },

        unbindEventListeners: function () {

        },

        dispose: function () {

            if(this.groups && this.groups.destroy) {
                this.groups.destroy();
            }

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return DataView;
});
