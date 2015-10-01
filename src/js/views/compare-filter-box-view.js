/*global define, _:false, $, console, amplify, FM*/
define([
    'views/base/view',
    'globals/Common',
    'config/FAOSTAT',
    'config/Config',
    'config/Events',
    'config/compare/Config',
    'text!templates/compare/compare_selector.hbs',
    //'text!templates/compare/dropdown.hbs',
    'i18n!nls/compare',
    'handlebars',
    'faostatapiclient',
    'underscore',
    'compare-filter-view-backup',
    'lib/compare-filter',
    'amplify'
], function (View, Common, F, C, E, CC, template, i18nLabels, Handlebars, FAOSTATAPIClient, _, FilterView, Filter) {

    'use strict';

    var s = {

        GROUPS: '[data-role="groups"]',
        DOMAINS: '[data-role="domains"]',
        FILTERS: '[data-role="filters"]'

    };

    var filters = {};

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

        },

        initComponents: function () {

        },

        configurePage: function () {

            this.FAOSTATAPIClient.groupsanddomains({
                lang: this.o.lang
            }).then(_.bind(function(json) {

                console.log(json);

                this.groups = this.filterGroups(json.data);
                console.log(this.groups);
/*                this.groupsView = new FilterView({
                    data: this.groups
                });*/

                this.groupsView = new Filter({
                    data: this.groups
                });

                //this.filters = new FiltersView();
                this.$FILTERS_CONTAINER.html(this.filters.$el);

                console.log("wejr");
                console.log(this.groupsView);

                console.log(this.groupsView);

                this.$GROUPS.html(this.groupsView.$el);

               // this.initGroups();
            }, this));
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

        filterDomains: function(data) {
            var groups = [];
            for (var i = 0, i = data.length; i < len; i++) {

            }
        },

        initGroups: function(groups) {

            this.FAOSTATAPIClient.groups({
                lang: this.o.lang,
                blacklist: CC.groups.blacklist
            }).then(_.bind(function(data) {

                console.log(this);

                console.log(data);

                var template, dynamic_data, html;
                /* Load main structure. */
                template = Handlebars.compile(templateDropDown);
                html = template(data);

                this.$GROUPS.html(html);

                // TODO: get the first group
                this.initDomains('Q');

            }, this));

        },


        // filters
        initGroupsBK: function() {

            this.FAOSTATAPIClient.groups({
                lang: this.o.lang,
                blacklist: CC.groups.blacklist
            }).then(_.bind(function(data) {

                console.log(this);

                console.log(data);

                var template, dynamic_data, html;

                /* Load main structure. */
                template = Handlebars.compile(templateDropDown);
                html = template(data);

                this.$GROUPS.html(html);

                // TODO: get the first group
                this.initDomains('Q');

            }, this));

        },

        initDomainsBK: function(code) {

            this.FAOSTATAPIClient.domains({
                lang: this.o.lang,
                blacklist: CC.domains.blacklist
            }).then(function(data) {

                console.log(data);

                var template, dynamic_data, html;

                /* Load main structure. */
                template = Handlebars.compile(templateDropDown);
                html = template(data);

                this.$GROUPS.html(html);

            });
            //_.bind(this.test, this));

            this.$DOMAINS.html(html);

        },

        test: function(data) {



        },

        initFilters: function() {

            // parse the dimensions to create dinamically the dropdowns needed


        },

        getFilters: function () {
            // TODO: get all the filters mapping
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

    return CompareFiltersBoxView;
});
