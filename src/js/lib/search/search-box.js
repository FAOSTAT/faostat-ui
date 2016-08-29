/*global define, _:false, $, console, amplify, FM, unescape, escape */
define([
    'jquery',
    'loglevel',
    'config/Config',
    'config/Events',
    'globals/Common',
    'i18n!nls/common',
    'typeahead',
    'bloodhound',
    'handlebars',
    'underscore',
    'underscore.string',
    'faostatapiclient',
    'amplify'
], function ($, log, C, E, Common, i18nLabels, typeahead, Bloodhound, Handlebars, _, _s, API) {

    'use strict';

    var s = {

            SEARCH_BOX: '[data-role="search"]'

        },
        defaultOptions = {

            requestKey: 0

        };

    function SearchBox() {

    };

    SearchBox.prototype.init = function (options) {

        this.o = $.extend(this, {}, defaultOptions, options);

        this.o.lang = Common.getLocale();

        this.initVariables();

        this.initComponents();

    };

    SearchBox.prototype.initVariables = function () {

        this.$CONTAINER = $(this.o.container);

        this.$SEARCH_BOX = this.$CONTAINER.find(s.SEARCH_BOX);

    };

    SearchBox.prototype.initComponents = function () {

        var self = this,
            suggestions = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,

            // hack for Bloodhound remote request
            remote: {
                url: '%QUERY',
                wildcard: '%QUERY',
                // escaping the url (this probably is not needed)
                /* prepare: function(d){
                    var q = _s.trim(d);
                    q  = encodeURIComponent(q);
                    //log.info("prepare", d, q);
                    return q;

                },*/
                transport: function (obj, onSuccess, onError) {

                    //log.info('SearchBox.initComponents; request', obj);

                    API.suggestions({
                        q: obj.url
                    }).then(function(d) {

                        var r = [];

                        _.each(d.data, function(v) {
                            r.push({
                                label: v.label,
                                type: i18nLabels[v.id]
                            });
                        });

                        onSuccess(r);
                        //return d.data;
                    }).fail(function(e) {
                        onError(e);
                    }).done();
                },
                filter: function (result) {
                    return result;
                }
            }
/*            remote: {
                url: 'http://fenixapps2.fao.org/api/v1.0/en/suggestions/%QUERY',
                wildcard: '%QUERY',
                filter: function (result) {
                    return result.data;
                }
            }*/
        });

        // adding query value if needed
        if ( this.o.query) {
            this.$SEARCH_BOX.val(decodeURIComponent(this.o.query));
            //this.$SEARCH_BOX.val(decodeURI(this.o.query));
        }

        this.$SEARCH_BOX.typeahead({
                hint: true,
                highlight: true,
                minLength: 3
            },
            {
                name: 'suggestions',
                source: suggestions,
                display: 'label',
                limit: 100,
                templates: {
                    empty: '<p class="text-capitalize" style="padding:5px 0 0 5px;font-size:12px;">' + i18nLabels.no_data_available + '</p>',
                    suggestion: Handlebars.compile('<p>{{label}} {{#if type}}<small>({{type}})</small>{{/if}}</p>')
                }
            }).on('typeahead:selected', function (e, d) {

                log.info("SearchBox.typeahead", e, d);

                self.$SEARCH_BOX.typeahead('close');

                self.callback.searchQuery(d.label);

            }).keyup(function (e) {

                if (e.keyCode === 13) {

                    if (e.target && e.target.value && e.target.value !== '') {

                        self.$SEARCH_BOX.typeahead('close');

                        self.callback.searchQuery(e.target.value);

                    }

                }
            });

    };

    SearchBox.prototype.emptySearchBox = function () {

        this.$SEARCH_BOX.typeahead('val', '');

    };

    return SearchBox;
});
