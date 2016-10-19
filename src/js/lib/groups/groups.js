/*global define, _:false, $, amplify, FM */
define([
    'jquery',
    'loglevel',
    'globals/Common',
    'config/Config',
    'config/Events',
    'config/Analytics',
    'config/Routes',
    'i18n!nls/download',
    'text!lib/groups/templates/templates.hbs',
    'handlebars',
    'faostatapiclient',
    'underscore',
    'lib/onboarding/onboarding',
    'amplify',
    'instafilta'
], function ($, log, Common, C, E, A, ROUTES, i18nLabels, templates, Handlebars, API, _, OnBoarding) {

    'use strict';

    var s = {
        GROUPS: "[data-role='groups']",
        SEARCH: "[data-role='search']",
        NO_DATA: "[data-role='no-data']",
        DOMAIN_LINK: "[data-link='domain']",

        // currently not used
        GROUPS_LIST: "[data-role='groups-list']"
    },

    defaultOptions = {
        
    };

    function Groups() {
        return this;
    }

    Groups.prototype.render = function (options) {

        log.info("Groups.render;", options);

        this.o = $.extend(true, {}, defaultOptions, options);

        this._initVariables();

        this._configurePage();

    };

    Groups.prototype._initVariables = function () {

        this.$CONTAINER = $(this.o.container);

        /* Load main structure. */
        var t = Handlebars.compile($(templates).filter("#template").html());

        this.$CONTAINER.html(t({
            search_for_a_domain: i18nLabels.search_for_a_domain,
            no_data_available: i18nLabels.no_data_available,
            domains: i18nLabels.domains,
            filter_domains: i18nLabels.filter_domains
        }));

        // init variable
        this.$GROUPS = this.$CONTAINER.find(s.GROUPS);
        this.$SEARCH = this.$CONTAINER.find(s.SEARCH);
        this.$NO_DATA = this.$CONTAINER.find(s.NO_DATA);

        // currently not used
        this.$GROUPS_LIST = this.$CONTAINER.find(s.GROUPS_LIST);

        // focus on search
        //this.$SEARCH.focus();

        amplify.publish(E.LOADING_SHOW, {container: this.$GROUPS});

    };

    Groups.prototype._configurePage = function() {

        var self = this;

        API.groupsanddomains()
            .then(_.bind(this._show, this))
            .fail(function(e) {
                log.error("Groups.initVariables; error", e);
                  amplify.publish(E.LOADING_HIDE, {container: self.$GROUPS});
                  amplify.publish(E.CONNECTION_PROBLEM);
            });

    };

    Groups.prototype._show = function(d) {

        var data = d.data,
            self = this;

        this._showGroupsAndDomains(data);
        this._showGroups(data);

        // TODO: in theory should be applied that function on the filter item .val().replace(/\s+$/, '')
        this.$SEARCH.instaFilta({
            markMatches: true,
            typeDelay: 250,
            onFilterComplete: function(matchedItems) {

                // show/hide no data div
                if (matchedItems) {
                    matchedItems.length > 0 ? self.$NO_DATA.hide() : self.$NO_DATA.show();
                }

                // tracking analytics searched label and matching
                var label = self.$SEARCH.val(),
                    matched = matchedItems.length > 0 ? true : false;

                if( label.length > 2 ) {
                    self._analyticsSearchDomain(label + " - " + matched)
                }

            }
        });

        this._bindEventListeners();

    };

    Groups.prototype._showGroups = function(data) {

        var t = Handlebars.compile($(templates).filter('#groups-list').html());
        this.$GROUPS_LIST.html(t(this._getGroups(data)));

    };

    Groups.prototype._getGroups = function(data) {

        // get unique domains
        var groups = _.chain(data)
            .uniq(function(v) {
                return v.group_name;
            })
            .value();

        return groups;

    };

    Groups.prototype._showGroupsAndDomains = function(data) {

        var t = Handlebars.compile($(templates).filter('#groups').html());

        this.$GROUPS.html(t(this._getGroupsAndDomains(data)));

    };

    Groups.prototype._getGroupsAndDomains = function(data) {

        var json = {};

        _.each(data, function(d) {

            var id = d.group_code;

            if(!json.hasOwnProperty(id)) {
                var rowStart = (Object.keys(json).length % 3 === 0);
                var rowEnd = (Object.keys(json).length % 3 === 1);
                json[id] = {
                    title: d.group_name,
                    //link: '#' + Common.getURI(ROUTES.BROWSE_BY_DOMAIN_CODE, [d.group_code]),
                    link: '#' + Common.getURI(ROUTES.DOWNLOAD_INTERACTIVE, [d.group_code]),
                    group_code: d.group_code,
                    data: [],
                    // TODO: remove rowStart and rowEnd
                    rowStart: rowStart,
                    rowEnd: rowEnd
                };
            }

            // links
            d.link = '#' + Common.getURI(ROUTES.DOWNLOAD_INTERACTIVE, [d.domain_code]);

            json[id].data.push(d);

        });

        return json;
    };

    Groups.prototype.tour = function(force) {

        var force = force || false;

        if (this.onboarding === undefined) {
            this.onboarding = new OnBoarding();
            this.onboarding.setOptions({
                id: "data_groups",
                steps: [
                    {
                        intro: "Explore the domains",
                        element: this.$GROUPS.find('.domain-group-list')
                    },
                    {
                        intro: "Filter the domains list by name of domain code",
                        element: this.$SEARCH
                    },
                    {
                        intro: "Select a domain to go to the download data page",
                        element:  this.$GROUPS.find('.domain-list')
                    }
                ]
            });
        }

        this.onboarding.start(force);

    };

    Groups.prototype._analyticsDomainSelection = function (label) {

        amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
            $.extend({}, A.data_domain_list_page.select_a_domain, {
                label: label
            })
        );

    };

    Groups.prototype._analyticsSearchDomain = function (label) {

        amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
            $.extend({}, A.data_domain_list_page.search_a_domain, {
                label: label
            })
        );

    };

    Groups.prototype._bindEventListeners = function () {

        var self = this;

        this.$GROUPS.find('a').on("click", function(e) {

            var label;
            try {
                label = $(this).attr('href').replace(/^.*?(#|$)/, '');
            }catch(e) {
                log.warn("Groups._bindEventListeners; not has found in ", $(this).attr('href'), e);
            }
            self._analyticsDomainSelection(label);

        });

        // not used
        this.$GROUPS_LIST.find("a").on('click', function(e) {

            e.preventDefault();

            var section = $(this).data("section"),
                $container = self.$GROUPS.find("[data-section='" + section + "']");

            if ( $container.length > 0 && $container.is(':visible')) {
                amplify.publish(E.SCROLL_TO_SELECTOR, {
                    container: $container,
                    force: true,
                    animate: true,
                    paddingTop: 30
                });
            }

        });

    };

    Groups.prototype._unbindEventListeners = function () {

        this.$GROUPS_LIST.find("a").off();

    };
    
    Groups.prototype.destroy = function () {

        log.info("Groups.destroy;");

        this._unbindEventListeners();

        // destroy all filters
        if (this.$CONTAINER !== undefined) {
            this.$CONTAINER.empty();
        }

        if (this.onboarding) {
            this.onboarding.destroy();
        }

    };

    return Groups;

});
