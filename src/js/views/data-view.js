/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'config/Analytics',
    'config/Config',
    'config/Events',
    'globals/Common',
    'config/Routes',
    'text!templates/data/data.hbs',
    'i18n!nls/download',
    'lib/groups/groups',
    'amplify'
], function ($, log, View, A, C, E, Common, ROUTE,
             template, i18nLabels,
             Groups
) {

    'use strict';

    var s = {

        GROUPS: "#fs-data-groups",
        //ONBOARDING: "[data-role='onboarding']"
        ONBOARDING: "[data-role='help']"

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
            return {
                data: i18nLabels.data,
                direction: C.direction
            };
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
            this.$ONBOARDING = $(s.ONBOARDING);
            this.$ONBOARDING.show();
            this.$ONBOARDING.tooltip('destroy');
            this.$ONBOARDING.tooltip({
                container: 'body'
            });
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

            var self = this;

            this.$ONBOARDING.on('click', function(e) {
                e.preventDefault();
                self.groups.tour(true);
            });

        },

        unbindEventListeners: function () {

            if (this.$ONBOARDING) {
                this.$ONBOARDING.off();
            }

        },

        dispose: function () {

            if(this.groups && this.groups.destroy) {
                this.groups.destroy();
            }

            if(this.$ONBOARDING) {
                this.$ONBOARDING.tooltip('destroy');
                this.$ONBOARDING.hide();
            }

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return DataView;
});
