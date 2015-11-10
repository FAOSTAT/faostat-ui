/*global define*/
define(['jquery',
        'faostat_commons',
        'faostatapiclient',
        'q',
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

            //datasource: 'faostat',
            max_label_width: null,
            prefix: 'faostat_tree_',
            placeholder_id: 'placeholder',
            blacklist: [],

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
        if (!this.CONFIG.lang) {
            console.warn('Language for FAOSTAT-TREE is no set', this.CONFIG.lang);
        }

        this.CONFIG.lang = this.CONFIG.lang !== null ? this.CONFIG.lang : 'en';

        /* Initiate FAOSTAT API's client. */
        this.CONFIG.api = new FAOSTATAPIClient();

        /* Render. */
        this.render();

    };

    TREE.prototype.render = function () {

        /* Variables. */
        var self = this;

        if (this.CONFIG.placeholder_id instanceof $) {
            this.tree = this.CONFIG.placeholder_id;
        }else{
            /* Store JQuery object.. */
            this.tree = $(this.CONFIG.placeholder_id).length > 0 ? $(this.CONFIG.placeholder_id) : $("#" + this.CONFIG.placeholder_id);
        }

        this.CONFIG.lang_faostat = FAOSTATCommons.iso2faostat(this.CONFIG.lang);

        if (this.CONFIG.custom) {
            // create a custom tree
            self.createTree(this.CONFIG.custom);
        }
        else {
            /* Fetch FAOSTAT groups and domains. */
            this.CONFIG.api.groupsanddomains({
                lang: this.CONFIG.lang,
                datasource: this.CONFIG.datasource
            }).then(function (json) {
                self.createTree(self.prepareAPIData(json));
            });
        }

    };

    TREE.prototype.prepareAPIData = function (json) {

        /* Buffer. */
        var buffer = [],
            payload = [];

        /* Iterate over domains. */
        for (var i = 0; i < json.data.length; i++) {

            /* Create group node. */
            if ($.inArray(json.data[i].code, this.CONFIG.blacklist) < 0) {
                if ($.inArray(json.data[i].code, buffer) < 0) {
                    buffer.push(json.data[i].code);
                    payload.push({
                        id: json.data[i].code,
                        text: json.data[i].label,
                        parent: '#'
                    });
                }

                /* Add domain node. */
                if ($.inArray(json.data[i].DomainCode, this.CONFIG.blacklist) < 0) {
                    payload.push({
                        id: json.data[i].DomainCode,
                        text: json.data[i]['DomainName' + this.CONFIG.lang_faostat],
                        parent: json.data[i].code
                    });
                }
            }

        }

        return payload;
    };

    TREE.prototype.createTree = function (data) {

        var self = this;

        /* Init JSTree. */
        this.tree.jstree({

            plugins: ['unique', 'search', 'types', 'wholerow'],

            core: {
                data: data,
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
        this.tree.on('activate_node.jstree', function (e, data) {

            /* Fetch node. */
            // TODO: improve this. the ID is the domain/group code
            var node = $('#' + data.node.id);

            /* Generic click listener, or specific listeners for groups and domains. */
            if (self.CONFIG.callback.onClick) {
                if (data.node.parent === '#') {
                    data.node.parent === '#' && self.tree.jstree().is_open() ? self.tree.jstree().close_node(node) : self.tree.jstree().open_node(node);
                }
                if (self.CONFIG.callback.onClick) {
                    self.CONFIG.callback.onClick({id: data.node.id, label: data.node.text});
                }
            } else {
                if (data.node.parent === '#') {
                    data.node.parent === '#' && self.tree.jstree().is_open() ? self.tree.jstree().close_node(node) : self.tree.jstree().open_node(node);
                    if (self.CONFIG.callback.onGroupClick) {
                        self.CONFIG.callback.onGroupClick({id: data.node.id, label: data.node.text});
                    }
                } else {
                    if (self.CONFIG.callback.onDomainClick) {
                        self.CONFIG.callback.onDomainClick({id: data.node.id, label: data.node.text});
                    }
                }
            }

        });

        /* Show required domain. */
        this.tree.on('ready.jstree', function (data) {
            /* set and select default code. */
            self.selectDefaultCode();

            // options
            if (self.CONFIG.options) {
                if (self.CONFIG.options.open_all) {
                    // open all tree nodes
                    self.tree.jstree("open_all");
                }
            }

            /* Invoke onTreeRendered function. */
            if (self.CONFIG.callback.onTreeRendered) {
                // TODO: fix workaround for default code
                var node = self.tree.jstree().get_selected(true);
                if (node !== undefined && node.length > 0) {
                    self.CONFIG.callback.onTreeRendered(
                        {
                            id: node[0].id,
                            label: node[0].text
                        })
                }
            }

        });

    };

    TREE.prototype.selectDefaultCode = function () {
        if (this.CONFIG.code) {
            this.CONFIG.default_code = this.CONFIG.code;
        } else if (this.CONFIG.domain) {
            this.CONFIG.default_code = this.CONFIG.domain;
        } else if (this.CONFIG.group) {
            this.CONFIG.default_code = this.CONFIG.group;
        } else {
            // TODO: no default selection
        }

        if (this.CONFIG.default_code) {
            this.tree.jstree().select_node(this.CONFIG.default_code);
            this.tree.jstree().open_node(this.CONFIG.default_code);
        }
    };

    TREE.prototype.getCodeType = function () {
        var node = $('#' + this.tree.jstree('get_selected'));
        return this.tree.jstree().is_leaf(node) ? 'domain' : 'group';
    };

    TREE.prototype.destroy = function () {
        this.tree.jstree("destroy");
    };

    return TREE;

});