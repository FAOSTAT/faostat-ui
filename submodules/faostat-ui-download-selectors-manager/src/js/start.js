/*global define*/
/*jslint nomen: true*/
define(['jquery',
        'handlebars',
        'faostat_commons',
        'text!faostat_ui_download_selectors_manager/html/templates.hbs',
        'i18n!faostat_ui_download_selectors_manager/nls/translate',
        'FAOSTAT_UI_DOWNLOAD_SELECTOR',
        'faostatapiclient',
        'sweetAlert',
        'bootstrap',
        'amplify'], function ($, Handlebars, FAOSTATCommons, templates, translate, SELECTOR, FAOSTATAPIClient) {

    'use strict';

    function MGR() {

        this.CONFIG = {
            lang: 'E',
            lang_faostat: 'E',
            domain: 'GT',
            selectors: [],
            prefix: 'fenix_',
            datasource: 'faostatdb',
            placeholder_id: 'placeholder',
            url_codelists: 'http://fenixapps2.fao.org/wds_5.1/',
            url_listboxes: 'http://fenixapps2.fao.org/wds_5.1/rest/procedures/listboxes',
            rendered: false,
            rendered_boxes: [],
            callback: {
                onSelectionChange: null
            }
        };

    }

    MGR.prototype.init = function (config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang !== null ? this.CONFIG.lang : 'E';

        /* Store FAOSTAT language. */
        this.CONFIG.lang_faostat = FAOSTATCommons.iso2faostat(this.CONFIG.lang);

        /* Initiate FAOSTAT API's client. */
        this.CONFIG.api = new FAOSTATAPIClient();

        /* Variables. */
        var that,
            source,
            template,
            dynamic_data,
            html;

        /* This... */
        that = this;

        /* Load selectors grid template. */
        source = $(templates).filter('#selectors_grid').html();
        template = Handlebars.compile(source);
        dynamic_data = {
            prefix: this.CONFIG.prefix
        };
        html = template(dynamic_data);
        $('#' + this.CONFIG.placeholder_id).html(html);

        /* Fetch domain structure. */
        this.CONFIG.api.dimensions({
            domain_code: this.CONFIG.domain,
            lang: this.CONFIG.lang
        }).then(function (json) {

            /* Prepare the output. */
            var out = [], i;

            /* Remove extra objects. This is a buf of the API. */
            for (i = 0; i < json.data.length; i += 1) {
                if (json.data[i].id !== undefined) {
                    out.push(json.data[i]);
                }
            }

            /* Create selectors or show a courtesy message if nothing is retrieved. */
            if (out.length > 0) {
                for (i = 0; i < out.length; i += 1) {
                    that.create_single_selector(out[i], i);
                }
            } else {
                $('#' + that.CONFIG.placeholder_id).html('<h1 class="text-center">' + translate.courtesy + '</h1>');
            }

        });

    };

    MGR.prototype.create_single_selector = function (tab_box_definition, selector_id) {

        /* Variables. */
        var that = this,
            source,
            template,
            dynamic_data,
            html,
            tab_json_definitions,
            i,
            selector;

        /* Add template to the main page. */
        source = $(templates).filter('#single_selector').html();
        template = Handlebars.compile(source);
        dynamic_data = {
            prefix: this.CONFIG.prefix,
            selector_id: selector_id
        };
        html = template(dynamic_data);
        $('#' + this.CONFIG.prefix + 'selectors_grid').append(html);

        /* Create JSON configuration for the selector. */
        tab_json_definitions = [];
        for (i = 0; i < tab_box_definition.subdimensions.length; i += 1) {
            tab_json_definitions.push(this.create_tab_json(tab_box_definition.id, tab_box_definition.subdimensions[i]));
        }

        /* Create selector. */
        selector = new SELECTOR();
        selector.init({
            lang: that.CONFIG.lang,
            placeholder_id: that.CONFIG.prefix + selector_id,
            suffix: '_' + selector_id,
            tabs: tab_json_definitions,
            callback: {
                onSelectionChange: that.CONFIG.callback.onSelectionChange
            }
        });

        /* Store selector object for future reference. */
        that.CONFIG.selectors.push(selector);

        /* Keep track of the rendered selector. */
        this.CONFIG.rendered_boxes.push(selector_id);

    };

    MGR.prototype.create_tab_json =  function (group_id, tab_definition) {
        var obj = {};
        obj.label = tab_definition.label;
        obj.id = tab_definition.id;
        obj.group_id = group_id;
        obj.domain_code = this.CONFIG.domain;
        return obj;
    };

    MGR.prototype.get_user_selection = function () {
        var out = {},
            i;
        /* FAOSTAT procedures require exactly 7 filtering arrays. */
        for (i = 0; i < 7; i += 1) {
            try {
                out['list' + (1 + i) + 'Codes'] = this.CONFIG.selectors[i].get_user_selection();
            } catch (e) {
                out['list' + (1 + i) + 'Codes'] = [];
            }
        }
        return out;
    };

    MGR.prototype.isRendered = function () {
        var tmp,
            i;
        for (i = 0; i < this.CONFIG.selectors.length; i += 1) {
            if (tmp === undefined) {
                tmp = this.CONFIG.selectors[i].isRendered();
            } else {
                tmp = tmp && this.CONFIG.selectors[i].isRendered();
            }
        }
        this.CONFIG.rendered = tmp !== undefined ? tmp : false;
        return this.CONFIG.rendered;
    };

    MGR.prototype.isNotRendered = function () {
        return !this.isRendered();
    };

    return MGR;

});