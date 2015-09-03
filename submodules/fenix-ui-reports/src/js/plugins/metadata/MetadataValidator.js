define(['jquery'], function ($) {

    'use strict';


    function MetadataValidator() {

        this.errors = {
            id_not_specified: "please put an id into config.input",
            plugin_not_exists: "the output plugin does not exists",
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
                "plugin": "inputMD",
                "config": {
                    "uid": ""
                }
            },
            "output": {
                "plugin": "outputMD",
                "config": {
                    "full": false,
                    "lang": "EN"
                }
            }
        };

    }


    MetadataValidator.prototype.process = function (config) {

        /* Extend default configuration. */
        if(this.validateConfig(config)) {
            this.CONFIG = $.extend(true, {}, this.CONFIG, config);
        }
        return this.CONFIG;
    };


    MetadataValidator.prototype.validateConfig = function (config) {

        var result = false;
        // check id of che metadata
        if (typeof config.input !== 'undefined' && config.input !== null &&
            typeof config.input.config !== 'undefined' && config.input.config !== null &&
            typeof config.input.config.uid !== 'undefined' && config.input.config.uid !== null &&
            config.input.uid !== '' ) {
            result = true;
            // output configuration
            if (config.hasOwnProperty("output")) {
                // check the lang
                if (!config.output.hasOwnProperty("plugin") &&
                    config.output.hasOwnProperty("config") && config.output.config.hasOwnProperty("lang") &&
                    config.output.config.lang !== null && this.languagesAdmitted[config.output.config.lang]){
                    result = true;
                }

                else {
                    throw this.errors.configuration_wrong;
                }
            }
        } else {
            throw this.errors.id_not_specified;
        }

        return result;
    };


    return MetadataValidator;
})