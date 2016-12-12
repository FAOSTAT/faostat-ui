/*global define*/
define([
    'jquery',
    'globals/Common',
    'require',
    'loglevel',
    'handlebars',
    'i18n!nls/common',
    'text!lib/common/templates/modal.hbs',
    'underscore.string'
], function ($,
             Common,
             Require,
             log,
             Handlebars,
             i18nLabels,
             templates,
             _s
) {

    'use strict';
    
    var s = {
        MODAL: '#fs-modal',
        CONTAINER: '[data-role="content"]'
    };

    // TODO: there should be a template
    function Modal() {

        return this;
    }

    Modal.prototype._initModal = function (config) {

        // remove old modal if still exists.
        // TODO: this could be a memory leak because it is not removed the instance.
        $(s.MODAL).remove();

        var c = config || {},
            title = c.title || "",
            html = $(templates).filter(s.MODAL).html(),
            t = Handlebars.compile(html);

        $('body').append(t({
            title: title,
            close: _s.capitalize(i18nLabels.close)
        }));

        this._removeFullScreen();

        if(c.hasOwnProperty('fullscreen') && c.fullscreen) {
            this._addFullScreen();
        }

        return $(s.MODAL);

    };

    Modal.prototype._removeFullScreen = function() {

        $(s.MODAL).removeClass('modal-fullscreen');

    };

    Modal.prototype._addFullScreen = function() {

        $(s.MODAL).addClass('modal-fullscreen');

    };


    Modal.prototype.definitions_domain = function (obj) {

        log.info("Modal.definitions_domain;", obj);

        var self = this,
            code = obj.code,
            label = obj.label;

        Require(['lib/definition_domain/definition_domain'], function(DefinitionDomain) {

            // TODO: in theory could be a singleton
            var $MODAL = self._initModal({
                    title: '<i class="material-icons left">subject</i>' + i18nLabels.definitions_and_standards + ' - ' + label,
                    fullscreen: true
                }),
                $CONTAINER = $MODAL.find(s.CONTAINER),

                // TODO: view_glossary could be global instead of being
                definitionDomain = new DefinitionDomain();

            log.info(definitionDomain);

            definitionDomain.render({
                container: $CONTAINER,
                //label: label,
                code: code,
                table: {
                   // height: ((window.innerHeight - 450) < 250)? '250' : (window.innerHeight - 450).toString()
                    height: '600'
                }
            });

            // show modal
            $MODAL.modal({keyboard: true});

            // destroy event listener on the modal and dispose the view
            $MODAL.on('hidden.bs.modal', function () {
                $MODAL.off('hidden.bs.modal');
                definitionDomain.destroy();
            });

        });

    };

    Modal.prototype.showMetadata = function(obj) {

        Require([ 'fs-m-v/start'], function(MetadataViewer) {
            if (!obj.hasOwnProperty('code')) {
                log.error('Code is not passed in the options', obj);
            }
            else {

                var metadataViewer = new MetadataViewer($.extend(true, {},
                    {
                        modal: true,
                        label: obj.label || null,
                        addHeaders: false,
                        lang: Common.getLocale()
                    },
                    obj)
                );

                metadataViewer.render();
            }

        });

    };

    return new Modal();

});