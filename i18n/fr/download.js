/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        search_for_a_domain: "Filtrer la liste des domaines par exemple récoltes, sécurité alimentaire, engrais",
        related_documents: "Documentation",
        selection_too_large:  "La sélection est trop importante.",
        suggest_bulk_downloads:  "Prière d’utiliser the <strong>Données Complètes</strong> ou réduire la sélection.",
        suggest_bulk_downloads_or_table: "Prière d’utiliser the <strong>Données Complètes</strong> ou <strong>tableau standard.</strong>",
        back_to_domains_list: "Retour à la liste des domaines",
        last_update: "Dernière mise à jour",
        full_metadata: "Metadonnées complètes",
        contacts_email: "Contacts mail",
        where_is_the_data: "Où est la donnée?",
        show_data_info_message: "Prière de faire une sélection ci-dessus et appuyer sur <i>Montrer les données</i>",
        open_domain_list: "Liste de domaines ouverts"

    });

});