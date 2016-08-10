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
    'q',
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
             FAOSTATApi,
             Q
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

        test: function() {

            return Q.fcall(function () {
                return 10;
            });

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

            log.info("----------------");
            var c = this.test();
            log.info(c);
            var d = c.then(function(v) {
               log.info("1 ", v);
               return 15;
            }).done(function(v) {
                log.info("2 ", v);
                return 25;
            });

        },

        initVariables: function () {

            /*$.ajax({
                url: "http://fenixservices.fao.org/faostat/api/v1/en/data/",
                data: JSON.stringify(
                    {"datasource":"production","domain_codes":["QC"],"filters":{"area":["2"],"item":["15"],"year":["2010"]}}
                ),
                contentType: "application/json",
                type: 'POST',
                success: function(result){
                    log.info(result);
                },
                error: function(error) {
                    log.error(error);
                }
            });*/

            var api =  new FAOSTATApi();

            api.definitions({
                datasource: "production"
            }).then(function(d) {
                log.info(d)

            });

            api.definitions({
                datasource: "internal"
            }).then(function(d) {
                log.info(d)

            });

            api.definitions_by_type({
                datasource: "production",
                type: "abbreviation"
            }).then(function(d) {
                log.info(d)

            });


            /*  api.data_get({
                  domain: 'QC',
                  datasource: "test",
                  area: [2],
                  year: [2010]
              }).then(function(d) {

                  log.info(d)

              });

              $.ajax({
                  url: "http://localhost:8081/faostat-api/v1/en/data/CS",
                  contentType: "application/json",
                  data: {
                      datasource: "test",
                      area: [2],
                      year: [2010]},
                  success: function(result){
                      log.info(result);
                  },
                  error: function(error) {
                      log.error(error);
                  }
              });

              $.ajax({
                  url: "http://localhost:8081/faostat-api/v1/en/data/CS",
                  contentType: "application/json",
                  data: {
                      datasource: "test",
                      area: [2, 3],
                      year: [2010]
                  },
                  success: function(result){
                      log.info(result);
                  },
                  error: function(error) {
                      log.error(error);
                  }
              });

              $.ajax({
                  url: "http://localhost:8081/faostat-api/v1/en/data/CS",
                  contentType: "application/json",
                  data: {
                      datasource:"test"
                  },
                  success: function(result){
                      log.info(result);
                  },
                  error: function(error) {
                      log.error(error);
                  }
              });

              $.ajax({
                  url: "http://localhost:8081/faostat-api/v1/en/data/QC",
                  contentType: "application/json",
                  data: {
                      datasource:"test",
                      area: ["5100>"],
                  },
                  success: function(result){
                      log.info(result);
                  },
                  error: function(error) {
                      log.error(error);
                  }
              });

              $.ajax({
                  url: "http://localhost:8081/faostat-api/v1/en/data/TP",
                  contentType: "application/json",
                  data: {
                      datasource:"test",
                      year: ["2010"],
                  },
                  success: function(result){
                      log.info(result);
                  },
                  error: function(error) {
                      log.error(error);
                  }
              });

              var api = new FAOSTATApi();*/

           /* api.data({
                "datasource":"production",
                "domain_codes":["QC"],
                "filters":{"area":["2"],
                    "item":["15"],
                    "year":["2010"]
                }
            })*/

          /*  api.data({
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
