/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        definitions_and_standards_title: "Définitions et Standard pour FAOSTAT",
        list: "Liste",
        please_select_a_definition_or_standard: 'Choisissez une définition ou une standard'
        
    });
});