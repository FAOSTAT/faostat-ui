/*global define, requirejs*/
define([
    'loglevel',
    'handlebars',
    'underscore',
    'chaplin',
    'globals/Common',
], function (log, Handlebars, _, Chaplin, Common) {

    'use strict';

    // Application-specific utilities
    // ------------------------------

    // Delegate to Chaplin’s utils module
    var utils = Chaplin.utils.beget(Chaplin.utils);

    // Add additional application-specific properties and methods

    // _(utils).extend({
    //   someProperty: 'foo',
    //   someMethod: function() {}
    // });

    // TODO: isI18N and i18n are the same!
    Handlebars.registerHelper('isI18n', function (keyword) {

        if (typeof keyword === 'object') {

            // TODO: in theory should be requirejs.s.contexts._.config.locale?
            var lang = Common.getLocale();
            return keyword[lang.toUpperCase()] || keyword[lang.toLowerCase()];

        }
        else {
            return keyword;
        }
    });

    Handlebars.registerHelper('i18n', function (keyword) {

        if (typeof keyword === 'object') {

            // TODO: in theory should be requirejs.s.contexts._.config.locale?
            var lang = Common.getLocale();

            return keyword[lang.toUpperCase()] || keyword[lang.toLowerCase()];

        }
        else {
            //log.info(keyword)
            return keyword;
        }

    });

    // TODO: quick fix for aggregations
    Handlebars.registerHelper('isMultipleYears', function() {

        // TODO: in general could be simplified
        var args = [],
            options = arguments[arguments.length - 1];

        for (var i = 0; i < arguments.length - 1; i++) {
            args.push(arguments[i]);
        }

        //log.info("-----------------------");
        //log.info(context, options);
        //log.info(args);

        // years
        if ( args.length === 2 ) {
            if (args[0].length > 4) {
                // aggregation
                return args[1] + " " || "";
            } else {
                return "";
            }
        } else {
            log.error("Utils.Handlebars.registerHelper.isMultipleYears; Helper is not set properly. Args passed are", args);
            log.error("i.e. setting {{#isMultipleYears year aggregation}}");
            log.error("Utils.Handlebars.registerHelper.isMultipleYears; Returning an empty String.");
        }
        return "";

    });

    Handlebars.registerHelper('calculateYears', function() {

        return "";

    });

    utils.getLabel = function (obj) {
        var lang = Common.getLocale();
        return obj[lang.toUpperCase()] || obj[lang.toLowerCase];
    };

    return utils;
});
