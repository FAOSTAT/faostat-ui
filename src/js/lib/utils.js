/*global define, requirejs*/
define([
    'handlebars',
    'underscore',
    'chaplin'
], function (Handlebars, _, Chaplin) {

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

    Handlebars.registerHelper('isI18n', function (keyword) {

        if (typeof keyword === 'object') {

            var lang = requirejs.s.contexts._.config.i18n.locale;
            return keyword[lang.toUpperCase()];
        }
        else {
            return keyword;
        }
    });

    Handlebars.registerHelper('i18n', function (keyword) {

        var lang = requirejs.s.contexts._.config.i18n.locale;

        return keyword[lang.toUpperCase()];
    });

    utils.getLabel = function (obj) {
        return obj[requirejs.s.contexts._.config.i18n.locale.toUpperCase()];
    };
    

    return utils;
});
