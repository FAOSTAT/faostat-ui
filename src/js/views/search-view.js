/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
define([
    'jquery',
    'loglevel',
    'views/base/view',
    'config/Config',
    'config/Events',
    'globals/Common',
    'text!templates/search/search.hbs',
    'text!templates/search/search_results.hbs',
    'i18n!nls/search',
    'underscore',
    'handlebars',
    'amplify'
], function ($,
             log,
             View,
             C,
             E,
             Common,
             template,
             templateResults,
             i18nLabels,
             _,
             Handlebars
){

    'use strict';

    var s = {

        SEARCH_RESULTS: '[data-role="search_results"]'

    },
    SearchView = View.extend({

        autoRender: true,

        className: 'search',

        template: template,

        initialize: function (options) {
            this.o = $.extend(true, {}, options);
        },

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            /* Update State. */
            amplify.publish(E.STATE_CHANGE, {search: 'search'});

            this.initVariables();

            this.initComponents();

            this.configurePage();

            this.bindEventListeners();

        },

        initVariables: function () {

            var query = this.o.query,
                self = this;

            this.$SEARCH_RESULTS = this.$el.find(s.SEARCH_RESULTS);

            log.info(this.o);

            $.ajax({
                //url: "http://fenixapps2.fao.org/api/v1.0/en/search/" + query,
                url: "http://localhost:8081/api/v1.0/en/search/" + query,
                success: function(result) {
                    self.parseSearchResults(result);
                }
            });

        },

        parseSearchResults: function(results) {

            log.info(results)

            // cluster results
            var cluster = [],
                values = results.data,
                relatedValues = [];

            _.each(values, function(v) {

                if ( $.inArray( v, relatedValues ) === -1 ) {

                    log.info(v.label)

                    var domainCode = v.domainCode,
                        id = v.id,
                        relations = [];


                    // check if a relation exists
                    _.each(values, function(d) {

                        if (d.domainCode === domainCode && d.id !== id) {

                            relations.push(d);

                            relatedValues.push(d);

                        }

                    });

                    cluster.push($.extend(true, {}, v, {relations: relations}));
                }

            });

            this.renderResults(cluster);

        },

        renderResults: function (cluster) {

            log.info(cluster)

            var t = Handlebars.compile(templateResults),
                d = {
                    data: cluster
                },
                html = t(d);

            this.$SEARCH_RESULTS.html(html);

        },


        initComponents: function () {

        },

        configurePage: function () {

        },

        bindEventListeners: function () {

        },

        unbindEventListeners: function () {

        },

        dispose: function () {

        }
    });

    return SearchView;

});
