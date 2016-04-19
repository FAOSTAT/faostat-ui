/*global define*/
define(['jquery', 'i18n!nls/standards'], function ($, Standards) {

    'use strict';

    return $.extend(true, {}, Standards, {
        
        code_title: 'Título',
        label_title: 'Définition',
        source_title: 'Fuente'
        
    });
});