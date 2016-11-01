/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        // overwrite of the common language to have the label in english
        definitions_and_standards: "Definitions and standards",
        
    });
});