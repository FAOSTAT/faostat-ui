/*global define*/
define(['jquery'], function ($) {

    'use strict';

    function FAOSTATAPIClient(config) {

        /* Store configuration. */
        this.CONFIG = {
            api_key: null,
            client_key: null,
            base_url: 'http://fenixapps2.fao.org/api/v1.0/'
        };

        /* Extend default configuration. */
        this.CONFIG = $.extend(true, {}, this.CONFIG, config);

    }

    FAOSTATAPIClient.prototype.methodologies = function (config) {
        config = this.apply_methodologies_defaults(config);
        if (this.is_valid_methodologies(config)) {
            $.ajax({
                url: 'http://fenixapps2.fao.org/api/v1.0/' + config.lang + '/methodologies/',
                data: {},
                type: 'GET',
                success: config.success,
                error: config.error,
                context: config.context,
                always: config.always
            });
        } else {
            throw 400;
        }
    };

    FAOSTATAPIClient.prototype.is_valid_methodologies = function (config) {
        var parameters = ["lang"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    FAOSTATAPIClient.prototype.apply_methodologies_defaults = function (config) {
        var i,
            parameters = ["lang"],
            defaults = {
                "lang": "en"
            },
            key;
        for (i = 0; i < parameters.length; i += 1) {
            key = parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    FAOSTATAPIClient.prototype.dimensions = function (config) {
        config = this.apply_dimensions_defaults(config);
        if (this.is_valid_dimensions(config)) {
            $.ajax({
                url: 'http://fenixapps2.fao.org/api/v1.0/' + config.lang + '/dimensions/' + config.domain_code + '/',
                data: {
                    "datasource": config.datasource
                },
                type: 'GET',
                success: config.success,
                error: config.error,
                context: config.context,
                always: config.always
            });
        } else {
            throw 400;
        }
    };

    FAOSTATAPIClient.prototype.is_valid_dimensions = function (config) {
        var parameters = ["datasource", "lang", "domain_code"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    FAOSTATAPIClient.prototype.apply_dimensions_defaults = function (config) {
        var i,
            parameters = ["datasource", "lang", "domain_code"],
            defaults = {
                "datasource": "faostat", "lang": "en"
            },
            key;
        for (i = 0; i < parameters.length; i += 1) {
            key = parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    FAOSTATAPIClient.prototype.data = function (config) {
        config = this.apply_data_defaults(config);
        if (this.is_valid_data(config)) {
            $.ajax({
                url: 'http://fenixapps2.fao.org/api/v1.0//data/',
                data: {},
                type: 'GET',
                success: config.success,
                error: config.error,
                context: config.context,
                always: config.always
            });
        } else {
            throw 400;
        }
    };

    FAOSTATAPIClient.prototype.is_valid_data = function (config) {
        var parameters = [], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    FAOSTATAPIClient.prototype.apply_data_defaults = function (config) {
        var i,
            parameters = [],
            defaults = {},
            key;
        for (i = 0; i < parameters.length; i += 1) {
            key = parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    FAOSTATAPIClient.prototype.codes = function (config) {
        config = this.apply_codes_defaults(config);
        if (this.is_valid_codes(config)) {
            $.ajax({
                url: 'http://fenixapps2.fao.org/api/v1.0/' + config.lang + '/codes/' + config.codelist + '/',
                data: {
                    "datasource": config.datasource,
                    "domains": config.domains,
                    "whitelist": config.whitelist,
                    "blacklist": config.blacklist,
                    "subcodelists": config.subcodelists,
                    "show_lists": config.show_lists,
                    "show_full_metadata": config.show_full_metadata,
                    "ord": config.ord
                },
                type: 'GET',
                success: config.success,
                error: config.error,
                context: config.context,
                always: config.always
            });
        } else {
            throw 400;
        }
    };

    FAOSTATAPIClient.prototype.is_valid_codes = function (config) {
        var parameters = ["datasource", "lang", "codelist", "domains", "whitelist", "blacklist", "subcodelists", "show_lists", "show_full_metadata", "ord"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    FAOSTATAPIClient.prototype.apply_codes_defaults = function (config) {
        var i,
            parameters = ["datasource", "lang", "codelist", "domains", "whitelist", "blacklist", "subcodelists", "show_lists", "show_full_metadata", "ord"],
            defaults = {
                "datasource": "faostat", "lang": "en"
            },
            key;
        for (i = 0; i < parameters.length; i += 1) {
            key = parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    FAOSTATAPIClient.prototype.groups = function (config) {
        config = this.apply_groups_defaults(config);
        if (this.is_valid_groups(config)) {
            $.ajax({
                url: 'http://fenixapps2.fao.org/api/v1.0/' + config.lang + '/groups/',
                data: {
                    "datasource": config.datasource
                },
                type: 'GET',
                success: config.success,
                error: config.error,
                context: config.context,
                always: config.always
            });
        } else {
            throw 400;
        }
    };

    FAOSTATAPIClient.prototype.is_valid_groups = function (config) {
        var parameters = ["datasource", "lang"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    FAOSTATAPIClient.prototype.apply_groups_defaults = function (config) {
        var i,
            parameters = ["datasource", "lang"],
            defaults = {
                "datasource": "faostat", "lang": "en"
            },
            key;
        for (i = 0; i < parameters.length; i += 1) {
            key = parameters[i];
            try {
                config[key] = config[key] !== undefined ? config[key] : defaults[key];
            } catch (ignore) {
                /* No default value available for this parameter. */
            }
        }
        return config;
    };

    FAOSTATAPIClient.prototype.groupsanddomains = function (config) {
        config = this.apply_groupsanddomains_defaults(config);
        if (this.is_valid_groupsanddomains(config)) {
            $.ajax({
                url: 'http://fenixapps2.fao.org/api/v1.0/' + config.lang + '/groupsanddomains/',
                data: {
                    "datasource": config.datasource
                },
                type: 'GET',
                success: config.success,
                error: config.error,
                context: config.context,
                always: config.always
            });
        } else {
            throw 400;
        }
    };

    FAOSTATAPIClient.prototype.is_valid_groupsanddomains = function (config) {
        var parameters = ["datasource", "lang"], i;
        for (i = 0; i < parameters.length; i += 1) {
            if (config[parameters[i]] === undefined) {
                throw 'Parameter "' + parameters[i] + '" is undefined. Please check your request.';
            }
        }
        return true;
    };

    FAOSTATAPIClient.prototype.apply_groupsanddomains_defaults = function (config) {
        var i,
            parameters = ["datasource", "lang"],
            defaults = {
                "datasource": "faostat", "lang": "en"
            },
            key;
        for (i = 0; i < parameters.length; i += 1) {
            key = parameters[i];
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