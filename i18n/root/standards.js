/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        units: 'Units',
        abbreviations: 'abbreviations',
        filter_results: 'Filter Results',
        methodology: 'Methodology'

    });
});