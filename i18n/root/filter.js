/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        year: 'Year',
        fromyear: 'From Year',
        toyear: 'To Year',
        countries: 'Countries',
        items: 'Items',
        element: 'Element',
        aggregation: 'Aggregation',
        average: 'Average',
        sum: 'Sum'

    });
});