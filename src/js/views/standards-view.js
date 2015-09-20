/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
define([
    'views/base/view',
    'config/Config',
    'config/Events',
    'text!templates/standards/standards.hbs',
    'i18n!nls/standards',
    'FAOSTAT_UI_STANDARDS_METHODOLOGY',
    'chaplin',
    'sweetAlert',
    'underscore',
    'amplify'
], function (View,
             C,
             E,
             template,
             i18nLabels,
             Methodology,
             Chaplin,
             swal,
             _) {

    'use strict';

    var s,
        StandardsView;

    s = {

        TREE: "#tree",
        METADATA: "metadata_container",
        INTERACTIVE_DOWNLOAD: "interactive_download_selectors",
        BULK_DOWNLOADS: "bulk_downloads"

    };

    StandardsView = View.extend({

        autoRender: true,

        className: 'standards',

        template: template,

        initialize: function (options) {
            this.options = options;
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {standards: 'standards'});

            this.initVariables();

            this.initComponents();

            this.bindEventListeners();

            this.configurePage();
        },

        initVariables: function () {

            //this.$tree = this.$el.find(s.TREE);
            //this.$interactive_download = this.$el.find(s.INTERACTIVE_DOWNLOAD);
            //this.$metadata = this.$el.find(s.METADATA);
            //this.bulk_downloads = this.$el.find(s.BULK_DOWNLOADS);

        },

        initComponents: function () {

            /* Variables. */
            var that = this;

            /* Methodology. */
            if (this.options.section === 'methodology') {
                this.methodology = new Methodology();
                this.methodology.init({
                    placeholder_id: 'standards_content'
                })
            }

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

    return StandardsView;

});
