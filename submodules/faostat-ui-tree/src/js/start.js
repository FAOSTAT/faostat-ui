/*global define*/
define(['jquery',
        'faostat_commons',
        'faostatapiclient',
        'jstree',
        'sweetAlert'], function ($, FAOSTATCommons, FAOSTATAPIClient) {

    'use strict';

    function TREE() {

        this.CONFIG = {

            w: null,
            code: null,
            lang: 'en',
            group: null,
            domain: null,

            lang_faostat: 'E',
            datasource: 'faostat',
            max_label_width: null,
            prefix: 'faostat_tree_',
            placeholder_id: 'placeholder',
            url_rest: 'http://faostat3.fao.org/wds/rest',
            url_wds_crud: 'http://fenixapps2.fao.org/wds_5.1/rest/crud',

            /* Events to destroy. */
            callback: {
                onClick: null,
                onGroupClick: null,
                onDomainClick: null,
                onTreeRendered: null
            }

        };

    }

    TREE.prototype.init = function (config) {

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

    TREE.prototype.render = function () {

        /* Store JQuery object.. */
        this.tree = $(this.CONFIG.placeholder_id).length > 0 ? $(this.CONFIG.placeholder_id) : $("#" + this.CONFIG.placeholder_id);

        /* Fetch FAOSTAT groups and domains. */
        this.CONFIG.api.groupsanddomains({

            success: this.process_api_response,
            context: this

        });

    };

    TREE.prototype.process_api_response = function (json) {

        /* Buffer. */
        var buffer = [],
            payload = [],
            i,
            that = this;

        /* Iterate over domains. */
        for (i = 0; i < json.data.length; i += 1) {

            /* Create group node. */
            if ($.inArray(json.data[i].GroupCode, buffer) < 0) {
                buffer.push(json.data[i].GroupCode);
                payload.push({
                    id: json.data[i].GroupCode,
                    text: json.data[i].GroupNameE,
                    parent: '#'
                });
            }

            /* Add domain node. */
            payload.push({
                id: json.data[i].DomainCode,
                text: json.data[i].DomainNameE,
                parent: json.data[i].GroupCode
            });

        }

        /* Init JSTree. */
        this.tree.jstree({

            plugins: ['unique', 'search', 'types', 'wholerow'],

            core: {
                data: payload,
                themes: {
                    icons: false,
                    responsive: true
                }
            },

            search: {
                show_only_matches: true,
                close_opened_onclear: false
            }

        });

        /* Implement node selection. */
        that.tree.on('activate_node.jstree', function (e, data) {

            /* Fetch node. */
            var node = $('#' + data.node.id);

            /* Generic click listener, or specific listeners for groups and domains. */
            if (that.CONFIG.callback.onClick) {
                if (data.node.parent === '#') {
                    data.node.parent === '#' && that.tree.jstree().is_open() ? that.tree.jstree().close_node(node) : that.tree.jstree().open_node(node);
                }
                if (that.CONFIG.callback.onClick) {
                    that.CONFIG.callback.onClick({id: data.node.id});
                }
            } else {
                if (data.node.parent === '#') {
                    data.node.parent === '#' && that.tree.jstree().is_open() ? that.tree.jstree().close_node(node) : that.tree.jstree().open_node(node);
                    if (that.CONFIG.callback.onGroupClick) {
                        that.CONFIG.callback.onGroupClick({id: data.node.id});
                    }
                } else {
                    if (that.CONFIG.callback.onDomainClick) {
                        that.CONFIG.callback.onDomainClick({id: data.node.id});
                    }
                }
            }

        });

        /* Show required domain. */
        this.tree.on('ready.jstree', function () {

            /* set and select default code. */
            that.selectDefaultCode();

            /* Invoke onTreeRendered function. */
            if (that.CONFIG.callback.onTreeRendered) {
                that.CONFIG.callback.onTreeRendered(that.CONFIG.default_code);
            }

        });

    };

    TREE.prototype.selectDefaultCode = function () {
        if (this.CONFIG.code) {
            this.CONFIG.default_code = this.CONFIG.code;
            this.tree.jstree().select_node(this.CONFIG.code);
        } else if (this.CONFIG.domain) {
            this.CONFIG.default_code = this.CONFIG.domain;
            this.tree.jstree().select_node(this.CONFIG.domain);
        } else if (this.CONFIG.group) {
            this.CONFIG.default_code = this.CONFIG.group;
            this.tree.jstree().select_node(this.CONFIG.group);
        }
    };

    TREE.prototype.destroy = function () {
        this.tree.jstree("destroy");
    };

    return TREE;

});