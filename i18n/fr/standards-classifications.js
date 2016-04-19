/*global define*/
define(['jquery', 'i18n!nls/standards'], function ($, Standards) {

    'use strict';

    return $.extend(true, {}, Standards, {

        code_title: 'Code',
        label_title: 'Produit',
        description_title: 'Descripción',
        select_classification: 'Sélectionnez un Domaine sur la gauche pour voir les détails'
        
    });
});