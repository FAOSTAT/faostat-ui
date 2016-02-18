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
    'text!templates/download/download.hbs',
    'i18n!nls/download',
    'FAOSTAT_UI_TREE',
    'fs-r-p/start',
    'fs-i-d/start',
    // TODO: change Names
    'FAOSTAT_UI_BULK_DOWNLOADS',
    //'FENIX_UI_METADATA_VIEWER',
    'fs-m-v/start',
    'FAOSTAT_UI_WELCOME_PAGE',
    'lib/download/domains_list/domains-list',
    'moment',
    'amplify'
], function ($, log, View, F, C, E, Common, ROUTE,
             template, i18nLabels,
             Tree, Report, InteractiveDownload, BulkDownloads, MetadataViewer, WelcomePage, DomainsList,
             moment
) {

    'use strict';

    var s = {

            TREE: "#fs-download-domain-tree",
            SEARCH_TREE: "#fs-download-tree-search",
            OUTPUT_AREA: "#fs-download-output-area",
            MAIN_CONTAINER_TITLE: "#fs-download-main-container-title",

            REPORT: "#report",
            BULK: "#bulk_downloads",
            ABOUT: "#about",
            INTERACTIVE_DOWNLOAD: "#interactive_download",
            METADATA: "#metadata"

    },
    DownloadView = View.extend({

        autoRender: true,

        className: 'download',

        template: template,

        initialize: function (options) {

            log.info(options);

            this.o = $.extend(true, {}, options);
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
            amplify.publish(E.STATE_CHANGE, {download: 'download'});

            this.initVariables();

            this.initComponents();

            this.bindEventListeners();

            this.configurePage();
        },

        initVariables: function () {

            this.$TREE = this.$el.find(s.TREE);
            this.$OUTPUT_AREA = this.$el.find(s.OUTPUT_AREA);
            this.$REPORT = this.$el.find(s.REPORT);
            this.$BULK = this.$el.find(s.BULK);
            this.$METADATA = this.$el.find(s.METADATA);
            this.$INTERACTIVE_DOWNLOAD = this.$el.find(s.INTERACTIVE_DOWNLOAD);
            this.$ABOUT = this.$el.find(s.ABOUT);
            this.$MAIN_CONTAINER_TITLE = this.$el.find(s.MAIN_CONTAINER_TITLE);

            this.$el.find('.nav-tabs [data-section=' + this.o.section + ']').tab('show');

        },

        initComponents: function () {

            var self = this;

            this.tree = new Tree();
            this.tree.init({
                placeholder_id: this.$TREE,
                placeholder_search: this.$el.find(s.SEARCH_TREE),
                datasource: C.DATASOURCE,
                lang: this.o.lang,
                code: this.o.code,
                callback: {

                    onClick: function (callback) {

                        callback.type = self.tree.getCodeType();

                        self.updateSection(callback);

                        self.changeState();

                    },

                    onTreeRendered: function (callback) {

                        callback.type = self.tree.getCodeType();

                        self.updateSection(callback);

                    }

                }
            });

        },

        updateSection: function(options) {

            log.info("Update section");

            // TODO: check tabs

            this.o.selected = $.extend(true, {}, options);

            this.switchTabs(this.o.section, this.o.selected);

        },

        configurePage: function () {

        },

        bindEventListeners: function () {

            var self = this;

            // bind tabs listeners
            this.$el.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

                self.o.section = $(e.target).data("section"); // activated tab

                self.switchTabs(self.o.section, self.o.selected);

                self.changeState();

            });

        },

        switchTabs: function(section, options) {

            log.info('switch tab: ', section, options);

            var code = options.id,
                label = options.label,
                type = options.type;

            // this sections should be always cleaned
            this.$OUTPUT_AREA.empty();

            // Set Title
            this.$MAIN_CONTAINER_TITLE.html(label);

            // check tab availability
            this.checkSectionsAvailability(section, code);

            if ( type === 'group') {
                this.switchTabsGroup(section, options);
            }

            if ( type === 'domain') {
                this.switchTabsDomain(section, options);
            }

        },

        checkSectionsAvailability: function(section, code) {

            // TODO: check show/hide tabs and if tab is available (use APIs)
            log.info('DONWLOAD.checkSectionsAvailability;', section, code);

            // TODO: change with APIs
            if (code === 'FBS') {
                this.$el.find('.nav-tabs [data-section="report"]').show();
            }else {
                this.$el.find('.nav-tabs [data-section="report"]').hide();
            }

        },

        switchTabsGroup: function(section, options) {

            var code = options.id,
                label = options.label,
                type = options.type;

            if (section === 'about') {

                this.welcomePage = new WelcomePage();
                this.welcomePage.init({
                    container: this.$ABOUT,
                    domain_code: code,
                    domain_name: label,
                    base_url: C.URL_FAOSTAT_DOCUMENTS_BASEPATH
                });

            }

            if (section === 'bulk') {

                this.bulkDownloads = new BulkDownloads();
                this.$BULK.empty();
                this.bulkDownloads.init({
                    container: this.$BULK,
                    code: code,
                    bulk_downloads_root: C.URL_BULK_DOWNLOADS_BASEPATH
                });

            }

            if (section === 'interactive') {

                this.createDomainsList(this.$INTERACTIVE_DOWNLOAD, section, code, i18nLabels.domains_list_description_interactive_download);

            }

            if (section === 'bulk') {

                this.createDomainsList(this.$BULK, section, code, i18nLabels.domains_list_description_bulk);

            }

            if (section === 'report') {

                this.createDomainsList(this.$REPORT, section, code, i18nLabels.domains_list_report);

            }

            if (section === 'metadata') {

                this.createDomainsList(this.$METADATA, section, code, i18nLabels.domains_list_description_metadata);

            }

        },

        createDomainsList: function(container, section, code, section_description) {

            this.domainsList = new DomainsList();
            this.domainsList.init({
                container: container,
                section: section,
                code: code,
                section_description: section_description
            });

        },

        switchTabsDomain: function(section, options) {

            var code = options.id,
                label = options.label,
                dateUpdate = moment(new Date(options.dateUpdate)).format("MM-DD-YYYY"),
                type = options.type;

            if (section === 'bulk') {

                this.bulkDownloads = new BulkDownloads();
                this.$BULK.empty();
                this.bulkDownloads.init({
                    container: this.$BULK,
                    code: code,
                    bulk_downloads_root: C.URL_BULK_DOWNLOADS_BASEPATH
                });

            }

            if (section === 'interactive') {

                this.interactiveDownload = new InteractiveDownload();
                this.$INTERACTIVE_DOWNLOAD.empty();
                this.interactiveDownload.init({
                    container: this.$INTERACTIVE_DOWNLOAD,
                    // to output the table outside the standard output area
                    output_area: this.$OUTPUT_AREA,
                    code: code,
                    dateUpdate: dateUpdate
                });

            }

            if (section === 'report') {

                // TODO: check on tabs APIs
                if ( options.id === 'FBS') {

                    this.report = new Report();
                    this.$REPORT.empty();
                    this.report.init({
                        container: this.$REPORT,
                        code: code
                    });

                }else {

                    // TODO: set where the user should go during the routing
                    this.changeState({
                        section: ROUTE.DOWNLOAD_ABOUT,
                        id: code,
                        force: true
                    });
                }

            }

            if (section === 'metadata') {


                // adding loading
                this.$METADATA.empty();
                amplify.publish(E.LOADING_SHOW, {
                    container: this.$METADATA
                });

                this.metadataViewer = new MetadataViewer();
                this.metadataViewer.init({
                    container: this.$METADATA,
                    code: code,
                    lang: Common.getLocale(),
                    url_get_metadata: C.URL_METADATA_MODEL,
                    url_get_domain: C.URL_METADATA_DOMAIN
                });

            }

            if (section === 'about') {

                this.welcomePage = new WelcomePage();
                this.welcomePage.init({
                    container: this.$ABOUT,
                    domain_code: code,
                    domain_name: label,
                    base_url: C.URL_FAOSTAT_DOCUMENTS_BASEPATH
                });

            }

        },

        changeState: function(options) {

            var section = (options && options.hasOwnProperty('section'))? options.section: this.o.section,
                id = (options && options.hasOwnProperty('id'))? options.id: this.o.selected.id,
                force = (options && options.hasOwnProperty('force'))? options.force: false;

            log.info('ChangeState: ', section, id, force);

            Common.changeURL(section, [id], force);

        },

        unbindEventListeners: function () {

            // unbind tabs listeners
            this.$el.find('a[data-toggle="tab"]').off('shown.bs.tab');

        },

        dispose: function () {

            this.unbindEventListeners();

            if (this.report && this.report.destroy) {
                this.report.destroy();
            }

            View.prototype.dispose.call(this, arguments);
        }
    });

    return DownloadView;
});
