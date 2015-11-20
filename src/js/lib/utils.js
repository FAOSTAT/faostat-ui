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
            return keyword;
        }

    });

    Handlebars.registerHelper("list_countries_creator", function(array) {

        var countries = array,
            result = '',
            firstDone = false,
            secondDone = false;

        if (typeof keyword === 'array') {

            _.each(array, function(v, index) {

            });

        }

        var countries = array,
            result = '',
            firstDone = false,
            secondDone = false;



        for(var i = 0, length = countries.length; i<length; i++) {
            // first
            if(i===0 || i %3 ===0){
                //result+= '<div>';
                result += '<div class="col-md-4 country-item">' +
                    '<a href="profile/'+countries[i].code+'">'
                    + countries[i].label + '</a></div>';
                firstDone = true;
            }else if(i===1 || firstDone) {
                result += '<div class="col-md-4 country-item">' +
                     '<a href="profile/'+countries[i].code+'">'
                     + countries[i].label +'</a></div>';
                firstDone = false;
                secondDone  =true;
            }else if (i===2 || secondDone) {
                result += '<div class="col-md-4 country-item">' +
                     '<a href="profile/'+countries[i].code+'">'
                    + countries[i].label + '</a></div>';
                secondDone  =false;
            }
        }
        /* if(length%3 !== 0) {
         result+= '</div>';
         }*/
        log.info(result)
        return new Handlebars.SafeString(result);

    });

    utils.getLabel = function (obj) {
        var lang = Common.getLocale();
        return obj[lang.toUpperCase()] || obj[lang.toLowerCase];
    };

    return utils;
});
