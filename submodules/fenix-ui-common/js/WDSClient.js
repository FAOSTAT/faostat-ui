define(['jquery'], function ($) {

    'use strict';

    var defaultOpts = {
        serviceUrl: 'http://fenixapps2.fao.org/wds_5.1/rest/crud',
        wdsUrl: 'http://fenixapps2.fao.org/wds_5.1/rest',
        wdsSchemaUrl: 'http://fenixapps2.fao.org/wds_5.1/schema/services.json',
        datasource: 'DEMO_FENIX',
		queryTmpl: '',
		queryVars: null,
		outputType: 'array',
		error: null,
		always: null,
		success: null
    };

    function _template(str, data) {
        return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
            return data[key] || '';
        });
    }

    function wdsClient(config) {

        this.opts = $.extend({
            serviceUrl: defaultOpts.serviceUrl,
            datasource: defaultOpts.datasource,
            collection: null,
            wdsUrl: defaultOpts.wdsUrl,
            wdsSchemaUrl: defaultOpts.wdsSchemaUrl,
            wds_blacklist: ['method', 'endpoint'],
            thousandSeparator: ',',
            decimalSeparator: '.',
            decimalNumbers: 2,
            cssFilename: '',
            nowrap: false,
            valuesIndex: 0,
            json: JSON.stringify({query: ''}),
            wds_client_config: {
                url_root: '',
                parameters: [],
                error: null,
                always: null,
                success: null,
                rest_service_name: ''
            }
        }, config);

        return this;
    }

    wdsClient.prototype.query = function ( conf ) {

        var ret,
            data = this.prepareDataForRequest(conf);

        if ($.isFunction(conf.success)) {
            ret = $.ajax({
                url: this.opts.serviceUrl,
                data: data,
                type: 'POST',
                dataType: 'JSON',
                error: conf.error || $.noop,
                always: conf.always || $.noop,
                success: conf.success || $.noop
            });
        } else {

            $.ajax({
                async: false,
                url: this.opts.serviceUrl,
                data: data,
                type: 'POST',
                dataType: 'JSON',
                error: conf.error || $.noop,                
                always: conf.always || $.noop,
                success: function (resp) {
                    ret = resp;
                }                
            });
        }

        return ret;
    };

    wdsClient.prototype.prepareDataForRequest = function (conf) {

        var sql = $.isPlainObject(conf.queryVars) ? _template(conf.queryTmpl, conf.queryVars) : conf.queryTmpl;

        if (this.opts.outputType === 'object'){

            return {
                datasource : this.opts.datasource,
                outputType : this.opts.outputType,
                query : sql
            };

        } else {

            return $.extend(true, this.opts, {
                json: JSON.stringify({query: sql})
            });
        }


    };

    wdsClient.prototype.create = function(config) {
        this.crud('POST', config);
    };

    wdsClient.prototype.retrieve = function(config) {
        this.crud('GET', config);
    };

    wdsClient.prototype.update = function(config) {
        this.crud('PUT', config);
    };

    wdsClient.prototype.delete = function(config) {
        this.crud('DELETE', config);
    };

    wdsClient.prototype.crud = function(http_method, config) {
        try {
            this.isValidConfiguration(config);
            if (typeof config.payload.queryVars !== 'undefined' &&
                config.payload.queryVars !== null &&
                $.isPlainObject(config.payload.queryVars) ) {
                config.payload.query = _template(config.payload.query, config.payload.queryVars);
            }
            $.ajax({
                type: http_method,
                url: this.opts.serviceUrl,
                data: {
                    payload: JSON.stringify(config.payload),
                    datasource: (typeof config.datasource !== 'undefined' && config.datasource !== null) ? config.datasource : this.opts.datasource,
                    collection: (typeof config.collection !== 'undefined' && config.collection !== null) ? config.collection : this.opts.collection,
                    outputType: (typeof config.outputType !== 'undefined' && config.outputType !== null) ? config.outputType : this.opts.outputType
                },
                success: config.success,
                error: config.error,
                always: config.always,
                context: config.context
            });
        } catch (e) {
            config.error(e);
        }
    };

    wdsClient.prototype.isValidConfiguration = function(config) {

        if (config.payload == undefined || config.payload == null)
            throw new Error('Missing parameter "payload" in the configuration object.');
        if (config.datasource == undefined || config.datasource == null) {
            if (this.opts.datasource == undefined || this.opts.datasource == null)
                throw new Error('Missing parameter "datasource" in the default configuration and in the configuration object.');
        }
    };

    wdsClient.prototype.get_services_client = function(config) {

        /* This... */
        var _this = this;

        /* Error function. */
        var err = config.error != undefined ? config.error : function(e) {alert(e);};

        /* Service URL. */
        var wds_url = config.wds_url != null ? config.wds_url : this.opts.wdsUrl;

        /* Load WDS schema. */
        $.getJSON(this.opts.wdsSchemaUrl, function(schema) {

            /* Load service schema. */
            var service_schema;
            try {
                service_schema = schema.properties[config.service_name].properties.schema.properties;
            } catch (e) {
                err('Invalid schema for service: "' + config.service_name + '"');
            }

            /* Check user's parameters. */
            try {

                /* Check user's parameters. */
                _this.check_parameters(config.parameters, service_schema);

                /* Add service's endpoint. */
                try {
                    wds_url += service_schema.endpoint.default + '/';
                } catch (e) {
                    err('Missing "endpoint" in the schema for service: "' + config.service_name + '"');
                }

                /* Create the URL by taking the parameters from the CONFIG object according to the JSON Schema definition. */
                for (var i = 0 ; i < Object.keys(service_schema).length ; i++)
                    if ($.inArray(Object.keys(service_schema)[i], _this.opts.wds_blacklist) < 0)
                        wds_url += config.parameters[Object.keys(service_schema)[i]] + '/';

                /* Test method parameter existence. */
                if (service_schema.method == undefined)
                    err('Missing "method" in the schema for service: "' + config.service_name + '"');

                /* Invoke the service. */
                $.ajax({
                    type: service_schema.method.default.toUpperCase(),
                    url: wds_url,
                    success: config.success,
                    error: err,
                    always: config.always
                });

            } catch (e) {
                err(e);
            }

        });

    };

    wdsClient.prototype.check_parameters = function(parameters, rest_parameters) {
        for (var i = 0 ; i < Object.keys(rest_parameters).length ; i++)
            if ($.inArray(Object.keys(rest_parameters)[i], this.opts.wds_blacklist) < 0)
                if (parameters[Object.keys(rest_parameters)[i]] == undefined)
                    throw 'Missing parameter: ' + Object.keys(rest_parameters)[i];
    };

    return wdsClient;

});