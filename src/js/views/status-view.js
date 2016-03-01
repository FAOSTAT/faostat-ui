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
    'text!templates/status/status.hbs',
    'text!templates/status/status_api.hbs',
    'i18n!nls/indicators',
    'fs-r-t/start',
    'faostatapiclient',
    'q',
    'handlebars',
    'amplify'
], function ($,
             log,
             Common,
             View,
             C,
             E,
             template,
             templateAPI,
             i18nLabels,
             ReportTable,
             FAOSTATApi,
             Q,
             Handlebars
             ) {

    'use strict';

    var s,
        IndicatorsView;

    s = {

        GROUPS: '#fs-status-groups',
        DOMAINS: '#fs-status-groups-and-domains',
        DOMAINS_DETAILS: '#fs-status-domains-details',
        WARNING: '#fs-status-warning',
        DIMENSIONS: '#fs-status-dimensions',
        CODES: '#fs-status-codes',
        DATA: '#fs-status-data'

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
            amplify.publish(E.STATE_CHANGE, {status: 'status'});

            this.initVariables();

            this.initComponents();

            this.configurePage();

            this.bindEventListeners();

        },

        initVariables: function () {

            this.api = new FAOSTATApi();

            this.$GROUPS = this.$el.find(s.GROUPS);
            this.$DOMAINS = this.$el.find(s.DOMAINS);
            this.$DOMAINS_DETAILS = this.$el.find(s.DOMAINS_DETAILS);
            this.$WARNING = this.$el.find(s.WARNING);
            this.$DIMENSIONS = this.$el.find(s.DIMENSIONS);
            this.$CODES = this.$el.find(s.CODES);
            this.$DATA = this.$el.find(s.DATA);

            amplify.publish(E.LOADING_SHOW, {container: this.$GROUPS});
            amplify.publish(E.LOADING_SHOW, {container: this.$DOMAINS});
            //amplify.publish(E.LOADING_SHOW, {container: this.$DOMAINS_DETAILS});
            //amplify.publish(E.LOADING_SHOW, {container: this.$DIMENSIONS});
            //amplify.publish(E.LOADING_SHOW, {container: this.$CODES});
            //amplify.publish(E.LOADING_SHOW, {container: this.$DATA});

        },

        initComponents: function () {

            var self = this;

            this.api.groups({
                lang: this.o.lang,
                datasource:  C.DATASOURCE
            }).then(function(groups) {

                self.showGroups(groups);

            });

           this.api.groupsanddomains({
                lang: this.o.lang,
                datasource:  C.DATASOURCE
            }).then(function(domains) {

               self.showDomains(domains);

                _.each(domains.data, function(domain, index) {

                    //if ( domain.DomainCode === 'HS') {
                        self.getDataDomainSample(domain);
                   // }

                });

            });


        },

        configurePage: function () {

        },

        showGroups: function (d) {

            var self = this;

            var html = $(templateAPI).filter('#groups').html(),
                t = Handlebars.compile(html);

            this.$GROUPS.html(t({
                total: d.data.length,
                data: d.data
            }));

            this.$GROUPS.find('[data-role="show-details"]').on('click', function(e) {
                e.preventDefault();
                self.$GROUPS.find('[data-role="details"]').toggleClass('hidden');
            });

        },

        showDomains: function (d) {

            var self = this;

            var html = $(templateAPI).filter('#domains').html(),
                t = Handlebars.compile(html);

            this.$DOMAINS.html(t({
                total: d.data.length,
                data: d.data
            }));

            this.$DOMAINS.find('[data-role="show-details"]').on('click', function(e) {
                e.preventDefault();
                self.$DOMAINS.find('[data-role="details"]').toggleClass('hidden');
            });

        },

        getDataDomainSample: function (domain) {

            var self = this,
                lang = this.o.lang,
                datasource = C.DATASOURCE,
                domainCode = domain.domain_code,
                domainName = domain.domain_name,
                html = $(templateAPI).filter('#domain-details').html(),
                t = Handlebars.compile(html);

            this.$DOMAINS_DETAILS.append(t(domain));

            var $domain_container = this.$DOMAINS_DETAILS.find('[data-role="'+ domainCode +'"]');

            // get domain dimension
            this.api.dimensions({
                lang: lang,
                datasource: datasource,
                domain_code: domainCode
            }).then(function(dimensions) {

                self.showDetails($domain_container, 'dimensions', dimensions);

                // TODO: show dimensions on $container
                //log.info(dimensions);
                var requestCodes = [];

                // for each dimensions get sample codes
                _.each(dimensions.data, function(dimension){

                    log.info(dimension);

                    requestCodes.push(self.api.codes({
                        lang: lang,
                        datasource: datasource,
                        domain_code: domainCode,
                        id: dimension.id,
                        show_lists: true
                    }));

                });

                // get codes
                Q.all(requestCodes).then(function(codes) {

                    //log.info(codes)

                    var filters = {};

                    // for each code get a sample
                    _.each(codes, function(code) {

                        self.showDetails($domain_container, 'codes', code);

                        //log.info(code);

                        var parameter = code.metadata.parameters.parameter;
                        var id = code.metadata.parameters.id;

                        filters[id] = _.chain(code.data).sample(10).pluck('code').value();


                    });

                    log.info(filters);

                    // get codes sample and get data
                    try {
                        self.api.data($.extend(true, {},
                            {
                                lang: lang,
                                datasource: datasource,
                                domain_codes: [domainCode]
                            },
                            { filters: filters}
                        )).then(function (data) {

                            log.info(domainName, domainCode, data.data.length);
                            //log.info(data);

                            self.showData($domain_container, data, domain);

                            data = null;

                        });
                    }catch(e) {
                        log.error(e);
                    }


                });
            });

        },

        showDetails: function ($container, type, d) {

            var $details = $container.find('[data-role="'+ type + '-details"]');

            var html = $(templateAPI).filter('#' + type).html(),
                t = Handlebars.compile(html);

            $details.append(t({
                total: d.data.length,
                data: d.data,
                metadata: d.metadata
            }));

        },

        showData: function ($container, d, domain) {

            var $details = $container.find('[data-role="data-details"]');

            var html = $(templateAPI).filter('#data').html(),
                t = Handlebars.compile(html);

            $details.append(t({
                rows: d.data.length,
                color: (d.data.length <= 0)? 'red': null,
                status: (d.data.length <= 0)? 'Warning': null
            }));


            this.showWarning(d, domain);
        },

        showWarning: function(d, domain) {

            if ( d.data.length <= 0 ) {
                var html = $(templateAPI).filter('#warning').html(),
                    t = Handlebars.compile(html);

                this.$WARNING.append(t($.extend(true, {}, domain, {
                    rows: d.data.length,
                    color: (d.data.length <= 0)? 'red': null
                })));
            }

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
