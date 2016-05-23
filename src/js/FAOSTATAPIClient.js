/*global define, Q, amplify*/
define(['jquery', 'loglevel', 'q' , 'amplify'], function ($, log, Q) {

    'use strict';

    function RESTClient(config) {

        /* Store configuration. */
        this.CONFIG = {
            base_url: 'http://fenix.fao.org/faostat/api/v1/'
            //base_url: '@@url_api'
        };

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config || {});

    }

    RESTClient.prototype.rankings = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_rankings_defaults(config);
        if (this.is_valid_rankings(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/rankings/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "domain_codes": config.domain_codes, "List1Codes": config.List1Codes, "List2Codes": config.List2Codes, "List3Codes": config.List3Codes, "List4Codes": config.List4Codes, "List5Codes": config.List5Codes, "List6Codes": config.List6Codes, "List7Codes": config.List7Codes, "filter_list": config.filter_list, "rank_type": config.rank_type, "limit": config.limit
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'POST'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_rankings = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_codes", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "filter_list", "rank_type", "limit"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_rankings_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_codes", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "filter_list", "rank_type", "limit"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en", "rank_type": "ASC", "limit": "5"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.data = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_data_defaults(config);
        if (this.is_valid_data(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/data/',
                data = {"datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "domain_codes": config.domain_codes, "decimal_places": config.decimal_places, "filters": config.filters, "null_values": config.null_values, "group_by": config.group_by, "order_by": config.order_by, "operator": config.operator, "page_size": config.page_size, "limit": config.limit, "page_number": config.page_number, "show_codes": config.show_codes, "show_flags": config.show_flags, "show_unit": config.show_unit},
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: JSON.stringify({"datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "domain_codes": config.domain_codes, "decimal_places": config.decimal_places, "filters": config.filters, "null_values": config.null_values, "group_by": config.group_by, "order_by": config.order_by, "operator": config.operator, "page_size": config.page_size, "limit": config.limit, "page_number": config.page_number, "show_codes": config.show_codes, "show_flags": config.show_flags, "show_unit": config.show_unit}),
                    contentType: "application/json",
                    /*
                     dataType : "json"
                     */
                    type: 'POST'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_data = function(config) {
        return true;
    };

    RESTClient.prototype.apply_data_defaults = function(config) {
        var i,
            parameters = ["lang", "data_bean"],
            defaults = {
                "lang": "en"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.databean = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_databean_defaults(config);
        if (this.is_valid_databean(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/data/bean/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "domain_codes": config.domain_codes, "decimal_places": config.decimal_places, "List1Codes": config.List1Codes, "List2Codes": config.List2Codes, "List3Codes": config.List3Codes, "List4Codes": config.List4Codes, "List5Codes": config.List5Codes, "List6Codes": config.List6Codes, "List7Codes": config.List7Codes, "List1AltCodes": config.List1AltCodes, "List2AltCodes": config.List2AltCodes, "List3AltCodes": config.List3AltCodes, "List4AltCodes": config.List4AltCodes, "List5AltCodes": config.List5AltCodes, "List6AltCodes": config.List6AltCodes, "List7AltCodes": config.List7AltCodes, "null_values": config.null_values, "group_by": config.group_by, "order_by": config.order_by, "operator": config.operator, "page_size": config.page_size, "limit": config.limit, "page_number": config.page_number, "show_codes": config.show_codes, "show_flags": config.show_flags, "show_unit": config.show_unit
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'POST'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_databean = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_codes", "decimal_places", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "List1AltCodes", "List2AltCodes", "List3AltCodes", "List4AltCodes", "List5AltCodes", "List6AltCodes", "List7AltCodes", "null_values", "group_by", "order_by", "operator", "page_size", "limit", "page_number", "show_codes", "show_flags", "show_unit"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_databean_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_codes", "decimal_places", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "List1AltCodes", "List2AltCodes", "List3AltCodes", "List4AltCodes", "List5AltCodes", "List6AltCodes", "List7AltCodes", "null_values", "group_by", "order_by", "operator", "page_size", "limit", "page_number", "show_codes", "show_flags", "show_unit"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en", "decimal_places": "2", "List1AltCodes": "", "List2AltCodes": "", "List3AltCodes": "", "List4AltCodes": "", "List5AltCodes": "", "List6AltCodes": "", "List7AltCodes": "", "null_values": "false", "group_by": "", "order_by": "", "operator": "", "page_size": "100", "limit": "-1", "page_number": "1", "show_codes": "1", "show_flags": "1", "show_unit": "1"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.reportheaders = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_reportheaders_defaults(config);
        if (this.is_valid_reportheaders(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/report/headers/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "domain_code": config.domain_code, "report_code": config.report_code, "List1Codes": config.List1Codes, "List2Codes": config.List2Codes, "List3Codes": config.List3Codes, "List4Codes": config.List4Codes, "List5Codes": config.List5Codes, "List6Codes": config.List6Codes, "List7Codes": config.List7Codes, "List1AltCodes": config.List1AltCodes, "List2AltCodes": config.List2AltCodes, "List3AltCodes": config.List3AltCodes, "List4AltCodes": config.List4AltCodes, "List5AltCodes": config.List5AltCodes, "List6AltCodes": config.List6AltCodes, "List7AltCodes": config.List7AltCodes
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'POST'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_reportheaders = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code", "report_code", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "List1AltCodes", "List2AltCodes", "List3AltCodes", "List4AltCodes", "List5AltCodes", "List6AltCodes", "List7AltCodes"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_reportheaders_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code", "report_code", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "List1AltCodes", "List2AltCodes", "List3AltCodes", "List4AltCodes", "List5AltCodes", "List6AltCodes", "List7AltCodes"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en", "report_code": "download"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.reportdata = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_reportdata_defaults(config);
        if (this.is_valid_reportdata(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/report/data/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "domain_code": config.domain_code, "report_code": config.report_code, "List1Codes": config.List1Codes, "List2Codes": config.List2Codes, "List3Codes": config.List3Codes, "List4Codes": config.List4Codes, "List5Codes": config.List5Codes, "List6Codes": config.List6Codes, "List7Codes": config.List7Codes, "List1AltCodes": config.List1AltCodes, "List2AltCodes": config.List2AltCodes, "List3AltCodes": config.List3AltCodes, "List4AltCodes": config.List4AltCodes, "List5AltCodes": config.List5AltCodes, "List6AltCodes": config.List6AltCodes, "List7AltCodes": config.List7AltCodes
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'POST'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_reportdata = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code", "report_code", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "List1AltCodes", "List2AltCodes", "List3AltCodes", "List4AltCodes", "List5AltCodes", "List6AltCodes", "List7AltCodes"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_reportdata_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code", "report_code", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "List1AltCodes", "List2AltCodes", "List3AltCodes", "List4AltCodes", "List5AltCodes", "List6AltCodes", "List7AltCodes"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en", "report_code": "download"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.datasize = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_datasize_defaults(config);
        if (this.is_valid_datasize(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/datasize/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "domain_codes": config.domain_codes, "List1Codes": config.List1Codes, "List2Codes": config.List2Codes, "List3Codes": config.List3Codes, "List4Codes": config.List4Codes, "List5Codes": config.List5Codes, "List6Codes": config.List6Codes, "List7Codes": config.List7Codes, "no_records": config.no_records, "null_values": config.null_values
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'POST'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_datasize = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_codes", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "no_records", "null_values"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_datasize_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_codes", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "no_records", "null_values"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en", "no_records": "1", "null_values": "false"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.authentication = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_authentication_defaults(config);
        if (this.is_valid_authentication(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/authentication/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "username": config.username, "password": config.password
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_authentication = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "username", "password"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_authentication_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "username", "password"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.abbreviations = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_abbreviations_defaults(config);
        if (this.is_valid_abbreviations(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/abbreviations/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_abbreviations = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_abbreviations_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.domaintabs = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_domaintabs_defaults(config);
        if (this.is_valid_domaintabs(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/domaintabs/' + config.domain_code + '/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_domaintabs = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_domaintabs_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.domainreports = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_domainreports_defaults(config);
        if (this.is_valid_domainreports(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/domainreports/' + config.domain_code + '/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_domainreports = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_domainreports_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.groupsanddomains = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_groupsanddomains_defaults(config);
        if (this.is_valid_groupsanddomains(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/groupsanddomains',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "section": config.section
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_groupsanddomains = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "section"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_groupsanddomains_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "section"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en", "section": "download"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.glossary = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_glossary_defaults(config);
        if (this.is_valid_glossary(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/glossary/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_glossary = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_glossary_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.units = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_units_defaults(config);
        if (this.is_valid_units(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/units/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_units = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_units_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.classifications = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_classifications_defaults(config);
        if (this.is_valid_classifications(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/classifications/' + config.domain_code + '/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_classifications = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_classifications_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.methodology = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_methodology_defaults(config);
        if (this.is_valid_methodology(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/methodologies/' + config.id + '/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_methodology = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "id"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_methodology_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "id"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.methodologies = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_methodologies_defaults(config);
        if (this.is_valid_methodologies(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/methodologies/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_methodologies = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_methodologies_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.dimensions = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_dimensions_defaults(config);
        if (this.is_valid_dimensions(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/dimensions/' + config.domain_code + '/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "report_code": config.report_code, "api_key": config.api_key, "client_key": config.client_key
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_dimensions = function(config) {
        var parameters = ["datasource", "output_type", "report_code", "api_key", "client_key", "lang", "domain_code"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_dimensions_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "report_code", "api_key", "client_key", "lang", "domain_code"],
            defaults = {
                "datasource": "production", "output_type": "objects", "report_code": "download", "api_key": "n.a.", "client_key": "n.a.", "lang": "en"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.codes = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_codes_defaults(config);
        if (this.is_valid_codes(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/codes/' + config.id + '/' + config.domain_code + '/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "report_code": config.report_code, "domains": config.domains, "whitelist": config.whitelist, "blacklist": config.blacklist, "group_subdimensions": config.group_subdimensions, "subcodelists": config.subcodelists, "show_lists": config.show_lists, "show_full_metadata": config.show_full_metadata, "ord": config.ord
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_codes = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "domain_code", "report_code", "lang", "id", "domains", "whitelist", "blacklist", "group_subdimensions", "subcodelists", "show_lists", "show_full_metadata", "ord"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_codes_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "domain_code", "report_code", "lang", "id", "domains", "whitelist", "blacklist", "group_subdimensions", "subcodelists", "show_lists", "show_full_metadata", "ord"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "report_code": "download", "lang": "en", "domains": "[]", "whitelist": "[]", "blacklist": "[]", "group_subdimensions": "false", "subcodelists": "null", "show_lists": "true", "show_full_metadata": "true", "ord": "null"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.groups = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_groups_defaults(config);
        if (this.is_valid_groups(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/groups/',
                data = {
                    "datasource": config.datasource, "whitelist": config.whitelist, "blacklist": config.blacklist, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_groups = function(config) {
        var parameters = ["datasource", "whitelist", "blacklist", "output_type", "api_key", "client_key", "lang"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_groups_defaults = function(config) {
        var i,
            parameters = ["datasource", "whitelist", "blacklist", "output_type", "api_key", "client_key", "lang"],
            defaults = {
                "datasource": "production", "whitelist": "[]", "blacklist": "[]", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.domains = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_domains_defaults(config);
        if (this.is_valid_domains(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/domains/' + config.group_code + '/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "whitelist": config.whitelist, "blacklist": config.blacklist
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_domains = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "group_code", "whitelist", "blacklist"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_domains_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "group_code", "whitelist", "blacklist"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en", "whitelist": "[]", "blacklist": "[]"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.bulkdownloads = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_bulkdownloads_defaults(config);
        if (this.is_valid_bulkdownloads(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/bulkdownloads/' + config.domain_code + '/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_bulkdownloads = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_bulkdownloads_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.documents = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_documents_defaults(config);
        if (this.is_valid_documents(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/documents/' + config.domain_code + '/',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_documents = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_documents_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.suggestions = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_suggestions_defaults(config);
        if (this.is_valid_suggestions(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/suggestions',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "q": config.q
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_suggestions = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "q"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_suggestions_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "q"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.search = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_search_defaults(config);
        if (this.is_valid_search(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/search',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "q": config.q
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_search = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "q"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_search_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "q"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    RESTClient.prototype.metadata = function(config) {
        config = $.extend(true, {}, this.CONFIG, config || {});
        config = this.apply_metadata_defaults(config);
        if (this.is_valid_metadata(config)) {
            var url = this.CONFIG.base_url +  config.lang + '/metadata/' + config.domain_code + '',
                data = {
                    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
                },
                self = this;

            var key = JSON.stringify($.extend({url: url}, data));
            var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    /*
                     <!-- TODO: this should be an option in the schema -->
                     */
                    traditional: true,
                    data: data,
                    type: 'GET'
                })).then(function (d) {
                    <!-- TODO: this should be at the schema level for each request and not a global one -->
                    try {
                        self.store(key, d);
                    }catch(e) {
                        /*
                         // catching for quota exceed
                         console.error(e);
                         */
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

        }
        throw 400;
    };

    RESTClient.prototype.is_valid_metadata = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    RESTClient.prototype.apply_metadata_defaults = function(config) {
        var i,
            parameters = ["datasource", "output_type", "api_key", "client_key", "lang"],
            defaults = {
                "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en"
            },
            key;
        for (i = 0; i < Object.keys(defaults).length; i += 1) {
            if (defaults[Object.keys(defaults)[i]] === '[]') {
                defaults[Object.keys(defaults)[i]] = [];
            }
        }
        for (i = 0; i < parameters.length; i += 1) {
            key =  parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };


    /* used to get a key/value */
    RESTClient.prototype.store = function(key, value) {

        var expireStoreTime = 300000;
        // 300000 (5 minutes)
        // 600000 (10 minutes)
        // 1200000 (20 minutes)
        // 1800000 (30 minutes)
        // 3600000 (60 minutes)

        if (value !== undefined) {
            log.info("Stored", key);
            return amplify.store(key, value, expireStoreTime);
        }else {
            log.info("Get Stored", key);
            return amplify.store(key);
        }

    };

    return RESTClient;

});