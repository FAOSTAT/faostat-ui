/*global define, Q, amplify*/
define(['jquery', 'loglevel', 'q' , 'amplify'], function ($, log, Q) {

    'use strict';

    function FAOSTATAPIClient() {

        /* Store configuration. */
            this.CONFIG = {
            base_url: 'http://fenixervices.fao.org/faostat/api/v1/',
            mode: '@@mode',
            lang: 'en',
            log: false
        };

    };

    FAOSTATAPIClient.prototype.config = function(c) {

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, c || {});

    };

        FAOSTATAPIClient.prototype.rankings = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_rankings_defaults(config);
    if (this.is_valid_rankings(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/rankings/',
            url_data = ['base_url','lang'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource, "output_type": config.output_type, "domain_codes": config.domain_codes, "List1Codes": config.List1Codes, "List2Codes": config.List2Codes, "List3Codes": config.List3Codes, "List4Codes": config.List4Codes, "List5Codes": config.List5Codes, "List6Codes": config.List6Codes, "List7Codes": config.List7Codes, "filter_list": config.filter_list, "rank_type": config.rank_type, "limit": config.limit
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'POST'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_rankings = function(config) {
        var parameters = ["datasource", "output_type", "lang", "domain_codes", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "filter_list", "rank_type", "limit"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_rankings_defaults = function(config) {
    var i,
        parameters = ["datasource", "output_type", "lang", "domain_codes", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "filter_list", "rank_type", "limit"],
        defaults = {
            "output_type": "objects", "lang": "en", "rank_type": "ASC", "limit": "5"
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.data_old = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_data_old_defaults(config);
    if (this.is_valid_data_old(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/data/',
            url_data = ['base_url','lang'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {"datasource": config.datasource, "output_type": config.output_type, "pivot": config.pivot, "domain_codes": config.domain_codes, "decimal_places": config.decimal_places, "filters": config.filters, "null_values": config.null_values, "group_by": config.group_by, "order_by": config.order_by, "operator": config.operator, "page_size": config.page_size, "limit": config.limit, "page_number": config.page_number, "show_codes": config.show_codes, "show_flags": config.show_flags, "show_unit": config.show_unit});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: JSON.stringify(data),
                        contentType: "application/json",
                    type: 'POST'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_data_old = function(config) {
        return true;
    };

FAOSTATAPIClient.prototype.apply_data_old_defaults = function(config) {
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.databean = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_databean_defaults(config);
    if (this.is_valid_databean(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/data/bean/',
            url_data = ['base_url','lang'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource, "output_type": config.output_type, "pivot": config.pivot, "domain_codes": config.domain_codes, "decimal_places": config.decimal_places, "List1Codes": config.List1Codes, "List2Codes": config.List2Codes, "List3Codes": config.List3Codes, "List4Codes": config.List4Codes, "List5Codes": config.List5Codes, "List6Codes": config.List6Codes, "List7Codes": config.List7Codes, "List1AltCodes": config.List1AltCodes, "List2AltCodes": config.List2AltCodes, "List3AltCodes": config.List3AltCodes, "List4AltCodes": config.List4AltCodes, "List5AltCodes": config.List5AltCodes, "List6AltCodes": config.List6AltCodes, "List7AltCodes": config.List7AltCodes, "null_values": config.null_values, "group_by": config.group_by, "order_by": config.order_by, "operator": config.operator, "page_size": config.page_size, "limit": config.limit, "page_number": config.page_number, "show_codes": config.show_codes, "show_flags": config.show_flags, "show_unit": config.show_unit
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'POST'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_databean = function(config) {
        var parameters = ["datasource", "output_type", "lang", "pivot", "domain_codes", "decimal_places", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "List1AltCodes", "List2AltCodes", "List3AltCodes", "List4AltCodes", "List5AltCodes", "List6AltCodes", "List7AltCodes", "null_values", "group_by", "order_by", "operator", "page_size", "limit", "page_number", "show_codes", "show_flags", "show_unit"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_databean_defaults = function(config) {
    var i,
        parameters = ["datasource", "output_type", "lang", "pivot", "domain_codes", "decimal_places", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "List1AltCodes", "List2AltCodes", "List3AltCodes", "List4AltCodes", "List5AltCodes", "List6AltCodes", "List7AltCodes", "null_values", "group_by", "order_by", "operator", "page_size", "limit", "page_number", "show_codes", "show_flags", "show_unit"],
        defaults = {
            "output_type": "objects", "lang": "en", "pivot": "false", "decimal_places": "2", "List1AltCodes": "", "List2AltCodes": "", "List3AltCodes": "", "List4AltCodes": "", "List5AltCodes": "", "List6AltCodes": "", "List7AltCodes": "", "null_values": "false", "group_by": "", "order_by": "", "operator": "", "page_size": "100", "limit": "-1", "page_number": "1", "show_codes": "1", "show_flags": "1", "show_unit": "1"
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.data_get = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_data_get_defaults(config);
    if (this.is_valid_data_get(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/data/' + config.domain + '/',
            url_data = ['base_url','lang','domain'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource, "output_type": config.output_type, "pivot": config.pivot, "domain_codes": config.domain_codes, "decimal_places": config.decimal_places, "null_values": config.null_values, "group_by": config.group_by, "order_by": config.order_by, "operator": config.operator, "page_size": config.page_size, "limit": config.limit, "page_number": config.page_number, "show_codes": config.show_codes, "show_flags": config.show_flags, "show_unit": config.show_unit
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'GET'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_data_get = function(config) {
        var parameters = ["datasource", "output_type", "lang", "pivot", "domain_codes", "decimal_places", "null_values", "group_by", "order_by", "operator", "page_size", "limit", "page_number", "show_codes", "show_flags", "show_unit"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_data_get_defaults = function(config) {
    var i,
        parameters = ["datasource", "output_type", "lang", "pivot", "domain_codes", "decimal_places", "null_values", "group_by", "order_by", "operator", "page_size", "limit", "page_number", "show_codes", "show_flags", "show_unit"],
        defaults = {
            "output_type": "objects", "lang": "en", "pivot": "false", "decimal_places": "2", "null_values": "false", "group_by": "", "order_by": "", "operator": "", "page_size": "100", "limit": "-1", "page_number": "1", "show_codes": "1", "show_flags": "1", "show_unit": "1"
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.reportheaders = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_reportheaders_defaults(config);
    if (this.is_valid_reportheaders(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/report/headers/',
            url_data = ['base_url','lang'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource, "output_type": config.output_type, "domain_code": config.domain_code, "report_code": config.report_code, "List1Codes": config.List1Codes, "List2Codes": config.List2Codes, "List3Codes": config.List3Codes, "List4Codes": config.List4Codes, "List5Codes": config.List5Codes, "List6Codes": config.List6Codes, "List7Codes": config.List7Codes, "List1AltCodes": config.List1AltCodes, "List2AltCodes": config.List2AltCodes, "List3AltCodes": config.List3AltCodes, "List4AltCodes": config.List4AltCodes, "List5AltCodes": config.List5AltCodes, "List6AltCodes": config.List6AltCodes, "List7AltCodes": config.List7AltCodes
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'POST'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_reportheaders = function(config) {
        var parameters = ["datasource", "output_type", "domain_code", "report_code", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "List1AltCodes", "List2AltCodes", "List3AltCodes", "List4AltCodes", "List5AltCodes", "List6AltCodes", "List7AltCodes"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_reportheaders_defaults = function(config) {
    var i,
        parameters = ["datasource", "output_type", "domain_code", "report_code", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "List1AltCodes", "List2AltCodes", "List3AltCodes", "List4AltCodes", "List5AltCodes", "List6AltCodes", "List7AltCodes"],
        defaults = {
            "output_type": "objects"
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.reportdata = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_reportdata_defaults(config);
    if (this.is_valid_reportdata(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/report/data/',
            url_data = ['base_url','lang'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource, "output_type": config.output_type, "domain_code": config.domain_code, "report_code": config.report_code, "List1Codes": config.List1Codes, "List2Codes": config.List2Codes, "List3Codes": config.List3Codes, "List4Codes": config.List4Codes, "List5Codes": config.List5Codes, "List6Codes": config.List6Codes, "List7Codes": config.List7Codes, "List1AltCodes": config.List1AltCodes, "List2AltCodes": config.List2AltCodes, "List3AltCodes": config.List3AltCodes, "List4AltCodes": config.List4AltCodes, "List5AltCodes": config.List5AltCodes, "List6AltCodes": config.List6AltCodes, "List7AltCodes": config.List7AltCodes
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'POST'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_reportdata = function(config) {
        var parameters = ["datasource", "output_type", "lang", "domain_code", "report_code", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "List1AltCodes", "List2AltCodes", "List3AltCodes", "List4AltCodes", "List5AltCodes", "List6AltCodes", "List7AltCodes"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_reportdata_defaults = function(config) {
    var i,
        parameters = ["datasource", "output_type", "lang", "domain_code", "report_code", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "List1AltCodes", "List2AltCodes", "List3AltCodes", "List4AltCodes", "List5AltCodes", "List6AltCodes", "List7AltCodes"],
        defaults = {
            "output_type": "objects", "lang": "en"
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.datasize = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_datasize_defaults(config);
    if (this.is_valid_datasize(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/datasize/',
            url_data = ['base_url','lang'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource, "output_type": config.output_type, "domain_codes": config.domain_codes, "List1Codes": config.List1Codes, "List2Codes": config.List2Codes, "List3Codes": config.List3Codes, "List4Codes": config.List4Codes, "List5Codes": config.List5Codes, "List6Codes": config.List6Codes, "List7Codes": config.List7Codes, "no_records": config.no_records, "null_values": config.null_values
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'POST'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_datasize = function(config) {
        var parameters = ["datasource", "output_type", "lang", "domain_codes", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "no_records", "null_values"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_datasize_defaults = function(config) {
    var i,
        parameters = ["datasource", "output_type", "lang", "domain_codes", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "no_records", "null_values"],
        defaults = {
            "output_type": "objects", "lang": "en", "no_records": "1", "null_values": "false"
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.groupsanddomains = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_groupsanddomains_defaults(config);
    if (this.is_valid_groupsanddomains(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/groupsanddomains',
            url_data = ['base_url','lang'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource, "section": config.section
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'GET'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_groupsanddomains = function(config) {
        var parameters = ['lang'], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_groupsanddomains_defaults = function(config) {
    var i,
        parameters = ["datasource", "lang", "section"],
        defaults = {
            "lang": "en", "section": "download"
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.dimensions = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_dimensions_defaults(config);
    if (this.is_valid_dimensions(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/dimensions/' + config.domain_code + '/',
            url_data = ['base_url','lang','domain_code'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource, "report_code": config.report_code, "full": config.full
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'GET'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_dimensions = function(config) {
        var parameters = ['lang','domain_code'], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_dimensions_defaults = function(config) {
    var i,
        parameters = ["datasource", "report_code", "lang", "domain_code", "full"],
        defaults = {
            "lang": "en", "full": "false"
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.codes = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_codes_defaults(config);
    if (this.is_valid_codes(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/codes/' + config.id + '/' + config.domain_code + '/',
            url_data = ['base_url','lang','id','domain_code'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource, "report_code": config.report_code, "whitelist": config.whitelist, "blacklist": config.blacklist, "show_lists": config.show_lists
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'GET'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_codes = function(config) {
        var parameters = ['lang','id','domain_code'], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_codes_defaults = function(config) {
    var i,
        parameters = ["datasource", "domain_code", "report_code", "lang", "id", "whitelist", "blacklist", "show_lists"],
        defaults = {
            "lang": "en", "whitelist": "[]", "blacklist": "[]", "show_lists": "true"
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.groups = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_groups_defaults(config);
    if (this.is_valid_groups(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/groups/',
            url_data = ['base_url','lang'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource, "whitelist": config.whitelist, "blacklist": config.blacklist
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'GET'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_groups = function(config) {
        var parameters = ['lang'], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_groups_defaults = function(config) {
    var i,
        parameters = ["datasource", "whitelist", "blacklist", "lang"],
        defaults = {
            "whitelist": "[]", "blacklist": "[]", "lang": "en"
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.domains = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_domains_defaults(config);
    if (this.is_valid_domains(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/domains/' + config.group_code + '/',
            url_data = ['base_url','lang','group_code'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource, "whitelist": config.whitelist, "blacklist": config.blacklist
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'GET'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_domains = function(config) {
        var parameters = ['lang','group_code'], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_domains_defaults = function(config) {
    var i,
        parameters = ["datasource", "lang", "group_code", "whitelist", "blacklist"],
        defaults = {
            "lang": "en", "whitelist": "[]", "blacklist": "[]"
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.bulkdownloads = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_bulkdownloads_defaults(config);
    if (this.is_valid_bulkdownloads(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/bulkdownloads/' + config.domain_code + '/',
            url_data = ['base_url','lang','domain_code'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'GET'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_bulkdownloads = function(config) {
        var parameters = ['lang','domain_code'], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_bulkdownloads_defaults = function(config) {
    var i,
        parameters = ["datasource", "lang", "domain_code"],
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.documents = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_documents_defaults(config);
    if (this.is_valid_documents(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/documents/' + config.domain_code + '/',
            url_data = ['base_url','lang','domain_code'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'GET'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_documents = function(config) {
        var parameters = ['lang','domain_code'], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_documents_defaults = function(config) {
    var i,
        parameters = ["datasource", "lang", "domain_code"],
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.suggestions = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_suggestions_defaults(config);
    if (this.is_valid_suggestions(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/suggestions',
            url_data = ['base_url','lang'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource, "q": config.q
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'GET'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_suggestions = function(config) {
        var parameters = ['lang','q'], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_suggestions_defaults = function(config) {
    var i,
        parameters = ["datasource", "lang", "q"],
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.search = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_search_defaults(config);
    if (this.is_valid_search(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/search',
            url_data = ['base_url','lang'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource, "q": config.q
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'GET'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_search = function(config) {
        var parameters = ['lang','q'], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_search_defaults = function(config) {
    var i,
        parameters = ["datasource", "lang", "q"],
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.metadata = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_metadata_defaults(config);
    if (this.is_valid_metadata(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/metadata/' + config.domain_code + '',
            url_data = ['base_url','lang','domain_code'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'GET'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_metadata = function(config) {
        var parameters = ['lang','domain_code'], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_metadata_defaults = function(config) {
    var i,
        parameters = ["datasource", "lang"],
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.definitions_types = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_definitions_types_defaults(config);
    if (this.is_valid_definitions_types(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/definitions/types',
            url_data = ['base_url','lang'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'GET'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_definitions_types = function(config) {
        var parameters = ['lang'], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_definitions_types_defaults = function(config) {
    var i,
        parameters = ["datasource", "lang"],
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.definitions_by_type = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_definitions_by_type_defaults(config);
    if (this.is_valid_definitions_by_type(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/definitions/types/' + config.type + '',
            url_data = ['base_url','lang','type'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'GET'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_definitions_by_type = function(config) {
        var parameters = ['lang','type'], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_definitions_by_type_defaults = function(config) {
    var i,
        parameters = ["datasource", "lang", "type"],
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.definitions_domain = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_definitions_domain_defaults(config);
    if (this.is_valid_definitions_domain(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/definitions/domain/' + config.domain_code + '',
            url_data = ['base_url','lang','domain_code'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'GET'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_definitions_domain = function(config) {
        var parameters = ['lang','domain_code'], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_definitions_domain_defaults = function(config) {
    var i,
        parameters = ["datasource", "lang", "domain_code"],
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.definitions_domain_by_type = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_definitions_domain_by_type_defaults(config);
    if (this.is_valid_definitions_domain_by_type(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/definitions/domain/' + config.domain_code + '/' + config.type + '',
            url_data = ['base_url','lang','domain_code','type'],
            compressArray = false,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource, "output_type": config.output_type
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'GET'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_definitions_domain_by_type = function(config) {
        var parameters = ['lang','domain_code','type'], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_definitions_domain_by_type_defaults = function(config) {
    var i,
        parameters = ["datasource", "output_type", "lang", "domain_code", "type"],
        defaults = {
            "output_type": "objects", "lang": "en"
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
            // No default value available for this parameter.
        }
    }
    return config;
};

        FAOSTATAPIClient.prototype.data = function(c) {
    var config = $.extend(true, {}, this.CONFIG, c || {});
    config = this.apply_data_defaults(config);
    if (this.is_valid_data(config)) {
        var url = this.CONFIG.base_url +  config.lang + '/data/' + config.domain_code + '',
            url_data = ['base_url','lang','domain_code'],
            compressArray = true,
            traditional = true,
            self = this;

        // if advanced
        var data = $.extend(true, {}, c, {
    "datasource": config.datasource, "output_type": config.output_type
});

        for(var i=0; i < url_data.length; i++) {
            delete data[url_data[i]];
        }

        // parse arrays to strings
        // this will reduce the length of the URL
        if(compressArray === true) {
            $.each(data, function(k, v) {
                if (Array.isArray(v)) {
                    data[k] = v.join(",");
                }
            });
        }

        var key = JSON.stringify($.extend({url: url}, data));
        var v = this.store(key);

            if ( v === undefined) {
                return Q($.ajax({
                    url: url,
                    // TODO: this should be an option in the schema
                    traditional: traditional,
                        data: data,
                    type: 'GET'
                })).then(function (d) {
                    // TODO: this should be at the schema level for each request and not a global one
                    try {
                        self.store(key, d);
                    }catch(e) {
                        // catching for quota exceed
                    }
                    return d;
                });
            }else {
                return Q.when(v);
            }

    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_data = function(config) {
        var parameters = ['lang','domain_code'], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_data_defaults = function(config) {
    var i,
        parameters = ["datasource", "output_type", "lang"],
        defaults = {
            "output_type": "objects", "lang": "en"
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
            // No default value available for this parameter.
        }
    }
    return config;
};


    /* used to get a key/value */
    FAOSTATAPIClient.prototype.store = function(key, value) {

        /* if mode = 'dev' */
        if(this.CONFIG.hasOwnProperty('mode') && this.CONFIG.mode === 'dev') {
            return undefined;
        }

        var expireStoreTime = 300000;
        // 300000 (5 minutes)
        // 600000 (10 minutes)
        // 1200000 (20 minutes)
        // 1800000 (30 minutes)
        // 3600000 (60 minutes)

        if (value !== undefined) {
            if (this.CONFIG.log) {
                log.info("Stored", key);
            }
            return amplify.store(key, value, expireStoreTime);
        }else {
            if (this.CONFIG.log) {
                log.info("Get Stored", key);
            }
            return amplify.store(key);
        }

    };

    return new FAOSTATAPIClient;

});