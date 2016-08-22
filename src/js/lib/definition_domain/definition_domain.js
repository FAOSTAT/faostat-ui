/*global define, _:false, $, amplify, FM */
define([
    'jquery',
    'loglevel',
    'globals/Common',
    'config/Config',
    'config/Events',
    'config/Analytics',
    'text!lib/definition_domain/templates/templates.hbs',
    'lib/definition/definition',
    'handlebars',
    'faostatapiclient',
    'underscore',
    'underscore.string',
    'amplify'
], function ($, log, Common, C, E, A, templates, Definition, Handlebars, FAOSTATAPIClient, _, _s) {

    'use strict';

    var s = {
            LIST: "[data-role='list']",
            OUTPUT: "[data-role='output']"
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

        this.o.lang = Common.getLocale();

        this.api = new FAOSTATAPIClient();

        this._initVariables();

        this._configurePage();

        this._bindEventListeners();

        // add analytics
        // TODO: add here on button selection?
      this._analyticsDefinitionSelectDownload(this.o.domain_code);

    };

    DefinitionDomain.prototype._initVariables = function () {

        this.FAOSTATAPIClient = new FAOSTATAPIClient();

        this.$CONTAINER = $(this.o.container);

        var html = $(templates).filter("#template").html(),
            t = Handlebars.compile(html);

        this.$CONTAINER.html(t({}));

        // init variables
        this.$LIST = this.$CONTAINER.find(s.LIST);
        this.$OUTPUT = this.$CONTAINER.find(s.OUTPUT);
        this.$LIST_TOGGLE = this.$CONTAINER.find(s.LIST_TOGGLE);
    };

    DefinitionDomain.prototype._configurePage = function () {

        this._definitions_domain()

    };

    DefinitionDomain.prototype._definitions_domain = function () {

        this.api.definitions_domain({
            datasource: C.DATASOURCE,
            lang: this.o.lang,
            domain_code: this.o.domain_code
        }).then(_.bind(this._showList, this));

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

            var domain_code = self.o.domain_code,
                type = $(this).data('code'),
                label =  $(this).data('label');

            self._showDefinitions(domain_code, type, label);

        });

    };

    DefinitionDomain.prototype._showDefinitions = function (domain_code, type, label) {

        var label = label;

        this._analyticsDefinitionDomainTypeSelection(domain_code + ' - ' + type);

        var definition = new Definition();

        definition.render({
            container: this.$OUTPUT,
            domain_code:domain_code,
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
