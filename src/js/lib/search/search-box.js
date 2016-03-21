/*global define, _:false, $, console, amplify, FM, unescape, escape */
define([
    'jquery',
    'loglevel',
    'config/Config',
    'config/Events',
    'globals/Common',
    'typeahead',
    'bloodhound',
    'handlebars',
    'underscore',
    'faostatapiclient',
    'amplify'
], function ($, log, C, E, Common, typeahead, Bloodhound, Handlebars, _, FAOSTATAPIClient) {

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

        this.api = new FAOSTATAPIClient();

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
                transport: function (obj, onSuccess, onError) {

                    log.info('SearchBox.prototype.initComponents; request', obj);

                    self.api.suggestions({
                        datasource: C.DATASOURCE,
                        lang: self.o.lang,
                        q: obj.url
                    }).then(function(d) {
                        onSuccess(d.data);
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
                    empty: 'No data',
                    suggestion: Handlebars.compile('<p>{{label}} <small>({{id}})</small></p>')
                }
            }).on('typeahead:selected', function (e, d) {
                log.info(e, d);

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

    /*SearchBox.prototype.initComponentsBK = function () {


        var self = this;

        var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
            'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
            'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
            'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
            'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
            'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
            'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
            'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
            'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
        ];

        var search = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            // `states` is an array of state names defined in "The Basics"
            local: states

        });

        this.$SEARCH_BOX.typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            },
            {
                name: 'states',
                source: states
            });

    };*/

    return SearchBox;
});
