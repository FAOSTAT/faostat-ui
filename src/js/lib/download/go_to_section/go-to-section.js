/*global define, _:false, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'config/Routes',
    'globals/Common',
    'config/Events',
    'text!lib/download/go_to_section/templates/template.hbs',
    'i18n!nls/download',
    'handlebars',
    'underscore',
    'amplify'
], function ($, log, ROUTE, Common, E, template, i18nLabels, Handlebars, _) {

    'use strict';

    var s = {

        WELCOME_SECTION: 'a'


    },defaultOptions = {

        // TODO: move to a common download section
        sections: [
            {
                id: ROUTE.DOWNLOAD_ABOUT,
                name: i18nLabels.about
            },
            {
                id: ROUTE.DOWNLOAD_INTERACTIVE,
                name: i18nLabels.interactive_download_title
            },
            {
                id: ROUTE.DOWNLOAD_BULK,
                name: i18nLabels.bulk_downloads_title
            },
            {
                id: ROUTE.DOWNLOAD_METADATA,
                name: i18nLabels.metadata_title
            }
        ]

    };

    function Go_TO_SECTION() {

        return this;
    }

    Go_TO_SECTION.prototype.init = function (options) {

        this.o = $.extend(true, {}, defaultOptions, options);

        // init lang
        this.o.lang = Common.getLocale();

        // store container variable
        this.$CONTAINER = $(this.o.container);

        this.initVariables();

        this.initComponents();

        this.bindEventListeners();

    };

    Go_TO_SECTION.prototype.initVariables = function () {

    };

    Go_TO_SECTION.prototype.initComponents = function () {

        var t = Handlebars.compile(template),
            c = $.extend(true, {}, i18nLabels, { sections: this.o.sections});

        this.$CONTAINER.append(t(c));


    };

    Go_TO_SECTION.prototype.changeState = function (section, code) {
        Common.changeURL(section, [code], true);
    };


    Go_TO_SECTION.prototype.bindEventListeners = function () {

        var self = this;

        this.$CONTAINER.find(s.WELCOME_SECTION).on('click', function(e) {

            e.preventDefault();

            // routing
            self.changeState(this.getAttribute('data-section'), self.o.domain_code);

        });

    };

    Go_TO_SECTION.prototype.unbindEventListeners = function () {

        this.$CONTAINER.find(s.WELCOME_SECTION).off('click');

    };

    Go_TO_SECTION.prototype.dispose = function () {

        this.unbindEventListeners();
    };

    return Go_TO_SECTION;
});
