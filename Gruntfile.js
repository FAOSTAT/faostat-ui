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
            dev: {
                options: {
                    variables: {
                        'dest': 'dev',
                        'url_api': 'http://fenix.fao.org/faostat/dev/api/v1/'
                    }
                }
            },
            demo: {
                options: {
                    variables: {
                        'dest': 'demo',
                        'url_api': 'http://fenix.fao.org/faostat/demo/api/v1/'
                    }
                }
            },
            prod: {
                options: {
                    variables: {
                        'dest': 'prod',
                        'url_api': 'http://fenix.fao.org/faostat/api/v1/'
                    }
                }
            }
        },

        clean: {
            dist: {
                src: ['build/*']
            }
        },

        replace: {
            dist: {
                options: {
                    variables: {
                        'url_api': '<%= grunt.config.get("url_api") %>'
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
            }
        },

        compress: {
            faostat: {
                options: {
                    archive: 'build/<%= grunt.config.get("dest") %>/faostat-ui.zip',
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


        /*rename: {
         war: {
         files: [
         // {src: ['dist/war/faostat-ui.war.zip'], dest: 'dist/war/faostat-ui.war'}
         {src: ['dist/war/faostat-ui.war.zip'], dest: 'dist/war/faostat-ui.zip'}
         ]
         }
         }*/

    });

    grunt.registerTask('zip', [
        'clean:dist',

        // dev
        'config:dev',
        'copy:faostat',
        'replace:dist',
        'compress:faostat',

        // demo
        'config:demo',
        'copy:faostat',
        'replace:dist',
        'compress:faostat',

        // prod
        'config:prod',
        'copy:faostat',
        'replace:dist',
        'compress:faostat',


        //'rename:war'
    ]);

};


//TODO: Task to get domains for browse and download
