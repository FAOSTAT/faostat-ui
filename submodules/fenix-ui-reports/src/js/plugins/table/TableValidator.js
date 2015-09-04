define(['jquery'], function ($) {

    'use strict'


    function TableValidator() {

        this.errors = {
            plugin_not_exists: "the output plugin does not exists",
            data_or_md_not_exists:"please set metadata and data into configuration specified",
            language_not_exists: "language in the config does not exists",
            configuration_wrong:"please check the configuration"
        };

        this.languagesAdmitted = {
            EN: true,
            FR: true,
            ES: true
        };

        this.CONFIG = {
            "resource": {
                "metadata": {
                    "dsd": {}
                },
                "data": []
            },
            "input": {
                "plugin": "inputTable",
                "config": {
                    "uid": ""
                }
            },
            "output": {
                "plugin": "outputTable",
                "config": {
                    "lang": "EN"
                }
            }
        };

    }


    TableValidator.prototype.process = function (config) {

        /* Extend default configuration. */
        if(this.validateConfig(config)) {
            this.CONFIG = $.extend(true, {}, this.CONFIG, config);
        }
        return this.CONFIG;
    }


    TableValidator.prototype.validateConfig = function (config) {

        var result = false;
        // check data and metadata
        if (typeof config.resource !== 'undefined' && config.resource != null &&
            typeof config.resource.metadata !== 'undefined' && config.resource.metadata !== null &&
            typeof config.resource.metadata.dsd !== 'undefined' && config.resource.metadata.dsd !== null &&
            typeof config.resource.metadata.data !== 'undefined' && config.resource.metadata.data !==null ) {
            result = true;


        } else {
            throw this.errors.data_or_md_not_exists;
        }

        return result;
    }


    return TableValidator;
})