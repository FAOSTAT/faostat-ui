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

        /* Declare variables. */
        var inject_params,
            final_url,
            i,
            z,
            q,
            start,
            end,
            param,
            get_path_parameters,
            out,
            create_methods,
            module_name,
            sanitize_module_name;

        /* Sanitize module name. */
        sanitize_module_name = function () {
            module_name = grunt.option('output_name');
            module_name = module_name.replace(/-/g, '');
            return module_name;
        };

        /* Inject parameters in the URL. */
        inject_params = function (base_url, href) {
            final_url = base_url + href;
            start = null;
            end = null;
            for (q = 0; q < href.length; q += 1) {
                if (href.charAt(q) === '{') {
                    start = q;
                }
                if (href.charAt(q) === '}') {
                    end = q;
                }
                if (start !== null && end !== null) {
                    param = href.substring(1 + start, end);
                    final_url = final_url.replace(href.substring(start, 1 + end), '\' + ' + 'config.' + param + ' + \'');
                    start = null;
                    end = null;
                }
            }
            return final_url;
        };

        /* Get the list of path parameters, if any. */
        get_path_parameters = function (href) {
            out = [];
            start = null;
            end = null;
            for (z = 0; z < href.length; z += 1) {
                if (href.charAt(z) === '{') {
                    start = z;
                }
                if (href.charAt(z) === '}') {
                    end = z;
                }
                if (start !== null && end !== null) {
                    out.push(href.substring(1 + start, end));
                    start = null;
                    end = null;
                }
            }
            return out;
        };

        create_methods = function (schema) {

            var method_source,
                method_template,
                l,
                j,
                o,
                z,
                p,
                url,
                defaults = [],
                defaults_string = '',
                parameters,
                path_parameters,
                data,
                data_source,
                data_template,
                data_dynamic_data,
                method_dynamic_data,
                data_html,
                data_string = '',
                methods,
                Handlebars,
                ref;

            /* Load Handlebars. */
            /*global require*/
            Handlebars = require('handlebars');

            /* Create one method for each link contained in the JSON Schema. */
            methods = [];
            method_source = grunt.file.read(__dirname + '/../src/templates/method.hbs', [null, {encoding: 'utf8'}]);
            method_template = Handlebars.compile(method_source);

            for (i = 0; i < schema.links.length; i += 1) {

                /* Store current service description. */
                l = schema.links[i];

                /* Generate query parameters object. */
                path_parameters = get_path_parameters(l.href);
                data = [];
                for (j = 0; j < Object.keys(l.schema.properties).length; j += 1) {
                    o = Object.keys(l.schema.properties)[j];
                    if (path_parameters.indexOf(Object.keys(l.schema.properties)[j]) < 0) {
                        data.push(o);
                    }
                }
                data_source = grunt.file.read(__dirname + '/../src/templates/data.hbs', [null, {
                    encoding: 'utf8'
                }]);
                data_template = Handlebars.compile(data_source);
                data_string = '';
                for (j = 0; j < data.length; j += 1) {
                    data_string += '"' + data[j] + '": config.' + data[j];
                    if (j < data.length - 1) {
                        data_string += ', ';
                    }
                }
                data_dynamic_data = {
                    data: data_string
                };
                data_html = data_template(data_dynamic_data);

                /* Collect parameter names for the validation function. */
                parameters = '';
                defaults = [];
                defaults_string = '';
                for (z = 0; z < Object.keys(l.schema.properties).length; z += 1) {
                    parameters += '"' + Object.keys(l.schema.properties)[z] + '"';
                    if (z < Object.keys(l.schema.properties).length - 1) {
                        parameters += ', ';
                    }
                    /* Look for default values in the definitions section. */
                    if (l.schema.properties[Object.keys(l.schema.properties)[z]] !== undefined) {
                        ref = l.schema.properties[Object.keys(l.schema.properties)[z]].$ref;
                        if (ref !== undefined) {
                            ref = ref.substring(1 + ref.lastIndexOf('/'));
                            if (schema.definitions[ref].default !== undefined) {
                                defaults.push('"' + Object.keys(l.schema.properties)[z] + '": "' + schema.definitions[ref].default + '"');
                            }
                        }
                    }
                    /* Look for default values in the link definition. */
                    if (l.schema.properties[Object.keys(l.schema.properties)[z]].default !== undefined) {
                        defaults.push('"' + Object.keys(l.schema.properties)[z] + '": "' + l.schema.properties[Object.keys(l.schema.properties)[z]].default + '"');
                    }
                }

                /* Create defaults string. */
                for (z = 0; z < defaults.length; z += 1) {
                    defaults_string += defaults[z];
                    if (z < defaults.length - 1) {
                        defaults_string += ', ';
                    }
                }

                /* Create URL. */
                url = l.href;
                for (z = 0; z < path_parameters.length; z += 1) {
                    p = "' + config." + path_parameters[z] + " + '";
                    url = url.replace("{" + path_parameters[z] + "}", p);
                    if (z === path_parameters.length - 1) {
                        url = url + "'";
                    }
                }

                /* Remove the first characters to have a valid string. */
                url = url.substring(3);

                /* Generate the method. */
                method_dynamic_data = {
                    /** @namespace schema.definitions */
                    url: url,
                    method: '\'' + l.method.toString().toUpperCase() + '\'',
                    rel: l.rel,
                    parameters: parameters,
                    defaults: defaults_string,
                    data: data_html,
                    module_name: sanitize_module_name(),
                    q: grunt.option('useQ')
                };
                methods.push(method_template(method_dynamic_data));



            }

            /* Return compiled template. */
            return methods;

        };

        /* Plugin entry point. */
        grunt.registerMultiTask('jsonschema_amd_restclient_generator', function () {

            /* Merge options. */
            var options = this.options({});

            /* Fix the base URL, if needed. */
            //if (options.base_url.charAt(options.base_url.length - 1) === '/') {
            //    options.base_url = options.base_url.substr(0, options.base_url.length - 1);
            //}

            /* Make the options global. */
            grunt.option('base_url', options.base_url);
            grunt.option('output_name', options.output_name);
            grunt.option('output_folder', options.output_folder);
            grunt.option('useQ', options.useQ);

            /* Specify the next task to run. */
            grunt.task.run('fetch_json_schema');

        });

        /* Curl task. */
        grunt.registerTask('fetch_json_schema', 'Fetch JSON Schema from remote URL and store it in a local file.', function () {

            /* Configure Curl and download the JSON Schema. */
            grunt.initConfig({
                curl: {
                    'resources/json/schema.json': grunt.option('base_url')
                }
            });
            grunt.loadNpmTasks('grunt-curl');
            grunt.task.run('curl');

            /* Specify the next task to run. */
            grunt.task.run('generate_client');

        });

        /* Register task. */
        grunt.registerTask('generate_client', 'Generate an AMD client for REST web services described by a JSON Schema.', function () {

            /* Load required libraries. */
            var Handlebars,
                schema,
                methods,
                source,
                template,
                dynamic_data,
                html;

            /* Load Handlebars. */
            /*global require*/
            Handlebars = require('handlebars');

            /* Load JSON Schema into an object. */
            schema = grunt.file.readJSON('resources/json/schema.json');

            /* For each link in links -> create method. */
            methods = create_methods(schema);

            /* Load Handlebars template for tiles. */
            source = grunt.file.read(__dirname + '/../src/templates/archetype.hbs', [null, {
                encoding: 'utf8'
            }]);
            template = Handlebars.compile(source);
            dynamic_data = {
                methods: methods,
                validators: 'validators',
                module_name: sanitize_module_name,
                base_url: '\'' + grunt.option('base_url') + '\'',
                q: grunt.option('useQ')
            };
            html = template(dynamic_data);

            /* Write the file. */
            grunt.file.write(grunt.option('output_folder') + '/' + grunt.option('output_name') + '.js', html, [null, {encoding: 'utf8'}]);

            /* Specify the next task to run. */
            grunt.task.run('minify_client');

        });

        grunt.registerTask('minify_client', 'Generate an AMD client for REST web services described by a JSON Schema.', function () {
            var dist,
                uglify;
            dist = grunt.option('output_folder') + '/' + grunt.option('output_name') + '.min.js';
            uglify = {};
            uglify.target = {};
            uglify.target.files = {};
            uglify.target.files[dist] = [grunt.option('output_folder') + '/' +  grunt.option('output_name') + '.js'];
            /** @namespace grunt.initConfig */
            grunt.initConfig({
                uglify: uglify
            });
            grunt.loadNpmTasks('grunt-contrib-uglify');
            grunt.task.run('uglify');
        });

    };

}());
