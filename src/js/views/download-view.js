/*global define, _:false, $, console, amplify, numeral*/
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
    'lib/related-documents/related-documents',
    'moment',
    'underscore.string',
    'handlebars',
    'faostatapiclient',
    'lib/common/text-wrapper',
    'lib/onboarding/onboarding',
    'numeral',
    'amplify'
], function (Require,
             $, log, View, A, C, E, Common, ROUTE,
             template, i18nLabels,
             Tree,
             RelatedDocuments,
             moment,
             _s,
             Handlebars,
             API,
             TextWrapper,
             OnBoarding
) {

    // TODO: N.B. Pay attention to the internals calls to: InteractiveDownload, DomainView, DomainsList, MetadataViewer

    'use strict';

    var s = {

            TREE: "#fs-download-domain-tree",
            SEARCH_TREE: "#fs-download-tree-search",
            OUTPUT_CONTAINER: "#fs-download-output-container",
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
            BULK_DOWNLOADS_PANEL: "[data-role='bulk-downloads-panel']",
            BULK_LIST: "[data-role='bulk-downloads-list']",

            // Tree
            TREE_CLOSE: '[data-role="fs-domains-tree-container-close"]',
            MODAL_DOMAINS_BUTTON: '[data-role="modal-domains-button"]',

            DESCRIPTION: '[data-role="description"]',
            CONTACTS: '[data-role="contact-name"]',
            BULK_SIDEBAR: '[data-role="fs-download-bulk-downloads-sidebar"]',
            LAST_UPDATE_DATE: '[data-role="last-update"]',
            ORGANIZATION: '[data-role="organization"]',

            TREE_MODAL: '#fs-data-tree-domain-modal',

            // Definitions and Standards
            DEFINITIONS_BUTTON: '[data-role="fs-download-definitions-button"]',

            // on boarding optional button
            //ONBOARDING: '[data-role="onboarding"]'
            ONBOARDING: '[data-role="help"]'

        },

        onBoarding = {

            download_data: {
                id: 'download_data',
                steps: [{
                        intro: "<h4>Bulk downloads</h4>or download quickly all the data contained in the domain",
                        element: s.BULK_DOWNLOADS_PANEL
                    },
                    {
                        intro: "<h4>Metadata</h4>If you want to know something more about the metadata",
                        element: s.METADATA_BUTTON
                    },
                    {
                        intro: "<h4>Definitions and standards</h4>or the definitions and standards used",
                        element: s.DEFINITIONS_BUTTON
                    },
                    {
                        intro: "<h4>Change Domain</h4>You can easy change the domain clicking on that button",
                        element: s.MODAL_DOMAINS_BUTTON
                    },
                    {
                        intro: "<h4>Change Domain</h4>or going back to the domains",
                        element: '[data-role="fs-menu-data"]'
                    },
/*                    {
                        intro: "<h4>Any doubt or suggestion?</h4>Drop us a line",
                        element: '[data-role="google-form"]',
                        position: 'left'
                    }*/
                    ]
                }

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

                this.options = $.extend(true, {}, options);

                // used to handle the current selection
                this.o.selected = {
                    id: this.o.code
                }

            },

            getTemplateData: function () {

                // TODO: add explicitaly the labels used in the page to avoid overhead
                return $.extend(true, {}, i18nLabels, {
                    url_data_section: '#' + Common.getURI(ROUTE.DATA)
                });

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

                // Title
                this.$MAIN_CONTAINER_TITLE = this.$el.find(s.MAIN_CONTAINER_TITLE);

                // Output container
                this.$OUTPUT_CONTAINER = this.$el.find(s.OUTPUT_CONTAINER);

                // Tabs sections
                this.$INTERACTIVE_DOWNLOAD = this.$el.find(s.INTERACTIVE_DOWNLOAD);
                this.$BROWSE = this.$el.find(s.BROWSE);
                this.$METADATA = this.$el.find(s.METADATA);
                this.$REPORT = this.$el.find(s.REPORT);

                // Sidebar
                this.$BULK_LIST = this.$el.find(s.BULK_LIST);
                this.$BULK_DOWNLOADS_PANEL = this.$el.find(s.BULK_DOWNLOADS_PANEL);
                this.$LAST_UPDATE_DATE = this.$el.find(s.LAST_UPDATE_DATE);
                this.$METADATA_BUTTON = this.$el.find(s.METADATA_BUTTON);
                this.$DEFINITIONS_BUTTON = this.$el.find(s.DEFINITIONS_BUTTON);
                this.$DESCRIPTION = this.$el.find(s.DESCRIPTION);
                this.$CONTACTS = this.$el.find(s.CONTACTS);
                this.$ORGANIZATION = this.$el.find(s.ORGANIZATION);
                this.$RELATED_DOCUMENTS = this.$el.find(s.RELATED_DOCUMENTS);
                //this.$ONBOARDING = this.$el.find(s.ONBOARDING);
                this.$ONBOARDING = $(s.ONBOARDING);


                // Domains tree modal
                this.$TREE_MODAL = this.$el.find(s.TREE_MODAL);
                this.$TREE = this.$el.find(s.TREE);
                this.$MODAL_DOMAINS_BUTTON = this.$el.find(s.MODAL_DOMAINS_BUTTON);
                this.$MODAL_DOMAINS_BUTTON.tooltip('destroy');
                this.$MODAL_DOMAINS_BUTTON.tooltip({
                    container: 'body'
                });

                // Select the current section
                this.$el.find('.nav-tabs [data-section=' + this.o.section + ']').tab('show');

            },

            initComponents: function () {

                this._initTree();

            },

            configurePage: function () {

            },

            updateSection: function() {

                log.info("Download.updateSection", this.o.selected);

                this.switchTabs();

            },

            _initTree: function() {

                var self = this;

                this.tree = new Tree();
                this.tree.init({
                    placeholder_id: this.$TREE,
                    placeholder_search: this.$el.find(s.SEARCH_TREE),
                    code: this.o.code,
                    callback: {

                        onClick: function (callback) {

                            // update the current selection
                            self.o.selected = $.extend(true, {}, callback, { type:  self.tree.getCodeType()});

                            if (self.o.selected.type === "domain") {

                                // once the animation is finished can be switched the routing
                                self.$TREE_MODAL.on('hidden.bs.modal', function() {
                                    self.changeState();
                                });

                                self.$TREE_MODAL.modal('hide');

                                // track analytics tree selection
                                amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                                    $.extend({},A.data_domain_specific_page.select_domain_in_tree, {
                                        label: self.o.selected.id
                                    })
                                );

                            } else {

                                // TODO: handle group selection

                            }

                        },

                        onTreeRendered: function (callback) {

                            // update the current selection
                            self.o.selected = $.extend(true, {}, callback, { type:  self.tree.getCodeType()});

                            // TODO: this can be outside the tree rendering. It's missing hte label and the "node" type.
                            self.updateSection();

                        }

                    }
                });

            },

            switchTabs: function() {

                // getting section and options (selected)
                var section = this.o.section,
                    options = this.o.selected;

                // destroy sections
                this.destroySections();

                var code = options.id,
                    label = options.label,
                    type = options.type,
                    date_sanitized = _s.strLeft(_s.replaceAll(options.date_update, '-', '/'), "."),
                    date_update = moment(new Date(date_sanitized)).format("LL");


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

                this._renderBulkDownloads(code);
                this._renderMetadata(code);

                // check tab availability
                this.checkSectionsAvailability(section, code);

            },

            checkSectionsAvailability: function(section, code) {

                // TODO: check show/hide tabs and if tab is available (use APIs)
                //log.info('DownloadView.checkSectionsAvailability;', section, code);

                // TODO: change with APIs
                if (code === 'FBS') {
                    this.$el.find('.nav-tabs [data-section="report"]').show();
                }else {
                    this.$el.find('.nav-tabs [data-section="report"]').hide();
                }

            },

            switchTabsDomain: function(section, options) {

                var code = options.id;

                if (section === 'interactive') {

                    this._renderInteractiveDownload();

                }

                if (section === 'report') {

                    this._renderReport();

                }

                // TODO: the metadataViewer should be the only entry point to get Metadata Informations
                if (section === 'metadata') {

                    this._renderMetadataViewer();

                }

                // TODO: move to a common function
                if( section === 'browse_by_domain_code') {

                    this._browseByDomain(options);

                }

            },

            _renderInteractiveDownload: function() {

                var code = this.o.selected.id;

                amplify.publish(E.LOADING_SHOW, {container: this.$INTERACTIVE_DOWNLOAD});

                this.$INTERACTIVE_DOWNLOAD.empty();

                Require(['fs-i-d/start'], _.bind(function(InteractiveDownload) {

                    this.interactiveDownload = new InteractiveDownload();
                    this.interactiveDownload.init({
                        container: this._createRandomElement(this.$INTERACTIVE_DOWNLOAD),
                        // to output the table outside the standard output area
                        //output_container:  this.$OUTPUT_CONTAINER,
                        code: code,
                        output: {
                            container: this.$OUTPUT_CONTAINER
                        }

                    });

                    this.$ONBOARDING.show();
                    this.$ONBOARDING.tooltip('destroy');
                    this.$ONBOARDING.tooltip({
                        container: 'body'
                    });
                    this.$ONBOARDING.find('[data-role="text"]').html("Help on download data?");
                    this.$ONBOARDING.on('click', _.bind(function(e) {

                        e.preventDefault();

                        var options = $.extend(onBoarding.download_data);
                        options.steps = _.union(this.interactiveDownload.getOnboardingSteps(), options.steps);

                        this._renderOnBoarding(options);

                    }, this));

                }, this));

            },

            _renderOnBoarding: function(options) {

                var force = true;

                if (this.onboarding === undefined) {
                    this.onboarding = new OnBoarding();
                    this.onboarding.setOptions(options);
                }

                this.onboarding.start(force);

            },

            _renderReport: function() {

                var code = this.o.selected.id;

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

            _renderMetadataViewer: function() {

                var code = this.o.selected.id;

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

                    var code = this.o.selected.id;
                    // TODO: section shouldn't be need

                    // init browse by domain
                    this.viewDomain = new DomainView({
                        code: code
                    });

                    // add view to an element in the browse section
                    this._createRandomElement(this.$BROWSE).html(this.viewDomain.$el);

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

                    self.changeState();

                });

                this.$METADATA_BUTTON.off();
                this.$METADATA_BUTTON.on('click', function() {

                    if (self.o.hasOwnProperty("selected")) {

                        // TODO: this.o.section should be always updated
                        amplify.publish(E.METADATA_SHOW, {
                            code: self.o.selected.id
                        });

                        // track analytics
                        amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                            $.extend({},A.data_domain_specific_page.selection_metadata, {
                                label: self.o.selected.id
                            })
                        );

                    }
                    else {
                        log.error("Download.MetadataButton; this.o.selected.code doesn't exists", self.o);
                    }

                });

                this.$DEFINITIONS_BUTTON.off();
                this.$DEFINITIONS_BUTTON.on('click', function() {

                    var domain_code =  self.o.selected.id,
                        label = self.o.selected.label;

                    if (self.o.hasOwnProperty("selected")) {

                        // TODO: this.o.section should be always updated
                        amplify.publish(E.DEFINITION_DOMAIN_SHOW, {
                            code: domain_code,
                            label: label
                        });

                        // track analytics
                        amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                            $.extend({},A.data_domain_specific_page.selection_definitions, {
                                label: domain_code
                            })
                        );

                    }
                    else {
                        log.error("Download.Definitions; this.o.selected.code doesn't exists", self.o);
                    }

                });

                this.$TREE_MODAL.off('show.bs.modal');
                this.$TREE_MODAL.on('show.bs.modal', function() {
                    // track analytics tree modal opens
                    amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                        $.extend({},A.data_domain_specific_page.open_domain_tree, {
                            label: self.o.selected.id
                        })
                    );
                });

                this.$MODAL_DOMAINS_BUTTON.on('click', function() {
                    self.$MODAL_DOMAINS_BUTTON.tooltip('hide');
                });

            },

            unbindEventListeners: function () {

                // unbind tabs listeners
                this.$el.find('a[data-toggle="tab"]').off('shown.bs.tab');

                if (this.$METADATA_BUTTON) {
                    this.$METADATA_BUTTON.off();
                }

                if (this.$DEFINITIONS_BUTTON) {
                    this.$DEFINITIONS_BUTTON.off();
                }

                if (this.$TREE_MODAL) {
                    this.$TREE_MODAL.off('show.bs.modal');
                }

                if (this.$ONBOARDING) {
                    this.$ONBOARDING.off();
                }

            },

            // TODO: refactor/move to a common lib folder to be reusable (if needed)
            _renderBulkDownloads: function(code) {

                var self = this;

                this.$BULK_LIST.empty();

                // TODO: this should be in a common functionality?
                /* Fetch available bulk downloads. */
                API.bulkdownloads({
                    domain_code: code
                }).then(function (d) {

                    //log.info("DownloadView._renderBulkDownloadCaret;", d);

                    var data = d.data,
                        // TODO: load it with an external template
                        template = "{{#each data}}<li class='clearfix'>" +
                            "<a target='_blank' data-filename='{{this.FileName}}' href='{{this.URL}}'>{{this.FileContent}}</a>" +
                            "<small class='pull-right'>{{this.Size}}</small>" +
                            "</li>{{/each}}",
                        t = Handlebars.compile(template);

                    // TODO: refactor the code
                    if(data.length > 0) {

                        _.each(data, function(d) {

                            d.FileContent = _s.capitalize(_s.replaceAll(d.FileContent, '_', ' '));

                            var thousand =',';
                            var decimal ='.';
                            var decimal_places = 2;
                            var value = parseFloat(d.FileSize);
                            var unit = "KB";

                            if ( value > 1000) {
                                value = value * 0.001;
                                unit = "MB";
                            }

                            numeral.language('bulk_downloads', {
                                delimiters: {
                                    thousands: thousand,
                                    decimal: decimal
                                }
                            });
                            var formatter = '0' + thousand + '0' + decimal;
                            formatter += '[';
                            for (var i = 0; i < decimal_places; i += 1) {
                                formatter += '0';
                            }
                            formatter += ']';

                            numeral.language('bulk_downloads');
                            d.Size = numeral(value).format(formatter) + " " + unit;

                        });

                        self.$BULK_LIST.html(t({data: data}));

                    }else {
                        self.$BULK_LIST.html('<li><a>-</a></li>');
                    }

                    // track on click google analytics
                    self.$BULK_LIST.find('a').on('click',function(e) {

                        amplify.publish(E.GOOGLE_ANALYTICS_EVENT, {
                            category: A.download_bulk.download.category,
                            action: A.download_bulk.download.action,
                            label: $(this).data('filename')
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

                        var text = m !== undefined? m.text: '-'; //i18nLabels.no_data_available;

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

                        var text = m !== undefined? m.text: '-'; //i18nLabels.no_data_available;

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

                var empty = (empty !== undefined && typeof(empty) === "boolean")? empty : true,
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

                log.info("-------Download.dispose; interactiveDownload", this.interactiveDownload);
                if (this.interactiveDownload && _.isFunction(this.interactiveDownload.destroy)) {
                    this.interactiveDownload.destroy();
                    delete this.interactiveDownload;
                }

            },

            dispose: function () {

                // dirty fix on modal
                // TODO: fix modal on close
                if (this.$TREE_MODAL) {
                    this.$TREE_MODAL.remove();
                }

                if (this.$ONBOARDING) {
                    this.$ONBOARDING.tooltip('destroy');
                    this.$ONBOARDING.hide();
                }

                this.destroySections();

                this.unbindEventListeners();

                this.$el.empty();

                View.prototype.dispose.call(this, arguments);

            }

        });

    return DownloadView;

});
