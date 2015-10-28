/*
 * grunt-writefile
 * https://github.com/lunsdorf/grunt-writefile
 *
 * Copyright (c) 2014 Sören Lünsdorf
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp'],
        },

        // Configuration to be run (and then tested).
        writefile: {
            value: {
                options: {
                    data: {
                        value: 'value'
                    }
                },
                src: 'test/fixtures/value.hbs',
                dest: 'tmp/value'
            },
            json_value: {
                options: {
                    data: 'test/fixtures/value.json'
                },
                src: 'test/fixtures/value.hbs',
                dest: 'tmp/json_value'
            },
            helper: {
                options: {
                    data: {
                        value: 'helper'
                    },
                    helpers: {
                        helper: function (value) {
                            return value;
                        }
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'test/fixtures/',
                    src: '**/helper.*',
                    dest: 'tmp/',
                }]
            },
            paths: {
                options: {
                    paths: {
                        value: 'test/fixtures/paths.*'
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'test/fixtures/',
                    src: '**/paths.*',
                    dest: 'tmp/',
                    flatten: true
                }]
            },
            paths_ext: {
                options: {
                    preserveExtension: true,
                    paths: {
                        value: {
                            cwd: 'test/fixtures',
                            src: '**/paths.*'
                        }
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'test/fixtures/',
                    src: '**/paths.*',
                    dest: 'tmp/',
                    flatten: true
                }]
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'writefile', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
