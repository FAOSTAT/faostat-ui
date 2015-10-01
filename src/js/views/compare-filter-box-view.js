/*global define, _:false, $, console, amplify, FM*/
define([
    'views/base/view',
    'globals/Common',
    'config/FAOSTAT',
    'config/Config',
    'config/Events',
    'config/EventsCompare',
    'config/compare/Config',
    'text!templates/compare/compare_filter_box.hbs',
    //'text!templates/compare/dropdown.hbs',
    'i18n!nls/compare',
    'handlebars',
    'faostatapiclient',
    'underscore',
    'views/compare-filter-view-backup',
    'lib/compare/compare-filter',
    'amplify'
], function (View, Common, F, C, E, EC, CC, template, i18nLabels, Handlebars, FAOSTATAPIClient, _, FilterView, Filter) {

    'use strict';

    var s = {

        GROUPS: '[data-role="groups"]',
        DOMAINS: '[data-role="domains"]',
        FILTERS: '[data-role="filters"]',
        REMOVE_FILTER_BOX: '[data-role="remove_filter_box"]'

    };

    var filters = {};
    var groups = {};
    var domains = {};

    // list of the dimensions by code
    var dimensions = {

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

            console.log(json);

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

            console.log(json);

           var filter = new Filter({
                container: this.$DOMAINS,
                title: i18nLabels.domains,
                data: json
            });

            console.log(filter);

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
            // get the domains list
            console.log(code);
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
                console.log(v);
                domains.push({
                        code: v.DomainCode,
                        label: v.DomainNameE,
                    }
                );
            });
            console.log(domains);
            return domains;
        },

        createFilters: function() {

            // parse the dimensions to create dinamically the dropdowns needed

        },

        getFilters: function () {
            // TODO: get all the filters mapping
        },

        removeFilterBox: function() {
            console.warn("TODO: dispose of the box and the filters");

            amplify.publish(EC.FILTER_BOX_REMOVE, {filter: this});
            this.$el.empty();
        },

        bindEventListeners: function () {

            //amplify.publish(E.STATE_CHANGE, {compare: 'compare'});
            console.log(this);
            this.$REMOVE_FILTER_BOX.on('click', this.removeFilterBox, this);
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
