/*global define*/
define([
    'jquery',
    'loglevel',
    'handlebars',
    'i18n!nls/common',
    'text!lib/common/templates/modal.hbs',
    'views/standards-glossary-view'
], function ($,
             log,
             Handlebars,
             i18nLabels,
             templates,
             GlossaryView) {

    'use strict';
    
    var s = {
        MODAL: '#fs-modal',
        CONTAINER: '[data-role="content"]'
    }

    // TODO: there should be a template
    function Modal() {

        return this;
    }

    Modal.prototype._initModal = function (config) {

        var config = config || {},
            title = config.title || "";

        this.$MODAL = $(s.MODAL);

        // initialize modal template if doesn't exists
        if (this.$MODAL.length <= 0) {

            var html = $(templates).filter('#fs-modal').html(),
                t = Handlebars.compile(html);

            $('body').append(t({
                title: title
            }));

            this.$MODAL = $(s.MODAL);

        }

        this.$CONTAINER = this.$MODAL.find(s.CONTAINER);
    };

    Modal.prototype.glossary = function () {

        this._initModal({
            title:  i18nLabels.glossary
        });

        this.view_glossary = new GlossaryView();
        this.$CONTAINER.html(this.view_glossary.$el);

        // show modal
        this.$MODAL.modal('show');


    };

    return new Modal();
});