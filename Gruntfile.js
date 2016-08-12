'use strict';

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    //grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-config');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner:
            '/* \n'+
            ' * <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n'+
            ' * \n'+
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n'+
            ' * License: <%= pkg.license %>\n'+
            ' * Homepage: <%= pkg.homepage %>\n'+
            ' * Source: <%= pkg.repository.url %>\n'+
            ' * \n'+
            ' */\n'
        },

        config: {
            default: {
                options: {
                    variables: {
                        'version': '0.1',
                        'date_update': grunt.template.today(),

                    }
                }
            },
            dev: {
                options: {
                    variables: {
                        'dest': 'dev',
                        'url_api': 'http://fenix.fao.org/faostat/dev/api/v1/',
                        'mode': 'dev',
                        'config_file': 'Config-all.js'
                    }
                }
            },
            demo: {
                options: {
                    variables: {
                        'dest': 'demo',
                        'url_api': 'http://fenix.fao.org/faostat/demo/api/v1/',
                        'mode': 'demo',
                        'config_file': 'Config-all.js'
                    }
                }
            },
            internal: {
                options: {
                    variables: {
                        'dest': 'internal',
                        'url_api': 'http://fenix.fao.org/faostat/internal/api/v1/',
                        'mode': 'internal',
                        'config_file': 'Config-all.js'
                    }
                }
            },
            prod: {
                options: {
                    variables: {
                        'dest': 'prod',
                        'url_api': 'http://fenixservices.fao.org/faostat/api/v1/',
                        'mode': 'prod',
                        'config_file': 'Config-prod.js'
                    }
                }
            }
        },

        clean: {
            dist: {
                src: ['build/*']
            },
            'faostat-config': {
                src: [
                    'build/<%= grunt.config.get("dest") %>/faostat-ui/Config-all.js',
                    'build/<%= grunt.config.get("dest") %>/faostat-ui/Config-prod.js'
                ]
            }
        },

        copy: {
            faostat: {
                files: [
                    {
                        src: [
                            './*',
                            'config/**',
                            'dist/**',
                            'i18n/**',
                            'submodules/**',
                            'src/**'
                        ],
                        dest: 'build/<%= grunt.config.get("dest") %>/faostat-ui/'
                    }
                ]
            },
            /*'faostat-config': {
             files: [
             {
             src:'<%= grunt.config.get("config_file") %>',
             dest:'build/<%= grunt.config.get("dest") %>/faostat-ui/config/Config.js'
             }
             ]
             }*/
        },

        replace: {
            dist: {
                options: {
                    variables: {
                        'url_api': '<%= grunt.config.get("url_api") %>',
                        'mode': '<%= grunt.config.get("mode") %>',
                        //'mode': '<%= grunt.config.get("mode") %>',
                    },
                    force: true
                },
                files: [
                    {
                        expand: true,
                        src: ['src/js/FAOSTATAPIClient.js'],
                        dest: 'build/<%= grunt.config.get("dest") %>/faostat-ui/'
                    }
                    //dest: 'dist/zip/<%= grunt.config.get("dest") %>/faostat-ui/src/js/'}
                ]
            },
            'faostat-config': {
                options: {
                    variables: {
                        'date_update': '<%= grunt.config.get("date_update") %>',
                        'version': '<%= grunt.config.get("version") %>'
                    },
                    force: true
                },
                files: [
                    {
                        src:'<%= grunt.config.get("config_file") %>',
                        dest:'build/<%= grunt.config.get("dest") %>/faostat-ui/config/Config.js'
                    }
                    //dest: 'dist/zip/<%= grunt.config.get("dest") %>/faostat-ui/src/js/'}
                ]
            }
        },

        compress: {
            faostat: {
                options: {
                    archive: 'build/<%= grunt.config.get("dest") %>/faostat-ui-<%= grunt.config.get("mode") %>.zip',
                    mode: 'zip'
                },
                files: [{
                    expand: true,
                    cwd: 'build/<%= grunt.config.get("dest") %>/faostat-ui/',
                    src: [
                        './*',
                        'config/**',
                        // TODO: check if css is enough.
                        'dist/**',
                        'i18n/**',
                        'submodules/**',
                        'src/**'
                    ]
                }]
            }
        },

        end: {
            log: function() {
                grunt.log("end")
            }
        }

        /*rename: {
         war: {
         files: [
         // {src: ['dist/war/faostat-ui.war.zip'], dest: 'dist/war/faostat-ui.war'}
         {src: ['dist/war/faostat-ui.war.zip'], dest: 'dist/war/faostat-ui.zip'}
         ]
         }
         }*/

    });

    grunt.registerTask('zip', 'Run all my build tasks.', function() {

        grunt.log.writeln('\n\n\n\n\n\n----------THINGS TO BE CHECKED--------\n');
        grunt.log.writeln('1) Did you check in FAOSTATApi the @@url parameter?');
        grunt.log.writeln('2) Did you check the appcache?');
        grunt.log.writeln('3) Did you update the cache version?');
        grunt.log.writeln('\n--------------------------------------\n\n\n\n\n\n');

        // defaults
        grunt.task.run('clean:dist');
        grunt.task.run('config:default');

        // dev
        grunt.task.run('config:dev');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('compress:faostat');


        // internal
        grunt.task.run('config:internal');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('compress:faostat');

        // prod
        grunt.task.run('config:prod');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('compress:faostat');


    });

    // grunt.registerTask('zip', [
    //
    //     // clean dist
    //     'clean:dist',
    //
    //     // default configuration
    //     'config:default',
    //
    //     // dev
    //     'config:dev',
    //     'copy:faostat',
    //     //'copy:faostat-config',
    //     'replace:dist',
    //     'replace:faostat-config',
    //     //'clean:faostat-config',
    //     'compress:faostat',
    //
    //     // demo
    //     /*
    //     'config:demo',
    //     'copy:faostat',
    //     //'copy:faostat-config',
    //     'replace:dist',
    //     'replace:faostat-config',
    //     'compress:faostat',
    //     */
    //
    //     // internal
    //     'config:internal',
    //     'copy:faostat',
    //     //'copy:faostat-config',
    //     'replace:dist',
    //     'replace:faostat-config',
    //     'compress:faostat',
    //
    //     // prod
    //     'config:prod',
    //     'copy:faostat',
    //     //'copy:faostat-config',
    //     'replace:dist',
    //     'replace:faostat-config',
    //     'compress:faostat',
    //
    //     'end:log'
    //
    //     //'rename:war'
    // ]);

};


//TODO: Task to get domains for browse and download
