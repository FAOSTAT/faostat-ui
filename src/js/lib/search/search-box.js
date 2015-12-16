/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'config/Events',
    'globals/Common',
    'typeahead',
    'bloodhound',
    'amplify'
], function ($, log, E, Common, typeahead, Bloodhound) {

    'use strict';

    var s = {

        SEARCH_BOX: '[data-role="search"]'

    },
    defaultOptions = {
            requestKey: 0
    };

    function SearchBox(options) {
    }


    SearchBox.prototype.init = function(options) {

        this.o = $.extend(this, {}, defaultOptions, options);

        this.initVariables();

        this.initComponents();

    };


    SearchBox.prototype.initVariables = function () {

        this.$CONTAINER = $(this.o.container);

        this.$SEARCH_BOX = this.$CONTAINER.find(s.SEARCH_BOX);

    };

    SearchBox.prototype.initComponents = function () {


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


        var states = new Bloodhound({
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
