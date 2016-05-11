/*global define, _:false, $, console, amplify, Q*/
define([
    'require',
    'jquery',
    'loglevel',
    'views/base/view',
    'config/Analytics',
    'config/Config',
    'config/Events',
    'globals/Common',
    'config/Routes',
    'text!templates/download/download.hbs',
    'i18n!nls/download',
    'FAOSTAT_UI_TREE',
    //'fs-r-p/start',
    // 'fs-i-d/start',
    // TODO: change Names
    //'FAOSTAT_UI_BULK_DOWNLOADS',
    //'FENIX_UI_METADATA_VIEWER',
    //'fs-m-v/start',
    'lib/related_documents/related_documents',
    //'FAOSTAT_UI_WELCOME_PAGE',
    //'lib/download/domains_list/domains-list',
    'moment',
    'underscore.string',
    //'views/browse-by-domain-view',
    'handlebars',
    'faostatapiclient',
    'lib/common/text-wrapper',
    'amplify'
], function (Require,
             $, log, View, A, C, E, Common, ROUTE,
             template, i18nLabels,
             Tree,
             //Report,
             //InteractiveDownload,
             //BulkDownloads,
             //MetadataViewer,
             //WelcomePage,
             RelatedDocuments,
             //DomainsList,
             moment,
             _s,
            // DomainView,
             Handlebars,
             FAOSTATApi,
             TextWrapper
) {

    // TODO: N.B. Pay attention to the internals calls to: InteractiveDownload, DomainView, DomainsList, MetadataViewer

    'use strict';

    var s = {

            TREE: "#fs-download-domain-tree",
            SEARCH_TREE: "#fs-download-tree-search",
            OUTPUT_AREA: "#fs-download-output-area",
            MAIN_CONTAINER_TITLE: '[data-role="domain-title"]',

            REPORT: "#report",
            BULK: "#bulk_downloads",
            ABOUT: "#about",
            INTERACTIVE_DOWNLOAD: "#interactive_download",
            METADATA: "#metadata",
            BROWSE: "#browse",

            // Related Documents
            RELATED_DOCUMENTS: '[data-role="fs-download-related-documents"]',
            METADATA_BUTTON: '[data-role="fs-download-metadata-button"]',
            BULK_CARET: "[data-role='bulk-downloads-caret']",

            // Tree
            MENU_TREE: '[data-role="fs-domains-menu"]',
            TREE_CONTAINER: '[data-role="fs-domains-tree-container"]',
            TREE_CLOSE: '[data-role="fs-domains-tree-container-close"]',

            // this is used to change the link to the interactive download
            DOWNLOAD_INTERACTIVE_LINK: '[data-role="download-interactive-link"]',

            DESCRIPTION: '[data-role="description"]',
            CONTACTS: '[data-role="contact-name"]',
            BULK_SIDEBAR: '[data-role="fs-download-bulk-downloads-sidebar"]',
            LAST_UPDATE_DATE: '[data-role="last-update"]',
            ORGANIZATION: '[data-role="organization"]',

            TREE_MODAL: '#fs-data-tree-domain-modal'

    },

    defaultOptions = {

    },

    DownloadView = View.extend({

        autoRender: true,

        className: 'download',

        template: template,

        initialize: function (options) {

            log.info("DownloadView.initialize; options", options);

            this.o = $.extend(true, {}, defaultOptions, options);
            this.o.lang = Common.getLocale();

            // TODO: should not be here
            this.api = new FAOSTATApi();

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
            this.$BROWSE = this.$el.find(s.BROWSE);
            this.$MENU_TREE = this.$el.find(s.MENU_TREE);
            this.$TREE_CONTAINER = this.$el.find(s.TREE_CONTAINER);
            this.$TREE_CLOSE = this.$el.find(s.TREE_CLOSE);
            this.$RELATED_DOCUMENTS = this.$el.find(s.RELATED_DOCUMENTS);
            this.$BULK_SIDEBAR = this.$el.find(s.BULK_SIDEBAR);
            this.$BULK_CARET = this.$el.find(s.BULK_CARET);
            this.$LAST_UPDATE_DATE = this.$el.find(s.LAST_UPDATE_DATE);
            this.$METADATA_BUTTON = this.$el.find(s.METADATA_BUTTON);
            this.$DOWNLOAD_INTERACTIVE_LINK = this.$el.find(s.DOWNLOAD_INTERACTIVE_LINK);
            this.$DESCRIPTION = this.$el.find(s.DESCRIPTION);
            this.$CONTACTS = this.$el.find(s.CONTACTS);
            this.$ORGANIZATION = this.$el.find(s.ORGANIZATION);
            this.$TREE_MODAL = this.$el.find(s.TREE_MODAL);

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

                        self.o.selected = $.extend(true, {}, callback, { type:  self.tree.getCodeType()});

                        if (self.o.selected.type === "domain") {

                           // self.$TREE_MODAL.modal('hide');
                            self.$TREE_MODAL.data('dismiss', "modal");

                            //self.updateSection();

                            self.changeState();

                        } else {

                            // expand collapse tree
                            log.info(self.o.selected);

                        }

                        amplify.publish(E.SCROLL_TO_SELECTOR, {
                            container: self.$MAIN_CONTAINER_TITLE
                        });

                        self.$TREE_CONTAINER.hide();

                    },

                    onTreeRendered: function (callback) {

                        self.o.selected = $.extend(true, {}, callback, { type:  self.tree.getCodeType()});

                        // TODO: this can be outside the tree rendering. It's missing hte label and the "node" type.
                        self.updateSection();

                    }

                }
            });

        },

        updateSection: function() {

            //this.o.selected = $.extend(true, {}, options);

            log.info("Download.updateSection", this.o.selected);

            this.switchTabs();

        },

        configurePage: function () {

        },

        switchTabs: function() {

            // getting section and options (selected)
            var section = this.o.section,
                options = this.o.selected;

            // destroy sections
            this.destroySections();

            moment.locale(Common.getLocale());

            log.info('switch tab: ', section, options);

            var code = options.id,
                label = options.label,
                type = options.type,
                date_sanitized = _s.strLeft(_s.replaceAll(options.date_update, '-', '/'), "."),
                date_update = moment(new Date(date_sanitized)).format("DD MMMM YYYY");

            // this sections should be always cleaned
            this.$OUTPUT_AREA.empty();

            if ( type === 'group') {
                this.switchTabsGroup(section, options);
            }

            if ( type === 'domain') {
                this.switchTabsDomain(section, options);
            }

            // Set Title
            this.$MAIN_CONTAINER_TITLE.html(label);

            // date update
            this._renderLastUpdate((type === 'domain')? date_update: null);

            // Set Related Documents
            // TODO: this in theory should change only when a domain/group is changed and not when a tab is switched.
            this._renderRelatedDocuments(code);

            this._renderBulkDownloadCaret(code);
            this._renderMetadata(code);

            // check tab availability
            this.checkSectionsAvailability(section, code);

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

                this._renderWelcomePage(code, label);

            }

            if (section === 'bulk') {

                this._renderBulkDownloadsGroups(code);

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

            if (section === 'browse_by_domain_code') {

                this._browseByDomain(options);

            }

        },

        _renderWelcomePage: function(code, label) {

            Require(['FAOSTAT_UI_WELCOME_PAGE'], _.bind(function(WelcomePage) {

                this.welcomePage = new WelcomePage();
                this.welcomePage.init({
                    container: this._createRandomElement(this.$ABOUT),
                    domain_code: code,
                    domain_name: label,
                    base_url: C.URL_FAOSTAT_DOCUMENTS_BASEPATH
                });

            }, this));

        },

        _renderBulkDownloadsGroups: function(code) {

            this.$BULK.empty();

            Require(['FAOSTAT_UI_BULK_DOWNLOADS'], _.bind(function(BulkDownloads) {

                this.bulkDownloads = new BulkDownloads();
                this.bulkDownloads.init({
                    container: this._createRandomElement(this.$BULK),
                    code: code,
                    bulk_downloads_root: C.URL_BULK_DOWNLOADS_BASEPATH
                });

            }, this));

        },

        createDomainsList: function(container, section, code, section_description) {

            Require(['lib/download/domains_list/domains-list'], _.bind(function(DomainsList) {

                this.domainsList = new DomainsList();
                this.domainsList.init({
                    container: this._createRandomElement($(container)),
                    section: section,
                    code: code,
                    section_description: section_description
                });

            }, this));

        },

        switchTabsDomain: function(section, options) {

            moment.locale(Common.getLocale());

            var code = options.id,
                date_sanitized = _s.strLeft(_s.replaceAll(options.date_update, '-', '/'), "."),
                label = options.label,
                date_update = moment(new Date(date_sanitized)).format("DD MMMM YYYY"),
                type = options.type;

            // TODO destroy old bulkthis._createRandomElement(this.$ABOUT),
            if (section === 'bulk') {

                this._renderBulkDownloads(code);

            }

            if (section === 'interactive') {

                this._renderInteractiveDownload(code);

            }

            if (section === 'report') {

                this._renderReport(code);

            }

            // TODO: the metadataViewer should be the only entry point to get Metadata Informations
            if (section === 'metadata') {

                this._renderMetadataViewer(code);

            }

            if (section === 'about') {

                this._renderWelcomePage(code, label);

            }

            // TODO: move to a common function
            if( section === 'browse_by_domain_code') {

                this._browseByDomain(options);

            }

        },

        _renderInteractiveDownload: function(code) {

            amplify.publish(E.LOADING_SHOW, {container: this.$INTERACTIVE_DOWNLOAD});

            this.$INTERACTIVE_DOWNLOAD.empty();

            Require(['fs-i-d/start'], _.bind(function(InteractiveDownload) {

                log.info(this)
                log.info(InteractiveDownload)
                this.interactiveDownload = new InteractiveDownload();
                this.interactiveDownload.init({
                    container: this._createRandomElement(this.$INTERACTIVE_DOWNLOAD),
                    // to output the table outside the standard output area
                    output_area: this.$OUTPUT_AREA,
                    code: code
                });

            }, this));

        },

        _renderBulkDownloads: function(code) {

            this.$BULK.empty();

            Require(['FAOSTAT_UI_BULK_DOWNLOADS'], _.bind(function(BulkDownloads) {

                this.bulkDownloads = new BulkDownloads();
                this.bulkDownloads.init({
                    container: this._createRandomElement(this.$BULK),
                    code: code,
                    bulk_downloads_root: C.URL_BULK_DOWNLOADS_BASEPATH
                });

            }, this));

        },

        _renderReport: function(code) {

            this.$REPORT.empty();

            Require(['fs-r-p/start'], _.bind(function(Report) {

                // TODO: check on tabs APIs
                if (code === 'FBS') {

                    this.report = new Report();
                    this.report.init({
                        container: this._createRandomElement(this.$REPORT),
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

            }, this));

        },

        _renderMetadataViewer: function(code) {

            // adding loading
            this.$METADATA.empty();

            amplify.publish(E.LOADING_SHOW, {container: this.$METADATA});

            Require(['fs-m-v/start'], _.bind(function(MetadataViewer) {

                this.metadataViewer = new MetadataViewer({
                    container: this._createRandomElement(this.$METADATA),
                    code: code,
                    lang: Common.getLocale()
                });
                this.metadataViewer.render();

            }, this));

        },

        _browseByDomain: function(options) {

            this.$BROWSE.empty();

            // TODO: probably should be avoided
           amplify.publish(E.LOADING_SHOW, {
               container: this.$BROWSE
           });

           Require(['views/browse-by-domain-view'], _.bind(function(DomainView) {

                var browseOptions = {};
                browseOptions.code = options.id;
                browseOptions.lang = this.o.lang;

                // TODO: section shouldn't be need
                browseOptions.section = ROUTE.BROWSE_BY_DOMAIN_CODE; //ROUTE.BROWSE_BY_DOMAIN_CODE;

                log.info("Download._browseByDomain; options:", browseOptions);

                // {region: "main", section: "browse_by_domain", lang: "en", code: "P"}

                log.info("Download._browseByDomain; browseOptions:", browseOptions);

                // init browse by domain
                this.viewDomain = new DomainView(browseOptions);


                var $S = this._createRandomElement(this.$BROWSE);
                $S.html(this.viewDomain.$el);

            }, this));


        },

        changeState: function(options) {

            var section = (options && options.hasOwnProperty('section'))? options.section: this.o.section,
                id = (options && options.hasOwnProperty('id'))? options.id: this.o.selected.id,
                force = (options && options.hasOwnProperty('force'))? options.force: false;

            log.info('ChangeState: ', section, id, force);

            Common.changeURL(section, [id], force);

        },

        bindEventListeners: function () {

            var self = this;

            // bind tabs listeners
            this.$el.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

                self.o.section = $(e.target).data("section"); // activated tab

                //self.switchTabs(self.o.section, self.o.selected);

                self.changeState();

            });

            this.$MENU_TREE.on('click', function() {

                self.$TREE_CONTAINER.toggle({
                    direction: 'left'
                }, 500);
                
            });

            this.$TREE_CLOSE.on('click', function() {
                self.$TREE_CONTAINER.hide({
                    direction: 'left'
                }, 500);
            });

            this.$METADATA_BUTTON.on('click', function() {

                if (self.o.hasOwnProperty("selected")) {
                    // TODO: this.o.section should be always updated
                    amplify.publish(E.METADATA_SHOW, {
                        code: self.o.selected.id
                    });
                }
                else {
                    log.error("Download.MetadataButton; this.o.selected.code doesn't exists", self.o);
                }

            });

            this.$DOWNLOAD_INTERACTIVE_LINK.on('click', function() {

                // TODO: replace it with an anchor
                self.$el.find('[data-section="interactive"]').tab('show');

/*                if (self.o.hasOwnProperty("selected")) {
                    Common.changeURL(ROUTE.DOWNLOAD_INTERACTIVE, [self.o.selected.id], true);
                }
                else {
                    log.error("Download.DownloadInteractiveLink; this.o.selected.code doesn't exists", self.o);
                }*/

            });
        },

        unbindEventListeners: function () {

            // unbind tabs listeners
            this.$el.find('a[data-toggle="tab"]').off('shown.bs.tab');

            if (this.$MENU_TREE) {
                this.$MENU_TREE.off('click');
            }
            if (this.$TREE_CLOSE) {
                this.$TREE_CLOSE.off('click');
            }

        },

        _renderBulkDownloadsSidebar: function(code) {

            this.$BULK_SIDEBAR.empty();

            var bulkDownloads = new BulkDownloads();
            bulkDownloads.init({
                container: this._createRandomElement(this.$BULK_SIDEBAR),
                code: code,
                bulk_downloads_root: C.URL_BULK_DOWNLOADS_BASEPATH,
                show_header: false
            });

        },

        // TODO: remove it from here
        _renderBulkDownloadCaret: function(code) {

            var self = this;

            this.$BULK_CARET.empty();

            // TODO: this should be in a common functionality?
            /* Fetch available bulk downloads. */
            this.api.bulkdownloads({
                datasource: C.DATASOURCE,
                lang: this.o.lang,
                domain_code: code
            }).then(function (json) {

                var data = json.data,
                    // TODO: load it with an external template
                    template = "{{#each data}}<li><a target='_blank'  data-filename='{{this.FileName}}' href='{{this.url}}'>{{this.FileContent}}</a></li>{{/each}}",
                    t = Handlebars.compile(template);

                if(data.length > 0) {

                    _.each(data, function(d) {

                        d.url = C.URL_BULK_DOWNLOADS_BASEPATH + d.FileName;
                        d.FileContent = _s.capitalize(_s.replaceAll(d.FileContent, '_', ' '));

                    });

                    self.$BULK_CARET.html(t({data: data}));

                }else {
                    self.$BULK_CARET.html('<li><a>'+ i18nLabels.no_data_available +'</a></li>');
                }

                // track on click google analytics
                self.$BULK_CARET.find('a').on('click',function(e) {
                    
                    amplify.publish(E.GOOGLE_ANALYTICS_EVENT, {
                        category: A.download_bulk.download.category,
                        action: A.download_bulk.download.action,
                        label: $(e.target).data('filename')
                    });

                });

            });
            
        },

        _renderLastUpdate: function(date_update) {

            if (date_update) {
                this.$LAST_UPDATE_DATE.find('[data-role="date"]').html(date_update);
                this.$LAST_UPDATE_DATE.show();
            } else {
                this.$LAST_UPDATE_DATE.hide();
            }

        },

        _renderRelatedDocuments: function(code) {

           this.$RELATED_DOCUMENTS.empty();

           var related_documents = new RelatedDocuments();

           related_documents.render({
                container: this.$RELATED_DOCUMENTS,
                code: code
           });

        },

        _renderMetadata: function(code) {

            this._renderDescription(code);
            this._renderContacts(code);
            this._renderOrganization(code);

        },

        _renderDescription: function(code) {

            Require(['fs-m-v/start'], _.bind(function(MetadataViewer) {

                var self = this,
                // TODO: in theory should not be reinstantiated, but should check the state of the object
                    m = new MetadataViewer({
                        code: code,
                        lang: this.o.lang
                    }),
                    $container = this.$DESCRIPTION.find('[data-role="text"]');

                $container.empty();
                $container = self._createRandomElement($container);

                m.getDescription().then(function(m) {

                    var text = m !== undefined? m.text: i18nLabels.no_data_available;

                    new TextWrapper().render({
                        container: $container,
                        text: text,
                        length: 150
                    });


                }).fail(function(e) {
                    log.error("Download._renderDescription; error:", e);
                });


            }, this));

        },

        _renderOrganization: function(code) {

            Require(['fs-m-v/start'], _.bind(function(MetadataViewer) {

                var self = this,
                    // TODO: in theory should not be reinstantiated, but should check the state of the object
                    m = new MetadataViewer({
                        code: code,
                        lang: this.o.lang
                    }),
                    $container = this.$ORGANIZATION.find('[data-role="text"]');

                $container.empty();
                $container = self._createRandomElement($container);

                m.getOrganization().then(function(m) {

                    if (m !== undefined) {
                        $container.html(m.text);
                    }

                }).fail(function(e) {
                    log.error("Download._renderOrganization; error:", e);
                });

            }, this));

        },

        _renderContacts: function(code) {

            Require(['fs-m-v/start'], _.bind(function(MetadataViewer) {

                var self = this,
                    // TODO: in theory should not be reinstantiated, but should check the state of the object
                    m = new MetadataViewer({
                        code: code,
                        lang: this.o.lang
                    }),
                    $container = this.$CONTACTS.find('[data-role="text"]');

                $container.empty();
                $container = self._createRandomElement($container);

                m.getContacts().then(function(m) {

                    var text = m !== undefined? m.text: i18nLabels.no_data_available;

                    new TextWrapper().render({
                        container: $container,
                        text: text,
                        length: 250
                    });

                }).fail(function(e) {
                    log.error("Download._renderContacts; error:", e);
                });

            }, this));
        },

        _createRandomElement: function($CONTAINER, empty) {

            var empty = (empty && typeof(empty) === "boolean")? empty : true,
                id = Math.random().toString().replace(".", "");

            if(empty) {
                $CONTAINER.empty();
            }

            $CONTAINER.append("<div id='"+ id +"'>");

            return $CONTAINER.find('#' + id);

        },

        destroySections: function() {

            log.info("-------Download.dispose; viewDomain", this.viewDomain);
            if (this.viewDomain && _.isFunction(this.viewDomain.dispose)) {
                this.viewDomain.dispose();
                delete this.viewDomain;
            }

            log.info("-------Download.dispose; report", this.report);
            if (this.report && _.isFunction(this.report.destroy)) {
                this.report.destroy();
                delete this.report;
            }

            log.info("-------Download.dispose; metadataViewer", this.metadataViewer);
            if (this.metadataViewer && _.isFunction(this.metadataViewer.destroy)) {
                this.metadataViewer.destroy();
                delete this.metadataViewer;
            }

            log.info("------Download.dispose; interactiveDownload", this.interactiveDownload);
            if (this.interactiveDownload && _.isFunction(this.interactiveDownload.destroy)) {
                this.interactiveDownload.destroy();
                delete this.interactiveDownload;
            }

        },

        dispose: function () {

            // dirty fix on modal
            // TODO: fix modal on close
            this.$TREE_MODAL.modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();

            this.destroySections();

            this.unbindEventListeners();

            this.$el.empty();

            View.prototype.dispose.call(this, arguments);

        }

    });

    return DownloadView;

});
