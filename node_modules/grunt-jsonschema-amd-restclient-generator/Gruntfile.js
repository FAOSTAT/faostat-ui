/*
 * grunt-jsonschema-amd-restclient-generator
 * https://github.com/geobricks/grunt-jsonschema-amd-restclient-generator
 *
 * Copyright (c) 2015 Guido Barbaglia
 * Licensed under the MIT license.
 */

(function () {

    'use strict';

    /*global module*/
    module.exports = function (grunt) {

        /* Project configuration. */
        grunt.initConfig({

            /* Plugin configuration. */
            jsonschema_amd_restclient_generator: {
                custom_options: {
                    options: {
                        base_url: 'http://fenixapps2.fao.org/api/v1.0/',
                        output_name: 'RESTClient',
                        output_folder: 'src/js',
                        useQ: true
                    }
                }
            }

        });

        /* Actually load this plugin's task(s). */
        grunt.loadTasks('tasks');

        /* Test task. */
        grunt.registerTask('default', ['jsonschema_amd_restclient_generator']);

    };

}());
