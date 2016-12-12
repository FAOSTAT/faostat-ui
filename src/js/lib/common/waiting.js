/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'text!lib/common/templates/waiting.hbs',
    'i18n!nls/common',
    'bootstrap'
], function ($, log, template, i18nLabels) {

    'use strict';

    // TODO: move to templates
    var waiting = $('<div class="modal" data-backdrop="static" data-keyboard="false" >' +
        '<span style="color: #eeeeee;opacity: 1.0; position: absolute;top: 50%;left: 50%;">' +
        '<div class="text-center">' +
        '<span class="loading loading-48"></span> ' +
        '<h5 data-role="text"></h5>' +
        '</div>' +
        '</span>' +
        '</div>');


    function Waiting() {

        return this;
    }

    Waiting.prototype.showPleaseWait = function (data) {

        waiting.find("[data-role='text']").empty();

        if (data && data.hasOwnProperty('text')) {
           // waiting.find("[data-role='text']").html(data.text);
        }

        waiting.modal('show');

    };

    Waiting.prototype.hidePleaseWait = function () {

       waiting.find("[data-role='text']").html();
       waiting.modal('hide');

    };

    return new Waiting();
});
