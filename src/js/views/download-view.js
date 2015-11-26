/*global define, _:false, $, console, amplify, FM, setInterval, clearInterval, document, window*/
/*jslint todo: true */
/*jslint nomen: true */
define([
    'views/base/view',
    'config/Config',
    'config/Events',
    'chaplin',
    'underscore',
    'globals/Common',
    'FAOSTAT_UI_DOWNLOAD',
    'amplify'
], function (View,
             C,
             E,
             Chaplin,
             _,
             Common,
             FAOSTATDownload) {

    'use strict';

    var s = {

        TREE: "#tree",

        METADATA: "metadata_container",
        METADATA_TAB: "a[href='#metadata']",

        INTERACTIVE_DOWNLOAD: "interactive_download",
        INTERACTIVE_DOWNLOAD_SELECTORS: "interactive_download_selectors",
        INTERACTIVE_DOWNLOAD_TAB: "a[href='#interactive_download']",

        BULK_DOWNLOADS: "bulk_downloads",
        BULK_DOWNLOADS_TAB: "a[href='#bulk_downloads']",

        DOWNLOAD_OUTPUT_AREA: "#downloadOutputArea",

        DOWNLOAD_OPTIONS_CSV_BUTTON: '#download_options_csv_button',
        DOWNLOAD_OPTIONS_CSV_INFO_BUTTON: '#download_options_csv_info_button',
        DOWNLOAD_OPTIONS_EXCEL_BUTTON: '#download_options_excel_button',
        DOWNLOAD_OPTIONS_METADATA_BUTTON: '#download_options_metadata_button',
        PREVIEW_BUTTON: '#preview_button',

        PREVIEW_OPTIONS_PLACEHOLDER: 'preview_options_placeholder',
        DOWNLOAD_OPTIONS_PLACEHOLDER: 'download_options_placeholder'

    };

    // TODO: Could be useful to pass to a FSM (i.e. for the FBS etc)
    var state = {
        section: null,
        code: null
    };

    var DownloadView = View.extend({

        autoRender: true,

        className: 'download',

        template: null,

        initialize: function (options) {
            this.options = options;
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            var that = this;
            this.download = new FAOSTATDownload({
                placeholder_id: 'main-container',
                code: that.options.code,
                section: that.options.section
            });
            this.download.init();

            // Google Analytics change page
            amplify.publish(E.GOOGLE_ANALYTICS_PAGE_VIEW, {});

            //update State
            amplify.publish(E.STATE_CHANGE, {download: 'download'});

            this.initVariables();

            this.initComponents();

            this.configurePage();
        },

        initVariables: function () {

            this.options.lang = Common.getLocale();

            this.$tree = this.$el.find(s.TREE);

            this.$metadata = this.$el.find(s.METADATA);

            /* Table settings. */
            this.page_size = 60;

        },

        initComponents: function () {

        },

        initiateSection: function () {

            this.bindEventListeners();
        },

        configurePage: function () {

        },

        bindEventListeners: function () {

        },

        unbindEventListeners: function () {

            this.$el.find('a[data-toggle="tab"]').off();

        },

        dispose: function () {
            this.unbindEventListeners();
            console.debug('genral dispose');
            this.download.dispose();
            View.prototype.dispose.call(this, arguments);
        }

    });

    return DownloadView;

});
