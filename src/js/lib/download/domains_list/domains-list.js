/*global define, _:false, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'config/Config',
    'globals/Common',
    'text!lib/download/domains_list/templates/template.hbs',
    'faostatapiclient',
    'handlebars',
    'underscore'
], function ($, log, C, Common, template, API, Handlebars, _) {

    'use strict';

    var defaultOptions = {

        //code: '',
        //section_description: '',
        //section: ''

    };

    function DOMAINS_LIST() {

        return this;
    }

    DOMAINS_LIST.prototype.init = function (options) {

        this.o = $.extend(true, {}, defaultOptions, options);

        // store container variable
        this.$CONTAINER = $(this.o.container);

        this.initComponents();

    };

    DOMAINS_LIST.prototype.initComponents = function () {

        var self = this;

        /* Fetch domains by group code. */
        API.domains({
            group_code: this.o.code
        }).then(function (response) {

            var links = [];

            _.each(response.data, function(d) {

                links.push({
                    label: d.label,
                    link: Common.getURI(self.o.section, [d.code])
                });

            });

            self.render(links);

        });

    };

    DOMAINS_LIST.prototype.render = function (links) {

        var t = Handlebars.compile(template),
            c = $.extend(true, {}, {
                section_description: this.o.section_description,
                links: links
            });

        this.$CONTAINER.html(t(c));

    };

    DOMAINS_LIST.prototype.dispose = function () {

       this.$CONTAINER.empty();

    };

    return DOMAINS_LIST;
});
