/*global define, $, */
define([
    'jquery',
    'loglevel',
    'i18n!nls/common',
    'handlebars',
    'underscore',
    'underscore.string'
], function ($, log, i18nLabels, Handlebars, _, _s) {

    'use strict';

    var s = {
            SHOW_MORE: "[data-role='show']",
            TEXT: "[data-role='text']"
        },

        //TODO: move the templates to templates if needed
        template = '<div> <span data-role="text">{{{text}}}</span> <a href="javascript:void(0)" class="text-capitalize" style="display:none" data-state="full" data-role="show">{{show_more}}</a></div>',

        defaultOptions = {
            text: "",
            length: 10000
        };

    function TextWrapper() {
        return this;
    }

    TextWrapper.prototype.render = function (o) {

        this.o = $.extend({}, true, defaultOptions, o);

        if ( this.o.hasOwnProperty("container")) {

            this.$CONTAINER = $(this.o.container);

            this._renderTemplate();

        }else {
            log.error("TextWrapper.render; o.container is", o.container);
        }

        return this;

    };

    TextWrapper.prototype._renderTemplate = function () {

        var text = this.o.text,
            length = this.o.length;

        this.o.shortText = _s.prune(text, length);

        this.$CONTAINER.html(Handlebars.compile(template)({
            show_more: i18nLabels.show_more,
            text: this.o.shortText
        }));

        this.$DESCRIPTION = this.$CONTAINER.find(s.TEXT);
        this.$SHOW_MORE = this.$CONTAINER.find(s.SHOW_MORE);

        this._enableShowHide();

    };

    TextWrapper.prototype._enableShowHide = function () {

        var text = this.o.text,
            shortText = this.o.shortText;

        if (text !== shortText) {
            this.$SHOW_MORE.data("state", "short");
            this.$SHOW_MORE.show();
            this.$SHOW_MORE.off();
            this.$SHOW_MORE.on('click', _.bind(this._showHide, this));
        }

    };

    TextWrapper.prototype._showHide = function () {

        var text = this.o.text,
            shortText = this.o.shortText;

        // show/hide text
        if (this.$SHOW_MORE.data("state") === 'full') {
            this.$SHOW_MORE.data("state", "short");
            this.$DESCRIPTION.html(shortText);
            this.$SHOW_MORE.html(i18nLabels.show_more);
        }
        else if (this.$SHOW_MORE.data("state") === 'short') {
            this.$SHOW_MORE.data("state", "full");
            this.$DESCRIPTION.html(text);
            this.$SHOW_MORE.html(i18nLabels.show_less);
        }

    };

    return TextWrapper;
    
});
