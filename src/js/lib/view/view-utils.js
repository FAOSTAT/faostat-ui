/*global define, _:false, amplify, FM*/
define([
    'jquery',
    'config/Config',
    'globals/Common',
    'config/Events',
    'config/Analytics',
    'text!templates/browse/related_views.hbs',
    'handlebars',
    'underscore',
    'loglevel',
    'amplify'
], function ($, C, Common, E, A, templateRelatedViews, Handlebars, _, log) {

    'use strict';

    function ViewUtils() {

        return this;
    }

    // TODO: legacy not used
    ViewUtils.prototype.defaultFilterOptions = function(config) {
        return config;
    };

    // i.e. defaut custom option on a map
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
                // TODO: check if this is set
                view.comment.url = C.PDF_BASEPATH + lang.toUpperCase() + "/" + view.comment.pdf;
            }
        }

        return view;

    };

    ViewUtils.prototype.addRelatedViews = function($container, view, callback) {

       // log.info("ViewUtils.addRelatedViews;", $container, view);
        var t = Handlebars.compile(templateRelatedViews);

        if ($container !== undefined && $container !== null) {
            $container.html(t({relatedViews: view.relatedViews}));

            $container.find('[data-role="related-view"]').off();
            $container.find('[data-role="related-view"]').on('click', function (e) {

                var viewID = $(this).data("view");

                //log.info("ViewUtils.addRelatedViews; click", viewID);

                amplify.publish(E.GOOGLE_ANALYTICS_EVENT,
                   $.extend(true, {}, A.browse_by_domain.selection_tab, {
                       label: viewID
                   })
                );

                callback({
                    viewID: viewID,
                    updatedRelatedViews: false
                });

            });
        }else {
            log.warn("ViewUtils.addRelatedViews; not applied. $container not valid:  ", $container);
        }

    };

    return new ViewUtils();
});
