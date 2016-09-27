/*global define, _:false, $, amplify, FM */
define([
    'jquery',
    'loglevel',
    'globals/Common',
    'config/Config',
    'config/Events',
    'config/Analytics',
    'i18n!nls/common',
    'text!lib/definition_domain/templates/templates.hbs',
    'lib/definition/definition',
    'handlebars',
    'faostatapiclient',
    'underscore',
    'underscore.string',
    'amplify'
], function ($, log, Common, C, E, A, i18nLabels, templates, Definition, Handlebars, API, _, _s) {

    'use strict';

    var s = {
            LIST: "[data-role='list']",
            OUTPUT: "[data-role='output']",
            NO_LIST_AVAILABLE: "[data-role='no-list-avaiable']"
        },

        defaultOptions = {};

    function DefinitionDomain() {
        return this;
    }

    DefinitionDomain.prototype.render = function (options) {

        this.o = $.extend(true, {}, defaultOptions, options);

        if (!this.o.hasOwnProperty('container')) {
            log.error('Definitions.render; Missing container option', this.o);
        }

        this._initVariables();

        this._configurePage();

        this._bindEventListeners();

        // add analytics
        // TODO: add here on button selection?
      this._analyticsDefinitionSelectDownload(this.o.code);

    };

    DefinitionDomain.prototype._initVariables = function () {

        this.$CONTAINER = $(this.o.container);

        var html = $(templates).filter("#template").html(),
            t = Handlebars.compile(html);

        this.$CONTAINER.html(t({
            no_data_available: i18nLabels.no_data_available
        }));

        // init variables
        this.$LIST = this.$CONTAINER.find(s.LIST);
        this.$OUTPUT = this.$CONTAINER.find(s.OUTPUT);
        this.$NO_LIST_AVAILABLE = this.$CONTAINER.find(s.NO_LIST_AVAILABLE);
    };

    DefinitionDomain.prototype._configurePage = function () {

        this._definitions_domain()

    };

    DefinitionDomain.prototype._definitions_domain = function () {

        amplify.publish(E.LOADING_SHOW, {container: this.$LIST});

        API.definitions_domain({
            domain_code: this.o.code
        }).then(_.bind(this._showList, this))
          .fail(_.bind(this._showEmptyList, this));

    };

    DefinitionDomain.prototype._showList = function(model) {

        var html = $(templates).filter("#list").html(),
            t = Handlebars.compile(html),
            self = this,
            data = model.data,
            ids = _.chain(data)
                .pluck('id')
                .union()
                .value(),
            values = [],
            list = _.groupBy(model.data, 'id');

        this.$LIST.html(t(list));

        this.$LIST.find('a').off();
        this.$LIST.find('a').on('click', function(e) {

            e.preventDefault();

            self.$OUTPUT.empty();

            var code = self.o.code,
                type = $(this).data('code'),
                label =  $(this).data('label');

            self._showDefinitions(code, type, label);

        });

    };

    DefinitionDomain.prototype._showEmptyList = function(e) {

        amplify.publish(E.LOADING_HIDE, {container: this.$LIST});

        this.$NO_LIST_AVAILABLE.show();

        log.error("DefinitionDomain._showEmptyList", e);

    };

    DefinitionDomain.prototype._showDefinitions = function (code, type, label) {

        var label = label;

        this._analyticsDefinitionDomainTypeSelection(code + ' - ' + type);

        var definition = new Definition();

        definition.render({
            container: this.$OUTPUT,
            code: code,
            type: type,
            table: {
                title: label,
                height: 450,
                pageSize: 250
            }
        });

    };

    DefinitionDomain.prototype._analyticsDefinitionSelectDownload = function (label) {

        amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
            $.extend(this, {},
                A.definitions.selection_domain,
                {label: label})
        );

    };

    DefinitionDomain.prototype._analyticsDefinitionDomainTypeSelection = function (label) {

        amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
            $.extend(this, {},
                A.definitions.selection_domain_type,
                {label: label})
        );

    };

    DefinitionDomain.prototype._bindEventListeners = function () {

    };

    DefinitionDomain.prototype._unbindEventListeners = function () {

    };

    DefinitionDomain.prototype.destroy = function () {

        log.info("DefinitionDomain.destroy;");

        this._unbindEventListeners();

        // destroy all filters
        if (this.$CONTAINER !== undefined) {
            this.$CONTAINER.empty();
        }

    };

    return DefinitionDomain;
});
