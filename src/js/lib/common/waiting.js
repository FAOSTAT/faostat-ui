/**
 * Created by vortex on 10/5/15.
 */
/*global define, _:false, $, console, amplify, FM*/
define([
    'jquery',
    /* TODO: move to another folder? */
    'text!lib/common/templates/waiting.hbs',
    'i18n!nls/common',
    'bootstrap'
], function ($, template, i18nLabels) {

    'use strict';

    // TODO: move in templates and check why is not working
     var waiting = $('<div class="modal hide" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false"><div class="modal-header"><h1>Processing...</h1></div><div class="modal-body"><div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div></div></div>');


    function Waiting() {

        return this;
    }

    Waiting.prototype.showPleaseWait = function (data) {

        console.log(data);

        waiting.modal();

    },


    Waiting.prototype.hidePleaseWait = function () {

       waiting.modal('hide');

    };

    return new Waiting();
});
