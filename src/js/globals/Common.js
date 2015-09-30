/*global define*/
define(['chaplin', 'amplify'], function (Chaplin) {

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

            var uri = Chaplin.utils.reverse(
                name, options
            );

            // add language
            uri = this.updateQueryStringParameter(uri, 'locale', this.getLocale());

            // TODO: Use Chaplin 'route' function
            console.warn('TODO: change Backbone binding');
            Backbone.history.navigate(uri, {trigger:false});
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

    Common.prototype.changeURLLanguage = function() {
        var locale = (this.lang !== DEFAULT_LANGUAGE)? this.lang: undefined;
        console.log(this.lang);
        return this.lang;
        //return (this.lang !== DEFAULT_LANGUAGE)? this.lang: undefined;
        //return (amplify.store('locale') !== DEFAULT_LANGUAGE)? amplify.store('locale'): undefined;
    };

    Common.prototype.updateQueryStringParameter = function(uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        console.log(uri, key, value);
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
