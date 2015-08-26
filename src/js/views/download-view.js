/*global define, _:false, $, console, amplify, FM*/
define([
    'views/base/view',
    'config/FAOSTAT',
    'config/Config',
    'config/Queries',
    'config/Events',
    'text!templates/download/download.hbs',
    'i18n!nls/download',
    'handlebars',
    'fx-common/WDSClient',
    'FAOSTAT_UI_TREE',
    'FENIX_UI_METADATA_VIEWER',
    'FAOSTAT_UI_BULK_DOWNLOADS',
    'amplify'
], function (View, F, C, Q, E, template, i18nLabels, Handlebars, WDSClient, Tree, MetadataViewer, BulkDownloads) {

    'use strict';

    var s = {

        TREE: "#tree",
        METADATA: "metadata",
        BULK_DOWNLOADS: "bulk_downloads"

    };

    var DownloadView = View.extend({

        autoRender: true,

        className: 'download',

        template: template,

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {download: 'download'});

            this.initVariables();

            this.initComponents();

            this.bindEventListeners();

            this.configurePage();
        },

        initVariables: function () {

            this.$tree = this.$el.find(s.TREE);
            this.$metadata = this.$el.find(s.METADATA);
            this.bulk_downloads = this.$el.find(s.BULK_DOWNLOADS);

        },

        initComponents: function () {

            /* WDS Client. */
            this.WDSClient = new WDSClient({
                serviceUrl: C.WDS_URL,
                datasource: C.DB_NAME,
                outputType : C.WDS_OUTPUT_TYPE
            });

            /* Bulk Downloads. */
            this.bulk_downloads = new BulkDownloads();
            this.bulk_downloads.init({
                placeholder_id: s.BULK_DOWNLOADS,
                domain: 'GE'
            });
            this.bulk_downloads.create_flat_list();

            /* Tree. */
            this.tree = new Tree();
            this.tree.init({
                placeholder_id: s.TREE
            });

            /* Metadata viewer. */
            this.metadata = new MetadataViewer();
            this.metadata.init({
                placeholder_id: s.METADATA
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

    return DownloadView;
});
