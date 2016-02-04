/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'config/Events',
    'globals/Common',
    'typeahead',
    'bloodhound',
    'handlebars',
    'underscore',
    'amplify'
], function ($, log, E, Common, typeahead, Bloodhound, Handlebars, _) {

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
            // `states` is an array of state names defined in "The Basics"
            remote: {
                url: 'http://fenixapps2.fao.org/api/v1.0/en/suggestions/%QUERY',
                wildcard: '%QUERY',
                filter: function (result) {
                    return result.data;
                }
            }
        });

        this.$SEARCH_BOX.typeahead({
                hint: true,
                highlight: true,
                minLength: 3

            },
            {
                name: 'suggestions',
                source: suggestions,
                display: 'label',
                limit: 1000,
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

                        log.info(e.target.value);

                        self.$SEARCH_BOX.typeahead('close');

                        self.callback.searchQuery(e.target.value);

                    }

                }
            });

        if ( this.o.query) {
            this.$SEARCH_BOX.typeahead('val', unescape(this.o.query));
        }

    };

    SearchBox.prototype.initComponentsBK = function () {


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


    };

    return SearchBox;
});
