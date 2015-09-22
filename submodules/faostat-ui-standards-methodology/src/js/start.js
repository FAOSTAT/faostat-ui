/*global define*/
define(['jquery',
        'handlebars',
        'text!faostat_ui_standards_methodology/html/templates.hbs',
        'i18n!faostat_ui_standards_methodology/nls/translate',
        'faostat_commons',
        'faostatapiclient',
        'q',
        'jstree',
        'bootstrap',
        'sweetAlert',
        'amplify'], function ($, Handlebars, templates, translate, FAOSTATCommons, FAOSTATAPIClient, Q) {

    'use strict';

    function METHODOLOGY() {

        this.CONFIG = {

            w: null,
            lang: 'E',
            methodology_id: undefined,
            prefix: 'faostat_ui_standards_methodology_',
            methodologies_tree_id: 'methodologies_tree',
            placeholder_id: 'faostat_ui_standards_methodology',
            url_wds_crud: 'http://fenixapps2.fao.org/wds_5.1/rest/crud'

        };

    }

    METHODOLOGY.prototype.init = function (config) {

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

    METHODOLOGY.prototype.render = function () {

        /* Variables. */
        var source, template, dynamic_data, html, that = this;

        /* Load main structure. */
        source = $(templates).filter('#faostat_ui_standards_methodology_structure').html();
        template = Handlebars.compile(source);
        dynamic_data = { };
        html = template(dynamic_data);
        $('#' + this.CONFIG.placeholder_id).html(html);

        /* Fetch FAOSTAT methodologies. */
        this.CONFIG.api.methodologies({}).then(function (json) {
            that.process_api_response(json);
        });

    };

    METHODOLOGY.prototype.process_api_response = function (json) {

        /* Variables. */
        var buffer = [],
            payload = [],
            i,
            that = this;

        /* Store JQuery object.. */
        this.tree = $(this.CONFIG.methodologies_tree_id).length > 0 ? $(this.CONFIG.methodologies_tree_id) : $("#" + this.CONFIG.methodologies_tree_id);

        /* Iterate over domains. */
        for (i = 0; i < json.data.length; i += 1) {

            /* Create group node. */
            if ($.inArray(json.data[i].code, buffer) < 0) {
                buffer.push(json.data[i].code);
                payload.push({
                    id: json.data[i].code,
                    text: json.data[i].label,
                    parent: '#'
                });
            }

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
            that.show_methodology(data.node.id);
        });

        /* Show required domain. */
        this.tree.on('ready.jstree', function () {

            if (that.CONFIG.methodology_id !== undefined) {
                $('#' + that.CONFIG.methodologies_tree_id).jstree().select_node(that.CONFIG.methodology_id);
                that.show_methodology(that.CONFIG.methodology_id);
            }

        });

    };

    METHODOLOGY.prototype.show_methodology = function (methodology_id) {

        /* Invoke API. */
        this.CONFIG.api.methodology({
            id: methodology_id
        }).then(function (json) {
            console.debug(json);
        });
    };

    METHODOLOGY.prototype.destroy = function () {

    };

    return METHODOLOGY;

});