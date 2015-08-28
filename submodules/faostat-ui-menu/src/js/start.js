define(['jquery',
        'handlebars',
        'text!faostat_ui_menu/html/templates.hbs',
        'i18n!faostat_ui_menu/nls/translate',
        'faostat_commons',
        'bootstrap',
        'sweetAlert',
        'amplify'], function ($, Handlebars, templates, translate, FAOSTATCommons) {

    'use strict';

    function MENU() {

        this.CONFIG = {

            lang: 'en',
            prefix: 'fenix_',
            lang_faostat: 'E',
            datasource: 'faostatdb',
            placeholder_id: 'faostat_ui_menu',
            url_groups: 'http://faostat3.fao.org/wds/rest/groupsanddomains'

        };

    }

    MENU.prototype.init = function(config) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

        /* Fix the language, if needed. */
        this.CONFIG.lang = this.CONFIG.lang != null ? this.CONFIG.lang : 'E';

        /* Store FAOSTAT language. */
        this.CONFIG.lang_faostat = FAOSTATCommons.iso2faostat(this.CONFIG.lang);

        /* Load template. */
        var source = $(templates).filter('#faostat_ui_menu_structure').html();
        var template = Handlebars.compile(source);
        var dynamic_data = {
            fao_label: translate.fao_label,
            ess_label: translate.ess_label,
            toggle_navigation: translate.toggle_navigation,
            home: translate.home,
            home_link: '#/' + this.CONFIG.lang + '/home/',
            browse: translate.browse,
            browse_link: '#/' + this.CONFIG.lang + '/browse/',
            download: translate.download,
            download_link: '#/' + this.CONFIG.lang + '/download/',
            compare: translate.compare,
            compare_link: '#/' + this.CONFIG.lang + '/compare/',
            search: translate.search,
            search_link: '#/' + this.CONFIG.lang + '/search/',
            analysis: translate.analysis,
            analysis_link: '#/' + this.CONFIG.lang + '/analysis/',
            mes: translate.mes,
            mes_link: '#/' + this.CONFIG.lang + '/mes/'
        };
        var html = template(dynamic_data);
        $('#' + this.CONFIG.placeholder_id).html(html);

        /* Enhance buttons. */
        $("a[id$='_language_selector']").click(function() {
            var lang = this.id.substring(0, this.id.indexOf('_'));
            amplify.publish('language_event', {language: lang});
        });

        /* Show groups. */
        this.show_groups();

    };

    MENU.prototype.show_groups = function() {

        /* This... */
        var _this = this;

        $.ajax({

            type: 'GET',
            url: this.CONFIG.url_groups + '/' + this.CONFIG.datasource + '/' + this.CONFIG.lang_faostat,

            success: function (response) {

                /* Cast the result to JSON object, if needed. */
                var json = response;
                if (typeof json == 'string')
                    json = $.parseJSON(response);

                /* Create menu objects. */
                var download_groups = [];
                var browse_groups = [];
                var buffer = [];
                for (var i = 0 ; i < json.length ; i++) {
                    if ($.inArray(json[i][1], buffer) < 0) {
                        buffer.push(json[i][1]);
                        download_groups.push(
                            {
                                item_link: _this.build_download_link(json[i][0]),
                                item_title: json[i][1]
                        });
                        browse_groups.push(
                            {
                                item_link: _this.build_browse_link(json[i][0]),
                                item_title: json[i][1]
                            });
                    }
                }

                /* Add groups to the Download menu. */
                var source = $(templates).filter('#faostat_ui_menu_item').html();
                var template = Handlebars.compile(source);
                var dynamic_data = {group: download_groups};
                var html = template(dynamic_data);
                $('#download_dropdown').html(html);

                /* Add groups to the Browse menu. */
                dynamic_data = {group: browse_groups};
                html = template(dynamic_data);
                $('#browse_dropdown').html(html);

            },

            error: function(a) {
                swal({
                    title: translate.error,
                    type: 'error',
                    text: a.responseText
                });
            }

        });

    };

    MENU.prototype.build_download_link = function(group) {
        return '#/' + this.CONFIG.lang + '/download/' + group.toUpperCase() + '/';
    };

    MENU.prototype.build_browse_link = function(group) {
        return '#/' + this.CONFIG.lang + '/browse/' + group.toUpperCase() + '/';
    };

    return MENU;

});