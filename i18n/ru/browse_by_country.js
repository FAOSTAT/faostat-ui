/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, I18N) {

    'use strict';

    return $.extend(true, {}, I18N, {

        // overwrite of the common language to have the label in english
        country_indicators: 'Country Indicators',

    });

});