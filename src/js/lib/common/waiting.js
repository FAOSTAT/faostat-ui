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

    var waiting = $('<div class="modal">' +
        '<span style="color: #eeeeee;opacity: 0.9; position: absolute;top: 50%;left: 50%;">' +
        '<i class="fa fa-cog fa-spin fa-4x"></i>' +
        '</span>' +
        '</div>');


    function Waiting() {

        return this;
    }

    Waiting.prototype.showPleaseWait = function (data) {

        waiting.modal('show');

    },

    Waiting.prototype.hidePleaseWait = function () {

       waiting.modal('hide');

    };

    return new Waiting();
});
