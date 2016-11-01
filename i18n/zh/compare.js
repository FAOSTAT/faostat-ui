/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        // overwrite of the common language to have the label in english
        compare: "Compare",
        compare_data: "Compare Data",
        domains: 'Domains',

    });
});