/**
 * Created by vortex on 10/5/15.
 */
/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    'loglevel',
    'text!lib/common/templates/waiting.hbs',
    'i18n!nls/common',
    'bootstrap'
], function ($, log, template, i18nLabels) {

    'use strict';

    var waiting = $('<div class="modal" data-backdrop="static" data-keyboard="false" >' +
        '<span style="color: #eeeeee;opacity: 0.9; position: absolute;top: 50%;left: 50%;">' +
        '<i class="fa fa-cog fa-spin fa-4x"></i><h5 data-role="text"></h5>' +
        '</span>' +
        '</div>');


    function Waiting() {

        return this;
    }

    Waiting.prototype.showPleaseWait = function (data) {

        if (data && data.hasOwnProperty('text')) {
            waiting.find("[data-role='text']").html(data.text);
        }

        waiting.modal('show');

    };

    Waiting.prototype.hidePleaseWait = function () {

       waiting.find("[data-role='text']").html();
       waiting.modal('hide');

    };

    return new Waiting();
});
