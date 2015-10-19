define(['jquery'], function($) {

    'use strict';

    function FMDValidator (){

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
                "plugin": "inputFMD",
                "config": {
                    "uid": ""
                }
            },
            "output": {
                "plugin": "outputFMD",
                "config": {
                    "lang": "EN"
                }
            }
        };
    };


    FMDValidator.prototype.process = function (config) {

        /* Extend default configuration. */
        if(this.validateConfig(config)) {
            this.CONFIG = $.extend(true, {}, this.CONFIG, config);
        }
        return this.CONFIG;
    };


    FMDValidator.prototype.validateConfig = function (config) {
        return true; // TODO
    };


    return FMDValidator;
})