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
        REMOVE_FILTER_BOX: '[data-role="remove_filter_box"]'

    };

    var groups = {};
    var domains = {};

    // list of the dimensions
    var filters = {

    };

    var CompareFiltersBoxView = View.extend({

        autoRender: true,

        className: 'compare',

        template: template,

        initialize: function (options) {
            this.o = options || {};
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish(E.STATE_CHANGE, {compare: 'compare'});

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

        },

        initComponents: function () {

        },

        configurePage: function () {
            var self = this;

            this.FAOSTATAPIClient.groupsanddomains({
                lang: this.o.lang
            }).then(function(json) {

                // caching goups and domains
                self.GROUPS_AND_DOMAINS = json;

                // create goups filter
                self.createGroupFilter(self.GROUPS_AND_DOMAINS);
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
            groups = {
                filter: filter,
                // TODO: keep track of the filter
                json: json
            };

            groups.$DD = filter.getDropDown();
            groups.$DD.change(function(e) {
                self.onGroupChange(e.val);
            });
        },

        createDomainFilter: function(json) {
            var self = this;
            var filter = new Filter({
                container: this.$DOMAINS,
                title: i18nLabels.domains,
                data: json
            });

            // cache groups dropdown
            domains = {
                filter: filter,
                // TODO: keep track of the filter
                json: json
            };

            domains.$DD = filter.getDropDown();
            domains.$DD.change(function(e) {
                self.onDomainChange(e.val);
            });
        },

        onGroupChange: function(code) {
            var json = this.GROUPS_AND_DOMAINS;

            // TODO: dispose domains and filters container

            // get the domains list
            var domains = this.filterDomains(json.data, code);

            // create domains filters
            this.createDomainFilter(domains);

        },

        onDomainChange: function(code) {
            this.domainCode = code;

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

        filterDomains: function(data, groupCode) {
            var domains = [],
                codes = _.where(data, {code: groupCode});

            // TODO: add blacklist
            _.forEach(codes, function(v) {
                // TODO: mkae it multilanguage and dinnamic
                domains.push({
                        code: v.DomainCode,
                        label: v.DomainNameE,
                    }
                );
            });
            return domains;
        },

        // Filters by domains
        createFiltersByDomain: function() {

            // remove filters (dispose)
            this.$FILTERS.empty();

            // clean old filters
            filters = {};

            // parse the dimensions to create dinamically the dropdowns needed
            this.FAOSTATAPIClient.dimensions({
                lang: this.o.lang,
                domain_code: this.domainCode
            }).then(_.bind(this._preloadDomainDimensions, this))
                .then(_.bind(function(json) {
                    console.log(json);
                    _.each(json, _.bind(function(v, a) {

                        try {
                            console.log(v);

                            var id = v.metadata.parameters.id;

                            // TODO: to be changed
                            v.container = this.createFilterContainer(id);

                            // TODO: get label from metadata
                            v.title = i18nLabels[id];
                            v.ddOptions = {
                                multiple: true,
                                addEmptySelection: true,
                                placeholder: "SELECT a",
                                allowClear: true
                            };


                            filters[id] = {};
                            filters[id].filter = new Filter(v);

                            console.log(filters);

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

            this.filtersCodeLists = {};

            // Q.all to return all the request at the same time
            _.each(json.data, _.bind(function (c) {

                var id = c.id;

                // add check on the blacklist
                if (CC.filters.blacklistCodesID.indexOf(id) <= -1) {

                   r.push(
                     self.FAOSTATAPIClient.codes({
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
            domain.parameter = '@List1Codes';
            // TODO: change domains variable name
            domain.codes = [domains.$DD.val()];
            f.push(domain);

            console.log(Object.keys(filters));

            // Get all the selected values from the filters multiselections dropdown
            try {
                _.each(Object.keys(filters), function (filterKey) {
                    console.log(filterKey);
                    console.log("daje");
                    f.push(filters[filterKey].filter.getFilter());
                    console.log("daje2");
                });
            }catch(e) {
                console.error(e);
            }


            console.log(f);

            return f;
        },

        removeFilterBox: function(e) {

            console.warn("TODO: dispose of the box and the filters");
            console.log(e);
            console.log(this);

            amplify.publish(EC.FILTER_BOX_REMOVE, {filter: this});
            this.$el.empty();

        },

        bindEventListeners: function () {

            //amplify.publish(E.STATE_CHANGE, {compare: 'compare'});
            this.$REMOVE_FILTER_BOX.on('click', _.bind(this.removeFilterBox, this));
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
