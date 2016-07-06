/*global define*/
define([
    'jquery',
    'require',
    'loglevel',
    'handlebars',
    'i18n!nls/common',
    'text!lib/common/templates/modal.hbs'
    //'views/standards-glossary-view'
], function ($,
             Require,
             log,
             Handlebars,
             i18nLabels,
             templates) {
             //GlossaryView) {

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

        var c = config || {},
            title = c.title || "",
            html = $(templates).filter(s.MODAL).html(),
            t = Handlebars.compile(html);

        $('body').append(t({
            title: title,
            close: i18nLabels.close
        }));

        return $(s.MODAL);

    };

    Modal.prototype.glossary = function () {

        var self = this;


        Require('views/standards-glossary-view', function(GlossaryView) {

            // TODO: in theory could be a singleton
            var $MODAL = self._initModal({
                    title: i18nLabels.glossary
                }),
                $CONTAINER = $MODAL.find(s.CONTAINER),

            // TODO: view_glossary could be global instead of being
                view_glossary = new GlossaryView({
                    table: {
                        height: 300
                    }
                });

            $CONTAINER.html(view_glossary.$el);

            // show modal
            $MODAL.modal('show');

            // destroy event listener on the modal and dispose the view
            $MODAL.on('hidden.bs.modal', function () {
                $MODAL.off('hidden.bs.modal');
                view_glossary.dispose();
            });

        });

    };

    return new Modal();
});