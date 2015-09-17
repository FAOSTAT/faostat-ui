/*global define, _:false, $, console, amplify, FM*/
define([
    'views/base/view',
    'config/FAOSTAT',
    'config/Config',
    'config/Queries',
    'config/Events',
    'text!templates/browse/browse.hbs',
    'i18n!nls/browse',
    'handlebars',
    'fx-common/WDSClient',
    'FAOSTAT_UI_TREE',
    'amplify'
], function (View, F, C, Q, E, template, i18nLabels, Handlebars, WDSClient, Tree) {

    'use strict';

    var s = {

        TREE: "#tree"
    };

    var BrowseView = View.extend({

        autoRender: true,

        className: 'download',

        template: template,

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            //console.log(F.browse.metadata);

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {browse: 'browse'});

            this.initVariables();

            this.initComponents();

            this.bindEventListeners();

            this.configurePage();
        },

        initVariables: function () {

            this.$tree = this.$el.find(s.TREE);

            console.log(this.$tree.length);

        },

        initComponents: function () {

            this.WDSClient = new WDSClient({
                serviceUrl: C.WDS_URL,
                datasource: C.DB_NAME,
                outputType : C.WDS_OUTPUT_TYPE
            });

        },

        configurePage: function () {

        },

        bindEventListeners: function () {

        },

        unbindEventListeners: function () {

        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return BrowseView;
});
