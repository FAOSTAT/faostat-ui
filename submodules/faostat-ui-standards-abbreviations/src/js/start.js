/*global define*/
define(['jquery',
        'handlebars',
        'text!faostat_ui_standards_abbreviations/html/templates.hbs',
        'i18n!faostat_ui_standards_abbreviations/nls/translate',
        'faostat_commons',
        'faostatapiclient',
        'bootstrap',
        'sweetAlert',
        'amplify'], function ($, Handlebars, templates, translate, FAOSTATCommons, FAOSTATAPIClient) {

    'use strict';

    function ABBREVIATIONS() {

        this.CONFIG = {

            w: null,
            lang: 'E',
            prefix: 'faostat_ui_standards_abbreviations_',
            placeholder_id: 'faostat_ui_standards_abbreviations',
            url_wds_crud: 'http://fenixapps2.fao.org/wds_5.1/rest/crud'

        };

    }

    ABBREVIATIONS.prototype.init = function (config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang !== null ? this.CONFIG.lang : 'en';

        /* Store FAOSTAT language. */
        this.CONFIG.lang_faostat = FAOSTATCommons.iso2faostat(this.CONFIG.lang);

        /* Initiate FAOSTAT API's client. */
        this.CONFIG.api = new FAOSTATAPIClient();

        /* Render. */
        this.render();

    };

    ABBREVIATIONS.prototype.render = function () {

        /* Variables. */
        var source, template, dynamic_data, html, that = this;

        /* Load main structure. */
        source = $(templates).filter('#faostat_ui_standards_abbreviations_structure').html();
        template = Handlebars.compile(source);
        dynamic_data = {
            faostat_abbreviations_label: translate.faostat_abbreviations_label
        };
        html = template(dynamic_data);
        $('#' + this.CONFIG.placeholder_id).html(html);

        /* Fetch FAOSTAT methodologies. */
        this.CONFIG.api.abbreviations({}).then(function (json) {
            that.process_api_response(json);
        });

    };

    ABBREVIATIONS.prototype.process_api_response = function (json) {

        /* Variables. */
        var source, template, dynamic_data, html;

        /* Load main structure. */
        source = $(templates).filter('#faostat_ui_standards_abbreviations_table').html();
        template = Handlebars.compile(source);
        dynamic_data = {
            rows: json.data,
            acronym_label: translate.acronym_label,
            definition_label: translate.definition_label
        };
        html = template(dynamic_data);
        $('#abbreviations_content').html(html);

    };

    ABBREVIATIONS.prototype.destroy = function () {

    };

    return ABBREVIATIONS;

});