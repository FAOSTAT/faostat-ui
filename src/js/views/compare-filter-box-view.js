/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'views/base/view',
    'globals/Common',
    'config/FAOSTAT',
    'config/Config',
    'config/Events',
    'config/EventsCompare',
    'config/compare/Config',
    'text!templates/compare/compare_filter_box.hbs',
    'text!templates/compare/filter_container.hbs',
    //'text!templates/compare/dropdown.hbs',
    'i18n!nls/compare',
    'handlebars',
    'faostatapiclient',
    'underscore',
    //'views/compare-filter-view-backup',
    'lib/compare/compare-filter',
    'q',
    'amplify',
], function ($, View, Common, F, C, E, EC, CC, template, templateFilterContainer, i18nLabels, Handlebars, FAOSTATAPIClient, _, Filter, Q) {

    'use strict';

    var s = {

        GROUPS: '[data-role="groups"]',
        DOMAINS: '[data-role="domains"]',
        FILTERS: '[data-role="filters"]',
        REMOVE_FILTER_BOX: '[data-role="remove_filter_box"]',
        COLLAPSE_FILTER_BOX: '[data-role="collapse_filter_box"]',
        PANEL_BODY: '[data-role="panel_body_filter_box"]',
        GROUP_HEADING_TITLE: '[data-role="group-heading-title"]',
        DOMAIN_HEADING_TITLE: '[data-role="domain-heading-title"]'

    };

    // TODO: cache of the dimensions paramenter (a the moment the i.e. /codes/areagroup don't return the paramenter)

    var CompareFiltersBoxView = View.extend({

        autoRender: true,

        className: 'compare',

        template: template,


        initialize: function (options) {
            this.o = options || {};

            this.o.groups = {};
            this.o.domains = {};

            // list of the dimensions
            this.o.filters=  {

            };

            this.DIMENSION_PARAMETER_MAPPING = {};
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this.initVariables();

            this.initComponents();

            this.bindEventListeners();

            this.configurePage();
        },

        initVariables: function () {

            // init lang
            this.o.lang = Common.getLocale();

            this.FAOSTATAPIClient = new FAOSTATAPIClient();

            this.$GROUPS = this.$el.find(s.GROUPS);
            this.$DOMAINS = this.$el.find(s.DOMAINS);
            this.$FILTERS = this.$el.find(s.FILTERS);
            this.$REMOVE_FILTER_BOX = this.$el.find(s.REMOVE_FILTER_BOX);
            this.$COLLAPSE_FILTER_BOX = this.$el.find(s.COLLAPSE_FILTER_BOX);
            this.$PANEL_BODY = this.$el.find(s.PANEL_BODY);
            this.$GROUP_HEADING_TITLE = this.$el.find(s.GROUP_HEADING_TITLE);
            this.$DOMAIN_HEADING_TITLE = this.$el.find(s.DOMAIN_HEADING_TITLE);

        },

        initComponents: function () {

        },

        configurePage: function () {
            var self = this;

            console.log(CC.groups.blacklist);

            this.FAOSTATAPIClient.groups({
                datasource: C.DATASOURCE,
                lang: this.o.lang,
                whitelist: CC.groups.whitelist || [],
                blacklist: CC.groups.blacklist || []
            }).then(function(json) {
                self.createGroupFilter(json);
            });

        },

        createGroupFilter: function(json) {
            var self = this;

            var groupsData = this.filterGroups(json.data);
            var filter = new Filter({
                container: this.$GROUPS,
                title: i18nLabels.groups,
                data: groupsData
            });

            // cache groups dropdown
            this.o.groups = {
                filter: filter,
                // TODO: keep track of the filter
                json: json
            };

            this.o.groups.$DD = filter.getDropDown();

            // TODO: make it nicer the default code selection
            self.onGroupChange(this.o.groups.$DD.find(":selected").val(), this.o.groups.$DD.find(":selected").text());

            this.o.groups.$DD.change(function(e) {
                self.onGroupChange(e.val, e.added.text);
            });
        },

        createDomainFilter: function(json) {
            var self = this;

            var filter = new Filter({
                container: this.$DOMAINS,
                title: i18nLabels.domains,
                data: json.data
            });

            // cache groups dropdown
            this.o.domains = {
                filter: filter,
                // TODO: keep track of the filter
                json: json
            };

            this.o.domains.$DD = filter.getDropDown();

            // TODO: make it nicer the default code selection
            self.onDomainChange(this.o.domains.$DD.find(":selected").val(), this.o.domains.$DD.find(":selected").text());

            this.o.domains.$DD.change(function(e) {
                self.onDomainChange(e.val, e.added.text);
            });
        },

        onGroupChange: function(code, label) {

            var self = this;

            // TODO: dispose domains and filters container

            this.$GROUP_HEADING_TITLE.html(label);

            this.FAOSTATAPIClient.domains({
                group_code: code,
                datasource: C.DATASOURCE,
                lang: this.o.lang,
                whitelist: CC.domains.whitelist || [],
                blacklist: CC.domains.blacklist || []
            }).then(function(json) {
                self.createDomainFilter(json);
            });

        },

        onDomainChange: function(code, label) {

            this.domainCode = code;

            this.$DOMAIN_HEADING_TITLE.html(label);

            // get dimensions and create new filters
            this.createFiltersByDomain();

        },

        filterGroups: function(data) {
            var filter = {};
            var groups = [];
            for (var i = 0; i < data.length -1; i++) {
                filter[data[i].code] = data[i].label;
            }

            _.forEach(filter, function(label, code) {
                groups.push({
                        code: code,
                        label: label
                    }
                );
            });

            return groups;
        },

        // Filters by domains
        createFiltersByDomain: function() {

            // remove filters (dispose)
            this.$FILTERS.empty();

            // clean old filters
            this.o.filters = {};

            // parse the dimensions to create dinamically the dropdowns needed
            this.FAOSTATAPIClient.dimensions({
                datasource: C.DATASOURCE,
                lang: this.o.lang,
                domain_code: this.domainCode
            }).then(_.bind(this._preloadDomainDimensions, this))
                .then(_.bind(function(json) {

                    _.each(json, _.bind(function(v) {

                        try {

                            var id = v.metadata.parameters.id;

                            // TODO: to be changed
                            v.container = this.createFilterContainer(id);

                            // TODO: get label from metadata
                            v.title = i18nLabels[id] || id;
                            v.parameter = this.DIMENSION_PARAMETER_MAPPING[id];

                            v.ddOptions = {
                                multiple: true,
                                addEmptySelection: true,
                                //placeholder: "SELECT a",
                                allowClear: true
                            };


                            this.o.filters[id] = {};
                            this.o.filters[id].filter = new Filter(v);

                        }catch(e) {
                            console.error(e);
                        }

                    }, this));
            }, this));

        },

        _preloadDomainDimensions: function (json) {

            var r = [],
                domainCode = this.domainCode,
                lang = this.o.lang,
                self = this;

            // TODO: cache of the dimensions paramenter (a the moment the i.e. /codes/areagroup don't return the paramenter)
            this.DIMENSION_PARAMETER_MAPPING = {};

            // Q.all to return all the request at the same time
            _.each(json.data, _.bind(function (c) {

                var id = c.id;

                // caching the parameter to use with the getData
                this.DIMENSION_PARAMETER_MAPPING[id] = c.parameter;

                // add check on the blacklist
                if (CC.filters.blacklistCodesID.indexOf(id) <= -1) {

                   r.push(
                     self.FAOSTATAPIClient.codes({
                            datasource: C.DATASOURCE,
                            id: id,
                            lang: lang,
                            domain_code: domainCode,
                            domains: domainCode,
                            whitelist: [],
                            blacklist: [],
                            subcodelists: null,
                            show_lists: null,
                            show_full_metadata: null,
                            ord: null
                        })
                   );
                }
                else {
                    // TODO: check how to handle i.e. the year that is crop selectors
                    console.warn("TODO: check how to handle i.e. the year that is crop selectors");
                }

            }, this));

            return Q.all(r);

        },

        createFilterContainer: function (id) {

            var template = Handlebars.compile(templateFilterContainer);
            this.$FILTERS.append(template({id: id}));
            return this.$FILTERS.find('[data-role="filter-'+ id +'"]');

        },


        getFilters: function () {

            // filters to be returned to the compare-view

            var f = [];
            // TODO: get all the filters mapping
            // for all the filters get
            // the id
            // i.e. metadata.parameters.parameter: "@List1Codes",
            // with the relative values
            // to pass to the getData

            // TODO: how to handle the domain?
            var domain = {};

            domain.id = 'domain';
            // TODO: the parameter in theory should be dynamic
            domain.parameter = 'domain_code';
            // TODO: change domains variable name
            domain.codes = this.o.domains.$DD.val();
            f.push(domain);

            // Get all the selected values from the filters multiselections dropdown
            _.each(Object.keys(this.o.filters), _.bind(function (filterKey) {
                f.push(this.o.filters[filterKey].filter.getFilter());
            }, this));

            console.log(f);

            return f;
        },

        removeFilterBox: function(e) {

            console.warn("TODO: dispose of the box and the filters");
            // TODO: onRemove the filter add popup to check if the user want to remove it?
            //amplify.publish(E.NOTIFICATION_ACCEPT, {filter: this});
            amplify.publish(EC.FILTER_BOX_REMOVE, {filter: this});
        },

        collapseFilterBox: function(e) {
            var self = this;

            this.$PANEL_BODY.toggle("fast", function() {
                self.$COLLAPSE_FILTER_BOX.removeClass("fa-chevron-up");
                self.$COLLAPSE_FILTER_BOX.removeClass("fa-chevron-down");
                if ( self.$PANEL_BODY.is(":visible")) {
                    self.$COLLAPSE_FILTER_BOX.addClass("fa-chevron-down");
                } else {
                    self.$COLLAPSE_FILTER_BOX.addClass("fa-chevron-up");
                }
            });

        },

        bindEventListeners: function () {
            this.$REMOVE_FILTER_BOX.on('click', _.bind(this.removeFilterBox, this));
            this.$COLLAPSE_FILTER_BOX.on('click', _.bind(this.collapseFilterBox, this));
        },

        unbindEventListeners: function () {


        },

        disposeDomains: function () {
            console.warn('TODO dispose domains');
            this.$DOMAINS.empty();
        },

        disposeFilters: function () {
            console.warn('TODO dispose filters');
        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return CompareFiltersBoxView;
});
