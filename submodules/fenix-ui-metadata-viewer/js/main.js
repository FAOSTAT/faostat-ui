/*global require, document, console, JSONEditor*/
require.config({

    baseUrl: 'js/libs',

    paths: {
        JSON: '../../json'
    },

    shim: {
        q: {
            deps: ['jquery'],
            exports: 'q'
        }
    }

});

require(['jquery',
         'text!JSON/schema.json',
         'text!JSON/data.json',
         'handlebars',
         'alpaca',
         'jsoneditor'], function ($, schema, data) {

    'use strict';

    var editor;

    data = $.parseJSON(data);
    schema = $.parseJSON(schema);

    //$('#placeholder').alpaca({
    //    schema: schema,
    //    data: data,
    //    view: 'bootstrap-display-horizontal',
    //    options: {
    //        collapsed: true,
    //        collapsible: true
    //    }
    //});

    editor = new JSONEditor(document.getElementById('placeholder'), {
        schema: schema,
        theme: 'bootstrap3',
        iconlib: 'fontawesome4',
        disable_edit_json: true,
        disable_properties: false,
        collapsed: false,
        disable_array_add: false,
        disable_array_delete: false,
        disable_array_reorder: false,
        disable_collapse: false,
        remove_empty_properties: false,
        expand_height: true
    });

});