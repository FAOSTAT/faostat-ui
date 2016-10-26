/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        search_for_a_domain: "Filtrar la lista de dominios, p. ej. cultivos, seguridad alimentaria, fertilizantes, etc.",
        related_documents: "Documentos relacionados",
        selection_too_large: "La selección es demasiado amplia.",
        suggest_bulk_downloads: "Por favor utilice la <strong>Descarga en bloque</strong> o reduzca la selección.",
        suggest_bulk_downloads_or_table: "Por favor utilice la <strong>Descarga en bloque</strong> o seleccione <strong>Tabla</strong> como salida de datos.",
        back_to_domains_list: "Volver a la lista de dominios",
        last_update: "Última actualización",
        full_metadata: "Todos los metadatos",
        contacts_email: "Correo electrónico de contacto",
        where_is_the_data: "¿Dónde están los datos?",
        show_data_info_message: "Por favor realice una selección en la parte superior y haga clic en <i>Mostrar Datos</i>",
        open_domain_list: "Abrir la lista de dominios"

    });

});