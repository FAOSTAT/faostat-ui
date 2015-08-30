define(['jquery',
        'handlebars',
        'faostat_commons',
        'text!faostat_ui_download_selector/html/templates.hbs',
        'i18n!faostat_ui_download_selector/nls/translate',
        'sweetAlert',
        'bootstrap',
        'jstree'], function ($, Handlebars, FAOSTATCommons, templates, translate, sweetAlert) {

    'use strict';

    function SELECTOR() {

        this.CONFIG = {
            lang: 'E',
            lang_faostat: 'E',
            placeholder_id: 'placeholder',
            suffix: 'area',
            rendered: false,
            tabs :   [
                {
                    label: 'Test',
                    rest: 'http://fenixapps2.fao.org/wds_5.1/rest/procedures/usp_GetListBox/faostatdb/GT/1/1/E'
                }
            ]
        };

    }

    SELECTOR.prototype.init = function(config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang != null ? this.CONFIG.lang : 'E';

        /* Store FAOSTAT language. */
        this.CONFIG.lang_faostat = FAOSTATCommons.iso2faostat(this.CONFIG.lang);

        /* this... */
        var _this = this;

        /* Load main structure. */
        var source = $(templates).filter('#main_structure').html();
        var template = Handlebars.compile(source);
        var dynamic_data = {
            tab_headers_id: 'tab_headers_' + this.CONFIG.suffix,
            tab_contents_id: 'tab_contents_' + this.CONFIG.suffix,
            go_to_label: translate.go_to,
            clear_all_label: translate.clear_all,
            select_all_label: translate.select_all,
            select_all_button_id: 'select_all_button_' + this.CONFIG.suffix,
            clear_all_button_id: 'clear_all_button_' + this.CONFIG.suffix,
            search_id: 'search_' + this.CONFIG.suffix,
            summary_id: 'summary_' + this.CONFIG.suffix,
            summary_label: translate.summary
        };
        var html = template(dynamic_data);
        $('#' + this.CONFIG.placeholder_id).html(html);

        /* Add tab headers and contents. */
        for (var tab_idx = 0 ; tab_idx < this.CONFIG.tabs.length ; tab_idx++) {
            this.add_tab_header(tab_idx, this.CONFIG.tabs[tab_idx].label);
            this.add_tab_content(tab_idx);
            this.load_codelist(tab_idx, this.CONFIG.tabs[tab_idx].rest);
            this.bind_search(tab_idx);
        }

        /* Rendered. */
        this.CONFIG.rendered = true;

        /* Bind select all functions. */
        $('#select_all_button_' + this.CONFIG.suffix).click(function() {
            _this.select_all();
        });

        /* Bind clear all functions. */
        $('#clear_all_button_' + this.CONFIG.suffix).click(function() {
            _this.clear_all();
        });

        /* Show the first tab. */
        $($('#tab_headers_' + this.CONFIG.suffix).find('a')[0]).tab('show');

    };

    SELECTOR.prototype.isRendered = function () {
        return this.CONFIG.rendered;
    };

    SELECTOR.prototype.isNotRendered = function () {
        return !this.CONFIG.rendered;
    };

    SELECTOR.prototype.add_tab_header = function(tab_idx, tab_header_label) {
        var source = $(templates).filter('#tab_header_structure').html();
        var template = Handlebars.compile(source);
        var dynamic_data = {
            role_id: 'role_' + this.CONFIG.suffix + '_' + tab_idx,
            tab_header_label: tab_header_label
        };
        var html = template(dynamic_data);
        $('#tab_headers_' + this.CONFIG.suffix).append(html);
    };

    SELECTOR.prototype.add_tab_content = function(tab_idx) {
        var source = $(templates).filter('#tab_content_structure').html();
        var template = Handlebars.compile(source);
        var dynamic_data = {
            id: 'role_' + this.CONFIG.suffix + '_' + tab_idx,
            content_id: 'content_' + this.CONFIG.suffix + '_' + tab_idx
        };
        var html = template(dynamic_data);
        $('#tab_contents_' + this.CONFIG.suffix).append(html);
    };

    SELECTOR.prototype.load_codelist = function(tab_idx, rest) {

        var _this = this;

        $.ajax({

            type: 'GET',
            url: rest,

            success: function (response) {

                /* Cast the response to JSON, if needed. */
                var json = response;
                if (typeof json == 'string')
                    json = $.parseJSON(response);

                /* Cast array to objects */
                var payload = [];
                for (var i = 0 ; i < json.length ; i++)
                    payload.push({
                        id: json[i][0] + '_' + json[i][3],
                        text: json[i][1],
                        li_attr: {
                            code: json[i][0],
                            type: json[i][3],
                            label: json[i][1]
                        }
                    });

                /* Init JSTree. */
                var tree = $('#content_' + _this.CONFIG.suffix + '_' + tab_idx);
                tree.jstree({

                    'plugins': ['checkbox', 'unique', 'search', 'striped', 'types', 'wholerow'],

                    'core': {
                        'data': payload,
                        'themes': {
                            'stripes': true,
                            'icons': false
                        }
                    },

                    'search': {
                        'show_only_matches': true,
                        'close_opened_onclear': false
                    }

                });

                /* Bind select function. */
                tree.on('changed.jstree', function (e, data) {
                    _this.summary_listener(data);
                })

            },

            error: function (a) {
                sweetAlert({
                    title: translate.error,
                    type: 'error',
                    text: a.responseText
                });
            }

        });

    };

    SELECTOR.prototype.summary_listener = function(data) {

        /* Initiate variables. */
        var s = '';
        var source = $(templates).filter('#summary_item').html();
        var template = Handlebars.compile(source);
        var dynamic_data = {};

        /* Iterate over selected items. */
        for(var i = 0; i < data.selected.length; i++) {
            dynamic_data = {
                click_to_remove_label: translate.click_to_remove,
                summary_item_type: data.instance.get_node(data.selected[i]).li_attr['type'],
                summary_item_code: data.instance.get_node(data.selected[i]).li_attr['code'],
                summary_item_label: data.instance.get_node(data.selected[i]).li_attr['label'],
                summary_item_id: data.instance.get_node(data.selected[i]).li_attr['id'] + this.CONFIG.suffix
            };
            s += template(dynamic_data);
        }

        /* Show selected items in the summary. */
        $('#summary_' + this.CONFIG.suffix).empty().html(s);

        /* Delete selected item on click. */
        for(i = 0; i < data.selected.length; i++) {
            var id = '#' + data.instance.get_node(data.selected[i]).li_attr['id'] + this.CONFIG.suffix;
            $(id).click(function() {
                this.remove();
            });
        }

        /* Enable tooltips. */
        $('[data-toggle="tooltip"]').tooltip();

        /* Remove item on click. */
        var _this = this;
        $('.summary-item').click(function() {
            var tab_idx = parseInt(this.id.substring(this.id.length - 1, this.id.length)) - 1;
            var item_id = this.id.substring(0, this.id.length - 2);
            $('#content_' + _this.CONFIG.suffix + '_' + tab_idx).jstree(true).deselect_node("[id='" + item_id + "']")
        });

    };

    SELECTOR.prototype.test = function() {
        alert('asd');
    };

    SELECTOR.prototype.bind_search = function(tab_idx) {
        var to = false;
        var _this = this;
        $('#search_' + this.CONFIG.suffix).keyup(function() {
            if (to)
                clearTimeout(to);
            to = setTimeout(function() {
                var v = $('#search_' + _this.CONFIG.suffix).val();
                $('#content_' + _this.CONFIG.suffix + '_' + tab_idx).jstree(true).search(v);
            }, 250);
        });
    };

    SELECTOR.prototype.active_tab_idx = function() {
        var tab_idx = $('ul#tab_headers_' + this.CONFIG.suffix + ' li.active').attr('role');
        return tab_idx.charAt(tab_idx.length - 1);
    };

    SELECTOR.prototype.select_all = function() {
        var tab_idx = this.active_tab_idx();
        $('#content_' + this.CONFIG.suffix + '_' + tab_idx).jstree('check_all');
    };

    SELECTOR.prototype.create_select_all_object = function() {
        var obj = $('#summary_' + this.CONFIG.suffix);
        obj.empty();
        var source = $(templates).filter('#summary_item').html();
        var template = Handlebars.compile(source);
        var dynamic_data = {
            summary_item_type: 'type',
            summary_item_id: 'id',
            summary_item_code: 'code',
            summary_item_label: 'All Countries'
        };
        obj.html(template(dynamic_data));
    };

    SELECTOR.prototype.clear_all = function() {
        var tab_idx = this.active_tab_idx();
        $('#summary_' + this.CONFIG.suffix).empty();
        $('#content_' + this.CONFIG.suffix + '_' + tab_idx).jstree('deselect_all');
    };

    SELECTOR.prototype.get_user_selection = function() {
        var out = [];
        var divs = $('#summary_' + this.CONFIG.suffix + ' div');
        for (var i = 0 ; i < divs.length ; i++)
            out.push("'" + $(divs[i]).data('code') + "'");
        return out;
    };

    return SELECTOR;

});