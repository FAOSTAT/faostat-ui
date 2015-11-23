/*global define, requirejs*/
define([
    'handlebars',
    'underscore',
    'chaplin',
    'globals/Common',
], function (Handlebars, _, Chaplin, Common) {

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
            return keyword;
        }

    });

    utils.getLabel = function (obj) {
        var lang = Common.getLocale();
        return obj[lang.toUpperCase()] || obj[lang.toLowerCase];
    };

    return utils;
});
