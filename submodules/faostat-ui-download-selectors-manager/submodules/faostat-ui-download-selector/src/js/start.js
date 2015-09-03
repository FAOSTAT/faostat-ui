/*global define, _*/
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
            lang: 'en',
            lang_faostat: 'E',
            placeholder_id: 'placeholder',
            suffix: 'area',
            rendered: false,
            tabs :   [
                {
                    label: 'Test',
                    rest: 'http://fenixapps2.fao.org/wds_5.1/rest/procedures/usp_GetListBox/faostatdb/GT/1/1/E'
                }
            ],
            selector_buffer: [],
            /* Events to destroy. */
            callback: {
                onSelectionChange: null
            }
        };

    }

    SELECTOR.prototype.init = function (config) {

        /* Variables. */
        var that = this, source, template, dynamic_data, html, tab_idx;

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang !== null ? this.CONFIG.lang : 'en';

        /* Store FAOSTAT language. */
        this.CONFIG.lang_faostat = FAOSTATCommons.iso2faostat(this.CONFIG.lang);

        /* Load main structure. */
        source = $(templates).filter('#main_structure').html();
        template = Handlebars.compile(source);
        dynamic_data = {
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
        html = template(dynamic_data);
        $('#' + this.CONFIG.placeholder_id).html(html);

        /* Add tab headers and contents. */
        for (tab_idx = 0; tab_idx < this.CONFIG.tabs.length; tab_idx += 1) {
            this.add_tab_header(tab_idx, this.CONFIG.tabs[tab_idx].label);
            this.add_tab_content(tab_idx);
            this.load_codelist(tab_idx, this.CONFIG.tabs[tab_idx].rest);
            this.bind_search(tab_idx);
        }

        /* Rendered. */
        this.CONFIG.rendered = true;

        /* Bind select all functions. */
        $('#select_all_button_' + this.CONFIG.suffix).click(function () {
            that.select_all();
        });

        /* Bind clear all functions. */
        $('#clear_all_button_' + this.CONFIG.suffix).click(function () {
            that.clear_all();
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

    SELECTOR.prototype.add_tab_header = function (tab_idx, tab_header_label) {
        var source, template, dynamic_data, html;
        source = $(templates).filter('#tab_header_structure').html();
        template = Handlebars.compile(source);
        dynamic_data = {
            role_id: 'role_' + this.CONFIG.suffix + '_' + tab_idx,
            tab_header_label: tab_header_label
        };
        html = template(dynamic_data);
        $('#tab_headers_' + this.CONFIG.suffix).append(html);
    };

    SELECTOR.prototype.add_tab_content = function (tab_idx) {
        var source, template, dynamic_data, html;
        source = $(templates).filter('#tab_content_structure').html();
        template = Handlebars.compile(source);
        dynamic_data = {
            id: 'role_' + this.CONFIG.suffix + '_' + tab_idx,
            content_id: 'content_' + this.CONFIG.suffix + '_' + tab_idx
        };
        html = template(dynamic_data);
        $('#tab_contents_' + this.CONFIG.suffix).append(html);
    };

    SELECTOR.prototype.load_codelist = function (tab_idx, rest) {

        var that = this;

        $.ajax({

            type: 'GET',
            url: rest,

            success: function (response) {

                /* Variables. */
                var json, payload, tree, i;

                /* Cast the response to JSON, if needed. */
                json = response;
                if (typeof json === 'string') {
                    json = $.parseJSON(response);
                }

                /* Cast array to objects */
                payload = [];
                for (i = 0; i < json.length; i += 1) {
                    payload.push({
                        id: json[i][0] + '_' + json[i][3],
                        text: json[i][1],
                        li_attr: {
                            code: json[i][0],
                            type: json[i][3],
                            label: json[i][1],
                            tab_idx: tab_idx
                        }
                    });
                }

                /* Init JSTree. */
                tree = $('#content_' + that.CONFIG.suffix + '_' + tab_idx);
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
                    var box_id, tab_id;
                    tab_id = this.id.charAt(this.id.length - 1);
                    box_id = this.id.charAt(9);
                    that.summary_listener(data, box_id, tab_id);
                    if (that.CONFIG.callback.onSelectionChange) {
                        that.CONFIG.callback.onSelectionChange();
                    }
                });

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

    /*
        Use Underscore to determine wheter the array of objects contains an object with the ID equals to
        the one of the selected JSTree's node.
     */
    SELECTOR.prototype.no_object_with_the_same_key = function (selected_node) {
        return _.find(this.CONFIG.selector_buffer['#summary_' + this.CONFIG.suffix], function (item) {
            return item.id === selected_node;
        }) === undefined;
    };

    SELECTOR.prototype.find_selected_item = function (item_code) {
        return _.find(this.CONFIG.selector_buffer['#summary_' + this.CONFIG.suffix], function (item) {
            return item.id === item_code;
        });
    };

    SELECTOR.prototype.summary_listener = function (data, box_id) {

        /*
            Initiate selector's buffer. This buffer contains all the selected JSTree nodes selected by the user for
            a given box, e.g. Areas. This is used to enable cross-tabs selection.
        */
        if (this.CONFIG.selector_buffer['#summary_' + this.CONFIG.suffix] === undefined) {
            this.CONFIG.selector_buffer['#summary_' + this.CONFIG.suffix] = [];
        }

        /* Initiate variables. */
        var s = '', source, template, dynamic_data, i, that = this;
        source = $(templates).filter('#summary_item').html();
        template = Handlebars.compile(source);
        dynamic_data = {};

        /* Add selected items to the buffer. */
        for (i = 0; i < data.selected.length; i += 1) {
            if (this.no_object_with_the_same_key(data.selected[i])) {
                this.CONFIG.selector_buffer['#summary_' + this.CONFIG.suffix].push(data.instance.get_node(data.selected[i]));
            }
        }

        /* Iterate over selected items. */
        /* TODO: iterate over buffer, data.instance.get_node??? */
        for (i = 0; i < this.CONFIG.selector_buffer['#summary_' + this.CONFIG.suffix].length; i += 1) {
            dynamic_data = {
                click_to_remove_label: translate.click_to_remove,
                summary_item_type: this.CONFIG.selector_buffer['#summary_' + this.CONFIG.suffix][i].li_attr.type,
                summary_item_code: this.CONFIG.selector_buffer['#summary_' + this.CONFIG.suffix][i].li_attr.code,
                summary_item_label: this.CONFIG.selector_buffer['#summary_' + this.CONFIG.suffix][i].li_attr.label,
                summary_item_id: this.CONFIG.selector_buffer['#summary_' + this.CONFIG.suffix][i].li_attr.id + this.CONFIG.suffix,
                box_id: box_id,
                tab_id: this.CONFIG.selector_buffer['#summary_' + this.CONFIG.suffix][i].li_attr.tab_idx
            };
            s += template(dynamic_data);
        }

        /* Show selected items in the summary. */
        $('#summary_' + this.CONFIG.suffix).empty().html(s);

        /* Remove item on click. */
        $('.summary-item').click(function () {

            /* Un-select JSTree node. */
            var local_box_id, local_tab_id, tree_id, item_id, selected_item, selected_item_idx;
            local_box_id = $(this).data('box');
            local_tab_id = $(this).data('tab');
            tree_id = 'content__' + local_box_id + '_' + local_tab_id;
            item_id = this.id.substring(0, this.id.length - 2);
            $('#' + tree_id).jstree(true).deselect_node("[id='" + item_id + "']");

            /* Remove item from the buffer. */
            selected_item = that.find_selected_item(item_id);
            selected_item_idx = that.CONFIG.selector_buffer['#summary_' + that.CONFIG.suffix].indexOf(selected_item);
            that.CONFIG.selector_buffer['#summary_' + that.CONFIG.suffix].splice(selected_item_idx, 1);

            /* Remove item from the summary. */
            console.debug('#' + this.id);
            //$('#' + this.id).remove();
            document.getElementById(this.id).remove();

        });

        /* Add user' onSelectionChange callback. */
        if (this.CONFIG.callback.onSelectionChange) {
            this.CONFIG.callback.onSelectionChange();
        }

    };

    SELECTOR.prototype.bind_search = function (tab_idx) {
        var to = false, that = this;
        $('#search_' + this.CONFIG.suffix).keyup(function () {
            if (to) {
                /*global clearTimeout*/
                clearTimeout(to);
            }
            /*global setTimeout*/
            setTimeout(function () {
                var v = $('#search_' + that.CONFIG.suffix).val();
                $('#content_' + that.CONFIG.suffix + '_' + tab_idx).jstree(true).search(v);
            }, 250);
        });
    };

    SELECTOR.prototype.active_tab_idx = function () {
        var tab_idx = $('ul#tab_headers_' + this.CONFIG.suffix + ' li.active').attr('role');
        return tab_idx.charAt(tab_idx.length - 1);
    };

    SELECTOR.prototype.select_all = function () {
        var tab_idx = this.active_tab_idx();
        $('#content_' + this.CONFIG.suffix + '_' + tab_idx).jstree('check_all');
    };

    SELECTOR.prototype.create_select_all_object = function () {
        var obj = $('#summary_' + this.CONFIG.suffix), source, template, dynamic_data;
        obj.empty();
        source = $(templates).filter('#summary_item').html();
        template = Handlebars.compile(source);
        dynamic_data = {
            summary_item_type: 'type',
            summary_item_id: 'id',
            summary_item_code: 'code',
            summary_item_label: 'All Countries'
        };
        obj.html(template(dynamic_data));
    };

    SELECTOR.prototype.clear_all = function () {
        var tab_idx = this.active_tab_idx();
        $('#summary_' + this.CONFIG.suffix).empty();
        $('#content_' + this.CONFIG.suffix + '_' + tab_idx).jstree('deselect_all');
    };

    SELECTOR.prototype.get_user_selection = function () {
        var out = [], divs, i, code;
        divs = $('#summary_' + this.CONFIG.suffix + ' div');
        for (i = 0; i < divs.length; i += 1) {
            code = $(divs[i]).data('code');
            if (divs[i].id.indexOf('>') > -1) {
                code += '>';
            }
            out.push("'" + code + "'");
        }
        return out;
    };

    return SELECTOR;

});