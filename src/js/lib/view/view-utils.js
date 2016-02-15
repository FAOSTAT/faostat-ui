/*global define, _:false, amplify, FM*/
define([
    'jquery',
    'config/Config',
    'globals/Common',
    'config/Events',
    'text!templates/browse/related_views.hbs',
    'handlebars',
    'underscore',
    'loglevel',
    'select2',
    'amplify'
], function ($, C, Common, E, templateRelatedViews, Handlebars, _, log) {

    'use strict';

    function ViewUtils() {

        return this;
    }

    ViewUtils.prototype.defaultFilterOptions = function(config) {

        return $.extend(
            true,
            {},
            config,
            {
                lang: Common.getLocale(),
                datasource: C.DATASOURCE
            }
        );

    };

    ViewUtils.prototype.defaultItemOptions = function(item, CustomView) {

        if (item.type) {
            if (CustomView && CustomView.hasOwnProperty(item.type) && item.hasOwnProperty('config')) {
                return $.extend(true, {}, CustomView[item.type] || {}, item.config);
            }
        }

        return item.config || {};

    };


    ViewUtils.prototype.setDashboardComment = function(view) {

        var lang = Common.getLocale();

        //comment
        if (view.hasOwnProperty('comment')) {
            // TODO: switch to handlebars helpers with language
            if (view.comment.hasOwnProperty('text')) {
                view.comment.text = view.comment.text[lang] || view.comment.text;
            }
            if (view.comment.hasOwnProperty('pdf')) {
                view.comment.url = C.PDF_BASEPATH + lang.toUpperCase() + "/" + view.comment.pdf;
            }
        }

    };

    ViewUtils.prototype.addRelatedViews = function($container, view, callback) {

        log.info("ViewUtils.addRelatedViews;", $container, view);

        if ($container !== undefined && $container !== null) {
            var t = Handlebars.compile(templateRelatedViews);
            $container.html(t({relatedViews: view.relatedViews}));

            $container.find('.nav-tabs').on('click', _.bind(function (e) {
                var viewID = $(e.target).data("view");

                callback({
                    viewID: viewID,
                    updatedRelatedViews: false
                });

            }, this));
        }else {
            log.warn("ViewUtils.addRelatedViews; not applied. $container not valid:  ", $container);
        }

    };

    return new ViewUtils();
});
