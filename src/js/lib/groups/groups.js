/*global define, _:false, $, amplify, FM */
define([
    'jquery',
    'loglevel',
    'globals/Common',
    'config/Config',
    'config/Events',
    'config/Routes',
    'i18n!nls/common',
    'text!lib/groups/templates/templates.hbs',
    'handlebars',
    'faostatapiclient',
    'underscore',
    'underscore.string',
    'amplify',
    'instafilta'
], function ($, log, Common, C, E, ROUTES, i18nLabels, templates, Handlebars, FAOSTATAPIClient, _, _s) {

    'use strict';

    var s = {
        GROUPS: "[data-role='groups']",
        GROUPS_LIST: "[data-role='groups-list']",
        SEARCH: "[data-role='search']",
        NO_DATA: "[data-role='no-data']"
    },

    defaultOptions = {
        
    };

    function Groups() {
        return this;
    }

    Groups.prototype.render = function (options) {

        log.info("Groups.render");

        this.o = $.extend(true, {}, defaultOptions, options);

        this.o.lang = Common.getLocale();

        this.api = new FAOSTATAPIClient();

        this._initVariables();

        this._configurePage();

    };

    Groups.prototype._initVariables = function () {

        this.FAOSTATAPIClient = new FAOSTATAPIClient();

        // TODO: have a template?
        //log.info(this.o.container);
        this.$CONTAINER = $(this.o.container);

        /* Load main structure. */
        var t = Handlebars.compile($(templates).filter("#template").html());
        this.$CONTAINER.html(t({
            no_data_available: i18nLabels.no_data_available,
            domains: i18nLabels.domains,
            filter_domains: i18nLabels.filter_domains
        }));

        // init variable
        this.$GROUPS = this.$CONTAINER.find(s.GROUPS);
        this.$GROUPS_LIST = this.$CONTAINER.find(s.GROUPS_LIST);
        this.$SEARCH = this.$CONTAINER.find(s.SEARCH);
        this.$NO_DATA = this.$CONTAINER.find(s.NO_DATA);

    };

    Groups.prototype._configurePage = function() {

        this.api.groupsanddomains({
            datasource: C.DATASOURCE,
            lang: this.o.lang
        }).then(_.bind(this._show, this))
          .fail(function(e) {
            log.error("Groups.initVariables; error", e);
        });

    };

    Groups.prototype._show = function(d) {

        var data = d.data,
            self = this;

        this._showGroupsAndDomains(data);
        this._showGroups(data);

        this.$SEARCH.instaFilta({
            markMatches: true,
            onFilterComplete: function(matchedItems) {

                // show/hide no data div
                matchedItems.length > 0? self.$NO_DATA.hide(): self.$NO_DATA.show();

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
                var rowStart = (Object.keys(json).length % 2 === 0);
                var rowEnd = (Object.keys(json).length % 2 === 1);
                json[id] = {
                    title: d.group_name,
                    link: '#' + Common.getURI(ROUTES.BROWSE_BY_DOMAIN_CODE, [d.group_code]),
                    group_code: d.group_code,
                    data: [],
                    // TODO: remove rowStart and rowEnd
                    rowStart: rowStart,
                    rowEnd: rowEnd
                };
            }

            // links
            d.link = '#' + Common.getURI(ROUTES.BROWSE_BY_DOMAIN_CODE, [d.domain_code]);

            json[id].data.push(d);

        });

        // testing for groups
        //var t = _.groupBy(data, 'group_name');

        return json;
    };

    Groups.prototype._bindEventListeners = function () {

        var self = this;

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

    };

    return Groups;
});
