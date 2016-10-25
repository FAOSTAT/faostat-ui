/*global define, Backbone, amplify, window*/
define(['chaplin',
        'config/Events',
        'loglevel',
        'nprogress',
        'underscore.string',
        'amplify'
    ],
    function (Chaplin, E, log, NProgress, _s) {

        'use strict';

        // IMPORTANT! this used just to check the locale query parameter
        var DEFAULT_LANGUAGE = 'en';

        function Common() {

            this.lang = DEFAULT_LANGUAGE;

            return this;
        }

        Common.prototype.changeURL = function (name, options, reload) {

            NProgress.start();

            var reload = reload || false;

            log.info("Common.changeURL;", name, options, reload);

            //if (reload) {
            // TODO: is it enough the Backbone trigger?
            if (false) {

                // TODO: how to handle?

            }else {

                var uri = this.getURI(name, options);

                // TODO: Use Chaplin 'route' function
                //console.warn('TODO Common.changeURL: change Backbone binding');
                //console.warn('TODO Common.changeURL: check if the Backbone trigger should be set on true or false');

                //# TODO: if trigger should be set on false or true and the difference
                //Backbone.history.navigate(uri, {trigger: false});
                Backbone.history.navigate(uri, {trigger: true});

                // Google Analytics change page
                log.info("Common.changeURL; google analytics page_view");
                amplify.publish(E.GOOGLE_ANALYTICS_PAGE_VIEW, {});
            }
        };

        Common.prototype.getURI = function (name, options) {

            options = options || [];

            log.info("Common.getURI;", name, options);

            try {
                // add as first element the language
                //options.unshift(this.getLocale());

                var uri = Chaplin.utils.reverse(
                    name, options
                );
            }
            catch(e) {
                log.error("Common.getURI;", e);
                return null;
            }

            return uri;
        };

        Common.prototype.setLocale = function(lang) {
            this.lang = lang;
            this.setLocaleAPI(lang);
            return this.lang;
        };

        Common.prototype.getLocale = function() {
            return this.lang;
        };

        Common.prototype.setLocaleAPI = function(lang) {
            //this.langAPI = (lang === 'en' || lang === 'fr' || lang === 'es')? lang : 'en';
            this.langAPI = lang;
            return this.langAPI;
        };

        Common.prototype.getLocaleAPI = function() {
            return this.langAPI;
        };

        // TODO: Handle better the change of language
        Common.prototype.changeURLLanguageOLD = function(lang) {
            var uri = window.location.href;
            uri = uri.replace('#' + this.getLocale() + "/", '#' + lang + "/");
            this.setLocale(lang);
            window.location.replace(uri);
            window.location.reload();
        };

        Common.prototype.changeURLLanguage = function(lang) {
            var uri = window.location.href;
            uri = uri.replace('/' + this.getLocale(), '/' + lang);
            this.setLocale(lang);
            log.info("Common.changeURLLanguage", uri, lang);
            window.location.replace(uri);
            window.location = uri;
        };

        Common.prototype.updateQueryStringParameter = function(uri, key, value) {
            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i"),
                separator = uri.indexOf('?') !== -1 ? "&" : "?";

            if (value) {
                if (uri.match(re)) {
                    return uri.replace(re, '$1' + key + "=" + value + '$2');
                }

                return uri + separator + key + "=" + value;

            }
            return uri;
        };

        Common.prototype.updatePageTitle = function() {

            /*var hash = window.location.hash,
             locale = this.getLocale(),
             title = _s.replaceAll(hash, "#" + locale, ''),
             title = _s.replaceAll(title, '/', ' '),
             title = _s.humanize(title);


             if ( !_s.contains(title, 'home')) {
             document.title = 'FAOSTAT - ' + title;
             }else {
             document.title = 'FAOSTAT';
             }*/

        };

        // getting current page
        Common.prototype.getCurrentUrl = function () {
            return Backbone.history.getFragment();
        };

        return new Common();

    });