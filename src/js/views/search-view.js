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
    'i18n!nls/search',
    'underscore',
    'amplify'
], function ($,
             log,
             View,
             C,
             E,
             Common,
             template,
             i18nLabels,
             _
){

    'use strict';

    var s = {


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

            log.info(this.o);

            $.ajax({
                url: "http://fenixapps2.fao.org/api/v1.0/en/search/" + query,
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

                    log.info(cluster)

                }

            });


            log.info(cluster)

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
