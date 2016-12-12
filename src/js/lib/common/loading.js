/*global define*/
define([
    'jquery',
    'loglevel',
    'i18n!nls/common'
], function ($, log, i18nLabels) {

    'use strict';

    // TODO: there should be a template
    var size = '2x',
        role = "data-role='fs-loading'",
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
            $c.append('<div ' + role + ' class="fs-loading text-center"> <span class="loading loading-48"></span> </div>');
        }
        else if (rt === 'prepend') {
            //$c.prepend('<div style="padding:15px;" ' + role +'></div>').find('[' + role + ']');
            $c.append('<div ' + role + ' class="fs-loading text-center"> <span class="loading loading-48"></span> </div>').find('[' + role + ']');
        }

        if (sl) {
            $c.find('[' + role + ']').append('<span>' + l + '</span>');
        }

    };

    Loading.prototype.hide = function (data) {

        $(data.container).find('[' + role + ']').remove();

    };

    return new Loading();
});
