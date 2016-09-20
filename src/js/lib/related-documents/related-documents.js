/*global define, _:false, $, amplify, FM */
define([
    'jquery',
    'loglevel',
    'config/Config',
    'config/Events',
    'config/Analytics',
    'text!lib/related-documents/templates/templates.hbs',
    'i18n!nls/common',
    'handlebars',
    'faostatapiclient',
    'underscore',
    'amplify'
], function ($, log, C, E, A, templates, i18nLabels, Handlebars, API, _) {

    'use strict';

    var s = {

        },

        defaultOptions = {

        };

    function RelatedDocuments() {
        return this;
    }

    RelatedDocuments.prototype.render = function (options) {

        //log.info("RelatedDocuments.render", options);

        this.o = $.extend(true, {}, defaultOptions, options);

        this._initVariables();

        this._configurePage();

    };

    RelatedDocuments.prototype._initVariables = function () {

        this.$CONTAINER = $(this.o.container);

    };

    RelatedDocuments.prototype._configurePage = function() {

        /* Query DB for available files. */
        API.documents({
            domain_code: this.o.code
        }).then(_.bind(this._show, this));

    };

    RelatedDocuments.prototype._show = function(d) {

        var data = d.data,
            documents = [];

        _.each(data, function(v) {

            log.info(v);

            if (v.FileTitle !== 'About') {

                documents.push({
                    FileName: v.FileName,
                    FileTitle: v.FileTitle,
                    FileContent: v.FileContent,
                    base_url: C.URL_FAOSTAT_DOCUMENTS_BASEPATH
                });

            }

        });

        /* Load main structure. */
        var t = Handlebars.compile($(templates).filter("#template").html());
        this.$CONTAINER.html(t({
            no_docs_available: i18nLabels.no_docs_available,
            documents: documents
        }));

        // tracking google anlytics documents
        this.$CONTAINER.find('a').on('click', function(e) {

            amplify.publish(E.GOOGLE_ANALYTICS_EVENT, {
                category: A.documents.download.category,
                action: A.documents.download.action,
                label: $(e.target).data('filename')
            });

        });
    };

    RelatedDocuments.prototype.destroy = function () {

        //log.info("RelatedDocuments.destroy;");

        // destroy all filters
        if (this.$CONTAINER !== undefined) {
            this.$CONTAINER.empty();
        }

    };

    return RelatedDocuments;
});
