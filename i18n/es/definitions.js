/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        definitions_and_standards_title: "Definiciones y estándares utilizados en FAOSTAT",
        list: "Lista",
        please_select_a_definition_or_standard: 'Seleccione una definición y estándar'
        
    });
});