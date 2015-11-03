define([
    'jquery',
    'i18n!nls/common'
], function ($, i18nLabels) {

    'use strict';

    // TODO: there should be a template
    var size = '2x',
        id = "fs-loading",
        label = i18nLabels.loading,
        renderType = 'append', //or 'prepend'
        showLabel = false;


    function Loading() {

        return this;
    }

    Loading.prototype.show = function (data) {

        // TODO: add additional css parameter style?
        // TODO: check on container if is it valid

        var s = data.size || size,
            sl = data.showLabel || showLabel,
            l = data.label || label,
            rt = data.renderType || renderType,
            $c = $(data.container);

        if (rt === 'append') {
            $c.append('<div id="' + id + '"></div>');
        }
        else if (rt === 'prepend') {
            $c.prepend('<div id="' + id +'"></div>').find('#' + id);
        }

        $c.find('#' + id).append('<i class="fa fa-refresh fa-spin fa-' + s + '"></i>  ');

        if (sl) {
            $c.find('#' + id).append('<span>' + l + '</span>');
        }

    },

    Loading.prototype.hide = function (data) {

        $(data.container).find('#' + id).empty();

    };

    return new Loading();
});
