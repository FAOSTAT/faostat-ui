/*global define, _:false, $, console, amplify, FM*/
/*jslint todo: true */
/*jslint nomen: true */
define([
    'jquery',
    'loglevel',
    'globals/Common',
    'views/base/view',
    'config/Config',
    'config/Events',
    'config/indicators/Config',
    'text!templates/indicators/indicators.hbs',
    'i18n!nls/indicators',
    'fs-r-t/start',
    'faostatapiclient',
    'amplify'
], function ($,
             log,
             Common,
             View,
             C,
             E,
             CM,
             template,
             i18nLabels,
             ReportTable,
             FAOSTATApi
             ) {

    'use strict';

    var s,
        IndicatorsView;

    s = {

    };

    IndicatorsView = View.extend({

        autoRender: true,

        className: 'indicators',

        template: template,

        initialize: function (options) {
            this.o = $.extend(true, {}, options);
        },

        getTemplateData: function () {
            return $.extend(this, {}, i18nLabels, {data: CM.data});
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            /* Update State. */
            amplify.publish(E.STATE_CHANGE, {indicators: 'indicators'});

            this.initVariables();

            this.initComponents();

            this.configurePage();

            this.bindEventListeners();

        },

        initVariables: function () {

            var api = new FAOSTATApi();

            /*api.data({
                domain_codes: ['QC'],
                filters: {
                    area: ['5000>'],
                    elements: ['2510'],
                    items: ['15'],
                    //years: ['2012']
                },

                //output_type: 'csv'
            }).then(function (response) {
                log.info(response)
            });*/

          /*  api.databean({
                domain_codes: ['QC'],
                List1Codes: ['2'],
                List2Codes: ['2510'],
                List3Codes: ['15'],
                List4Codes: ['2010'],
                List5Codes: null,
                List6Codes: null,
                List7Codes: null,
                List1AltCodes: ['ISO3'],
                page_size: 10
                //output_type: 'csv'
            }).then(function (response) {
                log.info(response);
            });*/


            /*var reportTable = new ReportTable();

            reportTable.init({
                container: this.$el,
                request: {
                    domain_code: 'fbs',
                    List1Codes: [33],
                    List2Codes: [2009]
                }
            });


            reportTable.render();
            //reportTable.export();*/

        },

        initComponents: function () {

        },

        configurePage: function () {

        },

        bindEventListeners: function () {

        },

        unbindEventListeners: function () {


        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);

        }
    });

    return IndicatorsView;

});
