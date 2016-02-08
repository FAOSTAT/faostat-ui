/*global define, _:false, amplify, FM*/
define([
    'jquery',
    'config/Config',
    'globals/Common',
    'config/Events',
    'text!lib/metadata/templates/template.hbs',
    'handlebars',
    'underscore',
    'loglevel',
    'fs-m-v/start',
    'amplify'
], function ($, C, Common, E, template, Handlebars, _, log, MetadataViewer) {

    'use strict';

    var s = {

        CONTAINER: '#fs-metadata-modal',
        METADATA_CONTAINER: '[data-role="metadata"]'

    },defaultOptions = {

    };

    function Metadata() {

        return this;
    }

    Metadata.prototype.show = function (options) {

        log.info(options);

        this.o = $.extend(true, {}, defaultOptions, options);

        // init lang
        this.o.lang = Common.getLocale();

        var t = Handlebars.compile(template);


        this.$MODAL = $(s.CONTAINER);

        log.info(this.$MODAL.length)

        if (this.$MODAL.length <= 0) {
            $('body').append(t({
                // TODO: add labels
            }));

            this.$MODAL = $(s.CONTAINER);
            log.info(this.$MODAL.length)

            this.$METADATA = this.$MODAL.find(s.METADATA_CONTAINER);

            log.info(this.$METADATA.length);

            this.metadataViewer = new MetadataViewer();
            this.metadataViewer.init({
                container: this.$METADATA,
                domain: this.o.domain,
                lang: Common.getLocale(),
                url_get_metadata: C.URL_METADATA_MODEL,
                url_get_domain: C.URL_METADATA_DOMAIN,
                addHeader: false
            });

            this.$MODAL.modal('show');
        }


    };

    return new Metadata();
});
