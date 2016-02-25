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
    'text!templates/indicators/indicators.hbs',
    'i18n!nls/indicators',
    'fs-r-t/start',
    'faostatapiclient',
    'text!templates/indicators/testing.hbs',
    'q',
    'amplify'
], function ($,
             log,
             Common,
             View,
             C,
             E,
             template,
             i18nLabels,
             ReportTable,
             FAOSTATApi,
             templateTesting,
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

        getTemplateData: function () {
            return i18nLabels;
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

            var self = this;

            this.api = new FAOSTATApi();

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

/*            api.databean({
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



            this.api.domainstree({
                lang: this.o.lang,
                datasource:  C.DATASOURCE,
            }).then(function(domains) {

                _.each(domains.data, function(domain) {

                    self.getDataDomainSample(null, domain.DomainCode, domain.DomainName);
                });
            });

        },

        getDataDomainSample: function ($container, domainCode, domainName) {

            var self = this,
                lang = this.o.lang,
                datasource = C.DATASOURCE,
                domain_code = domainCode;


            //$container.empty();

            // get domain dimension
            this.api.dimensions({
                lang: lang,
                datasource: datasource,
                domain_code: domain_code
            }).then(function(dimensions) {

                // TODO: show dimensions on $container
                //log.info(dimensions);
                var requestCodes = [];

                // for each dimensions get sample codes
                _.each(dimensions.data, function(dimension){

                    //log.info(dimension);

                    requestCodes.push(self.api.codes({
                        lang: lang,
                        datasource: datasource,
                        domain_code: domain_code,
                        id: dimension.id,
                        subcodelists: false,
                        ord: true
                    }));

                });

                // get codes
                Q.all(requestCodes).then(function(codes) {

                    //log.info(codes)

                    var filters = {};

                    // for each code get a sample
                    _.each(codes, function(code) {

                        //log.info(code);

                        var parameter = code.metadata.parameters.parameter;
                        var id = code.metadata.parameters.id;

                        filters[id] = _.chain(code.data).sample(15).pluck('code').value()


                    });

                    //log.info(filters);

                    // get codes sample and get data
                    try {
                        self.api.data($.extend(true, {},
                            {
                                lang: lang,
                                datasource: datasource,
                                domain_codes: [domain_code]
                            },
                            { filters: filters}
                        )).then(function (data) {

                            log.info(domainName, domain_code, data.data.length);
                            //log.info(data);

                            data = null;

                        });
                    }catch(e) {
                        log.error(e);
                    }


                });
            });

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
