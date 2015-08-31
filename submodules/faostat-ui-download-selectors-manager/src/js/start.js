/*global define*/
define(['jquery',
        'handlebars',
        'faostat_commons',
        'text!faostat_ui_download_selectors_manager/html/templates.hbs',
        'i18n!faostat_ui_download_selectors_manager/nls/translate',
        'FAOSTAT_UI_DOWNLOAD_SELECTOR',
        'sweetAlert',
        'bootstrap',
        'amplify'], function ($, Handlebars, FAOSTATCommons, templates, translate, SELECTOR, swal) {

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
            rendered_boxes: []
        };

    }

    MGR.prototype.init = function (config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang !== null ? this.CONFIG.lang : 'E';

        /* Store FAOSTAT language. */
        this.CONFIG.lang_faostat = FAOSTATCommons.iso2faostat(this.CONFIG.lang);

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

        /* Query DB for the domain structure. */
        $.ajax({

            url: this.CONFIG.url_listboxes + '/' + this.CONFIG.datasource + '/' + this.CONFIG.domain + '/' + this.CONFIG.lang_faostat,
            type: 'GET',
            dataType: 'json',

            success: function (response) {

                /* Cast the result, if required. */
                var json = response;
                if (typeof json === 'string') {
                    json = $.parseJSON(response);
                }

                /* Courtesy message for the wrong code. */
                if (json.length !== 0) {

                    /* Create selectors. */
                    that.create_selectors(json);

                } else {
                    $('#' + that.CONFIG.placeholder_id).html('<h1 class="text-center">' + translate.courtesy + '</h1>');
                }

            },

            error: function (a) {
                swal({
                    title: translate.error,
                    type: 'error',
                    text: a.responseText
                });
            }

        });

    };

    MGR.prototype.create_selectors = function (rest_response) {

        /* Initiate variables. */
        var current = '1',
            tab_box = [],
            i;

        /* Group response items per tab box. */
        for (i = 0; i < rest_response.length; i += 1) {
            if (rest_response[i][0] !== current) {
                this.create_single_selector(tab_box, current);
                current = rest_response[i][0];
                tab_box = [];
            }
            tab_box.push(rest_response[i]);
        }
        this.create_single_selector(tab_box, current);

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
        for (i = 0; i < tab_box_definition.length; i += 1) {
            tab_json_definitions.push(this.create_tab_json(tab_box_definition[i]));
        }

        /* Create selector. */
        selector = new SELECTOR();
        selector.init({
            lang: that.CONFIG.lang,
            placeholder_id: that.CONFIG.prefix + selector_id,
            suffix: '_' + selector_id,
            tabs: tab_json_definitions
        });

        /* Store selector object for future reference. */
        that.CONFIG.selectors.push(selector);

        /* Keep track of the rendered selector. */
        this.CONFIG.rendered_boxes.push(selector_id);

    };

    MGR.prototype.create_tab_json =  function (tab_definition) {
        var obj = {};
        obj.label = tab_definition[1];
        obj.rest = this.create_listbox_url(tab_definition);
        return obj;
    };

    MGR.prototype.create_listbox_url = function (tab_definition) {
        var s = this.CONFIG.url_codelists;
        s += 'rest/procedures/usp_GetListBox/';
        s += this.CONFIG.datasource + '/';
        s += this.CONFIG.domain + '/';
        s += tab_definition[0] + '/';
        s += tab_definition[2] + '/';
        s += this.CONFIG.lang_faostat;
        return s;
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