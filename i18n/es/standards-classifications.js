/*global define*/
define(['jquery', 'i18n!nls/standards'], function ($, Standards) {

    'use strict';

    return $.extend(true, {}, Standards, {
        
        code_title: 'Código',
        label_title: 'Producto',
        description_title: 'Descripción',
        select_classification: 'Seleccione un dominio de la izquierda para ver los detalles'
        
    });
});