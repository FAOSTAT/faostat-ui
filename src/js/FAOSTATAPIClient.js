/*global define,Q*/
define(['jquery', 'q'], function ($, Q) {

    'use strict';

    function FAOSTATAPIClient(config) {

        /* Store configuration. */
        this.CONFIG = {
            base_url: 'http://fenixapps2.fao.org/api/v1.0/'
        };

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config || {});

    }

        FAOSTATAPIClient.prototype.rankings = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_rankings_defaults(config);
    if (this.is_valid_rankings(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/rankings/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "domain_codes": config.domain_codes, "List1Codes": config.List1Codes, "List2Codes": config.List2Codes, "List3Codes": config.List3Codes, "List4Codes": config.List4Codes, "List5Codes": config.List5Codes, "List6Codes": config.List6Codes, "List7Codes": config.List7Codes, "filter_list": config.filter_list, "rank_type": config.rank_type, "limit": config.limit
},
                type: 'POST'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_rankings = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_codes", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "filter_list", "rank_type", "limit"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_rankings_defaults = function (config) {
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

        FAOSTATAPIClient.prototype.databean = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_databean_defaults(config);
    if (this.is_valid_databean(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/data/bean/',
                traditional: true,
                    data: JSON.stringify({"datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "domain_codes": config.domain_codes, "decimal_places": config.decimal_places, "filters": config.filters, "null_values": config.null_values, "group_by": config.group_by, "order_by": config.order_by, "operator": config.operator, "page_size": config.page_size, "limit": config.limit, "page_number": config.page_number, "show_codes": config.show_codes, "show_flags": config.show_flags, "show_unit": config.show_unit}),
                    contentType: "application/json",
                    dataType : "json",
                type: 'POST'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_databean = function(config) {
        return true;
    };

FAOSTATAPIClient.prototype.apply_databean_defaults = function (config) {
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

        FAOSTATAPIClient.prototype.data = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_data_defaults(config);
    if (this.is_valid_data(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/data/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "domain_codes": config.domain_codes, "decimal_places": config.decimal_places, "List1Codes": config.List1Codes, "List2Codes": config.List2Codes, "List3Codes": config.List3Codes, "List4Codes": config.List4Codes, "List5Codes": config.List5Codes, "List6Codes": config.List6Codes, "List7Codes": config.List7Codes, "null_values": config.null_values, "group_by": config.group_by, "order_by": config.order_by, "operator": config.operator, "page_size": config.page_size, "limit": config.limit, "page_number": config.page_number, "show_codes": config.show_codes, "show_flags": config.show_flags, "show_unit": config.show_unit
},
                type: 'POST'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_data = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_codes", "decimal_places", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "null_values", "group_by", "order_by", "operator", "page_size", "limit", "page_number", "show_codes", "show_flags", "show_unit"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_data_defaults = function (config) {
    var i,
        parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_codes", "decimal_places", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "null_values", "group_by", "order_by", "operator", "page_size", "limit", "page_number", "show_codes", "show_flags", "show_unit"],
        defaults = {
            "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en", "decimal_places": "2", "null_values": "false", "group_by": "", "order_by": "", "operator": "", "page_size": "100", "limit": "-1", "page_number": "1", "show_codes": "1", "show_flags": "1", "show_unit": "1"
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

        FAOSTATAPIClient.prototype.datasize = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_datasize_defaults(config);
    if (this.is_valid_datasize(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/datasize/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "domain_codes": config.domain_codes, "List1Codes": config.List1Codes, "List2Codes": config.List2Codes, "List3Codes": config.List3Codes, "List4Codes": config.List4Codes, "List5Codes": config.List5Codes, "List6Codes": config.List6Codes, "List7Codes": config.List7Codes, "no_records": config.no_records, "null_values": config.null_values
},
                type: 'POST'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_datasize = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_codes", "List1Codes", "List2Codes", "List3Codes", "List4Codes", "List5Codes", "List6Codes", "List7Codes", "no_records", "null_values"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_datasize_defaults = function (config) {
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

        FAOSTATAPIClient.prototype.authentication = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_authentication_defaults(config);
    if (this.is_valid_authentication(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/authentication/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "username": config.username, "password": config.password
},
                type: 'GET'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_authentication = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "username", "password"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_authentication_defaults = function (config) {
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

        FAOSTATAPIClient.prototype.abbreviations = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_abbreviations_defaults(config);
    if (this.is_valid_abbreviations(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/abbreviations/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
},
                type: 'GET'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_abbreviations = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_abbreviations_defaults = function (config) {
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

        FAOSTATAPIClient.prototype.domainstree = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_domainstree_defaults(config);
    if (this.is_valid_domainstree(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/domainstree/' + config.section + '/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
},
                type: 'GET'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_domainstree = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "section"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_domainstree_defaults = function (config) {
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

        FAOSTATAPIClient.prototype.glossary = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_glossary_defaults(config);
    if (this.is_valid_glossary(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/glossary/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
},
                type: 'GET'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_glossary = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_glossary_defaults = function (config) {
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

        FAOSTATAPIClient.prototype.units = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_units_defaults(config);
    if (this.is_valid_units(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/units/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
},
                type: 'GET'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_units = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_units_defaults = function (config) {
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

        FAOSTATAPIClient.prototype.classifications = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_classifications_defaults(config);
    if (this.is_valid_classifications(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/classifications/' + config.domain_code + '/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
},
                type: 'GET'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_classifications = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_classifications_defaults = function (config) {
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

        FAOSTATAPIClient.prototype.methodology = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_methodology_defaults(config);
    if (this.is_valid_methodology(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/methodologies/' + config.id + '/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
},
                type: 'GET'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_methodology = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "id"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_methodology_defaults = function (config) {
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

        FAOSTATAPIClient.prototype.methodologies = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_methodologies_defaults(config);
    if (this.is_valid_methodologies(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/methodologies/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
},
                type: 'GET'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_methodologies = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_methodologies_defaults = function (config) {
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

        FAOSTATAPIClient.prototype.dimensions = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_dimensions_defaults(config);
    if (this.is_valid_dimensions(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/dimensions/' + config.domain_code + '/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
},
                type: 'GET'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_dimensions = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_dimensions_defaults = function (config) {
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

        FAOSTATAPIClient.prototype.codes = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_codes_defaults(config);
    if (this.is_valid_codes(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/codes/' + config.id + '/' + config.domain_code + '/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "domains": config.domains, "whitelist": config.whitelist, "blacklist": config.blacklist, "group_subdimensions": config.group_subdimensions, "subcodelists": config.subcodelists, "show_lists": config.show_lists, "show_full_metadata": config.show_full_metadata, "ord": config.ord
},
                type: 'GET'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_codes = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "domain_code", "lang", "id", "domains", "whitelist", "blacklist", "group_subdimensions", "subcodelists", "show_lists", "show_full_metadata", "ord"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_codes_defaults = function (config) {
    var i,
        parameters = ["datasource", "output_type", "api_key", "client_key", "domain_code", "lang", "id", "domains", "whitelist", "blacklist", "group_subdimensions", "subcodelists", "show_lists", "show_full_metadata", "ord"],
        defaults = {
            "datasource": "production", "output_type": "objects", "api_key": "n.a.", "client_key": "n.a.", "lang": "en", "domains": "[]", "whitelist": "[]", "blacklist": "[]", "group_subdimensions": "false", "show_lists": "false", "show_full_metadata": "true"
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

        FAOSTATAPIClient.prototype.groups = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_groups_defaults(config);
    if (this.is_valid_groups(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/groups/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "whitelist": config.whitelist, "blacklist": config.blacklist, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
},
                type: 'GET'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_groups = function(config) {
        var parameters = ["datasource", "whitelist", "blacklist", "output_type", "api_key", "client_key", "lang"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_groups_defaults = function (config) {
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

        FAOSTATAPIClient.prototype.domains = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_domains_defaults(config);
    if (this.is_valid_domains(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/domains/' + config.group_code + '/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key, "whitelist": config.whitelist, "blacklist": config.blacklist
},
                type: 'GET'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_domains = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "group_code", "whitelist", "blacklist"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_domains_defaults = function (config) {
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

        FAOSTATAPIClient.prototype.bulkdownloads = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_bulkdownloads_defaults(config);
    if (this.is_valid_bulkdownloads(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/bulkdownloads/' + config.domain_code + '/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
},
                type: 'GET'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_bulkdownloads = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_bulkdownloads_defaults = function (config) {
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

        FAOSTATAPIClient.prototype.documents = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_documents_defaults(config);
    if (this.is_valid_documents(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/documents/' + config.domain_code + '/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
},
                type: 'GET'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_documents = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "domain_code"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_documents_defaults = function (config) {
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

        FAOSTATAPIClient.prototype.groupsanddomains = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_groupsanddomains_defaults(config);
    if (this.is_valid_groupsanddomains(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/groupsanddomains/',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
},
                type: 'GET'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_groupsanddomains = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_groupsanddomains_defaults = function (config) {
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

        FAOSTATAPIClient.prototype.suggestions = function(config) {
    config = $.extend(true, {}, this.CONFIG, config || {});
    config = this.apply_suggestions_defaults(config);
    if (this.is_valid_suggestions(config)) {
            return Q($.ajax({
                url: this.CONFIG.base_url +  config.lang + '/suggestions/' + config.query + '',
                traditional: true,
                    data: {
    "datasource": config.datasource, "output_type": config.output_type, "api_key": config.api_key, "client_key": config.client_key
},
                type: 'GET'
            }));
    }
    throw 400;
};

    FAOSTATAPIClient.prototype.is_valid_suggestions = function(config) {
        var parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "query"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

FAOSTATAPIClient.prototype.apply_suggestions_defaults = function (config) {
    var i,
        parameters = ["datasource", "output_type", "api_key", "client_key", "lang", "query"],
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


    return FAOSTATAPIClient;

});