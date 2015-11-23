/*global define*/
define(['chaplin', 'config/Events', 'amplify'], function (Chaplin, E) {

    'use strict';

    // IMPORTANT! this used just to check the locale query parameter
    var DEFAULT_LANGUAGE = 'en';

    function Common() {

        this.lang = DEFAULT_LANGUAGE;

        return this;
    }

    Common.prototype.changeURL = function (name, options, reload) {

        var reload = reload || false;

        if (reload) {

            // TODO: how to handle?

        }else {

            // add as first element the language
            options.unshift(this.getLocale());

            var uri = Chaplin.utils.reverse(
                name, options
            );

            // add language (@Deprecated)
            //uri = this.updateQueryStringParameter(uri, 'locale', this.getLocale());

            console.log(uri);

            // TODO: Use Chaplin 'route' function
            console.warn('TODO Common.changeURL: change Backbone binding');
            console.warn('TODO Common.changeURL: check if the Backbone trigger should be set on true or false');
            //# TODO: if trigger should be set on false or true and the difference
            Backbone.history.navigate(uri, {trigger:false});

            // Google Analytics change page
            amplify.publish(E.GOOGLE_ANALYTICS_PAGE_VIEW, {});
        }
    };

    Common.prototype.setLocale = function(lang) {
        this.lang = lang;
        return this.lang;
    };

    Common.prototype.getLocale = function() {
        return this.lang;
        //return (this.lang !== DEFAULT_LANGUAGE)? this.lang: undefined;
        //return (amplify.store('locale') !== DEFAULT_LANGUAGE)? amplify.store('locale'): undefined;
    };

/*
    Common.prototype.changeURLLanguage = function() {
        var locale = (this.lang !== DEFAULT_LANGUAGE)? this.lang: undefined;
        return this.lang;
        //return (this.lang !== DEFAULT_LANGUAGE)? this.lang: undefined;
        //return (amplify.store('locale') !== DEFAULT_LANGUAGE)? amplify.store('locale'): undefined;
    };
*/

    // TODO: Handle better the change of language
    Common.prototype.changeURLLanguage = function(lang) {
        var uri = window.location.href;
        uri = uri.replace('#' + this.getLocale() + "/", '#' + lang + "/");
        this.setLocale(lang)
        window.location.replace(uri);
        window.location.reload();
    },

    Common.prototype.updateQueryStringParameter = function(uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (value) {
            if (uri.match(re)) {
                return uri.replace(re, '$1' + key + "=" + value + '$2');
            }
            else {
                return uri + separator + key + "=" + value;
            }
        }
        return uri;
    };

    return new Common();

});
