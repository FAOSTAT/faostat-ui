'use strict';

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    //grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-contrib-compress');
    //grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-config');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/* \n' +
            ' * <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * \n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * License: <%= pkg.license %>\n' +
            ' * Homepage: <%= pkg.homepage %>\n' +
            ' * Source: <%= pkg.repository.url %>\n' +
            ' * \n' +
            ' */\n'
        },

        config: {
            default: {
                options: {}
            },
            prod: {
                options: {
                    variables: {
                        'dest': 'prod/<%= grunt.config.get("locale") %>/',
                        'url_api': 'http://fenixservices.fao.org/faostat/api/v1/',
                        'mode': 'prod',
                        'config_file': 'build_utils/Config-prod.js',
                        'locale_file': 'main.js',
                        'appcache_file': 'faostat.appcache'
                    }
                }
            },
            internal: {
                options: {
                    variables: {
                        'dest': 'internal/<%= grunt.config.get("locale") %>/',
                        'url_api': 'http://fenix.fao.org/faostat/internal/api/v1/',
                        'mode': 'internal',
                        'config_file': 'build_utils/Config-all.js',
                        'locale_file': 'main.js',
                        'appcache_file': 'faostat.appcache'
                    }
                }
            },
            dev: {
                options: {
                    variables: {
                        'dest': 'dev/<%= grunt.config.get("locale") %>/',
                        'url_api': 'http://fenix.fao.org/faostat/dev/api/v1/',
                        'mode': 'dev',
                        'config_file': 'build_utils/Config-all.js',
                        'locale_file': 'main.js',
                        'appcache_file': 'faostat.appcache'
                    }
                }
            },
            dev_internal: {
                options: {
                    variables: {
                        'dest': 'dev_internal/<%= grunt.config.get("locale") %>/',
                        'url_api': 'http://fenix.fao.org/faostat/dev/api/v1/',
                        'mode': 'dev_internal',
                        'config_file': 'build_utils/Config-all.js',
                        'locale_file': 'main.js',
                        'appcache_file': 'faostat.appcache'
                    }
                }
            },
            // TODO: to be reviewed the QA
            qa: {
                options: {
                    variables: {
                        'dest': 'qa/<%= grunt.config.get("locale") %>/',
                        'url_api': 'http://fenix.fao.org/faostat/qa/api/v1/',
                        'mode': 'qa',
                        'config_file': 'build_utils/Config-all.js',
                        'locale_file': 'main.js',
                        'appcache_file': 'faostat.appcache'
                    }
                }
            },
        },

        clean: {
            dist: {
                src: ['build/*']
            },
            'faostat-config': {
                src: [
                    'build/<%= grunt.config.get("dest") %>/Config-all.js',
                    'build/<%= grunt.config.get("dest") %>/Config-prod.js'
                ]
            }
        },

        copy: {
            faostat: {
                files: [
                    {
                        src: [
                            //'./*',
                            './index.html',
                            './main.js',
                            './faostat.appcache',
                            './humans.txt',
                            'config/**',
                            'dist/**',
                            'i18n/**',
                            'src/**',
                            'submodules/faostat-ui-download/**',
                            'submodules/faostat-ui-download-options/**',
                            'submodules/faostat-ui-download-selector/**',
                            'submodules/faostat-ui-download-selectors-manager/**',
                            'submodules/faostat-ui-menu/**',
                            'submodules/faostat-ui-metadata-viewer/**',
                            'submodules/faostat-ui-pivot/src/**',
                            'submodules/faostat-ui-pivot/html/**',
                            'submodules/faostat-ui-pivot/dist/**',
                            'submodules/faostat-ui-report/nls/**',
                            'submodules/faostat-ui-report/**',
                            'submodules/faostat-ui-report-table/**',
                            'submodules/faostat-ui-tree/**',
                            'submodules/fenix-ui-chart-creator/**',
                            'submodules/fenix-ui-common/js/**',
                            'submodules/fenix-ui-common/config/**',
                            'submodules/fenix-ui-common/css/img/**',
                            'submodules/fenix-ui-dashboard/**',
                            'submodules/fenix-ui-map/dist/**',
                            'submodules/fenix-ui-map-creator/**',
                            // in theory should be not imported all the tests but it slows down
                            '!submodules/fenix-ui-map-creator/tests/**',
                            '!submodules/fenix-ui-map/tests/**',
                            '!submodules/fenix-ui-chart-creator/tests/**',
                            //'!submodules/**/css/**',
                            //'!submodules/fenix-ui-common/test/**',
                            // TODO: check explicit to don't import
                            // 'submodules/**',
                            // '!**/tests/**',
                            // '!**/test/**',
                            // '!**/node_modules/**',
                            // '!**/docs/**',
                            // '!**/faostat-ui-bulk-downloads/**',
                            // '!**/faostat-ui-options-manager/**',
                            // '!**/faostat-ui-table/**',
                            // '!**/faostat-ui-welcome-page/**',
                            // '!**/fenix-ui-common/**',
                            // '!**/fenix-ui-reports/**',
                            // '!**/json-editor-faostat-theme/**'

                        ],
                        dest: 'build/<%= grunt.config.get("dest") %>/'
                    }
                ]
            },
            redirect: {
                files: [
                    {
                        src: [
                            'build_utils/redirect.html'
                        ],
                        dest: 'build/<%= grunt.config.get("mode") %>/index.html'
                    }
                ]
            },
            'faostat-arabic-language': {
                files: [
                    {
                        src: [
                            'index-ar.html'
                        ],
                        dest: 'build/<%= grunt.config.get("dest") %>/index.html'
                    }
                ]
            }
        },

        // TODO: here map the variables for the lang in the main-all-lang.js file
        replace: {
            dist: {
                options: {
                    variables: {
                        'url_api': '<%= grunt.config.get("url_api") %>',
                        'mode': '<%= grunt.config.get("mode") %>'
                    },
                    force: true
                },
                files: [
                    {
                        expand: true,
                        src: ['src/js/FAOSTATAPIClient.js'],
                        dest: 'build/<%= grunt.config.get("dest") %>/'
                    }
                    //dest: 'dist/zip/<%= grunt.config.get("dest") %>/faostat-ui/src/js/'}
                ]
            },
            'faostat-config': {
                options: {
                    patterns: [
                        {
                            match: 'version',
                            replacement: '<%= pkg.version %>',
                            expression: false   // simple variable lookup
                        },
                        {
                            match: 'date_update',
                            replacement: '<%= grunt.template.today() %>',
                            expression: false   // simple variable lookup
                        }
                    ]
                },
                files: [{
                    src: ['<%= grunt.config.get("config_file") %>'],
                    dest: 'build/<%= grunt.config.get("dest") %>/config/Config.js'
                }]
            },
            'faostat-locale': {
                options: {
                    variables: {
                        'locale': '<%= grunt.config.get("locale") %>',
                    },
                    force: true
                },
                files: [
                    {
                        src: '<%= grunt.config.get("locale_file") %>',
                        dest: 'build/<%= grunt.config.get("dest") %>/main.js',
                    }
                ]
            },
            'faostat-appcache': {
                options: {
                    patterns: [
                        {
                            match: 'version',
                            replacement: '<%= pkg.version %>',
                            expression: false   // simple variable lookup
                        },
                        {
                            match: 'date_update',
                            replacement: '<%= grunt.template.today() %>',
                            expression: false   // simple variable lookup
                        }
                    ]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['<%= grunt.config.get("appcache_file") %>'],
                    dest: 'build/<%= grunt.config.get("dest") %>/'
                }]
            }
        },

        compress: {
            faostat: {
                options: {
                    archive: 'build/<%= grunt.config.get("mode") %>/faostat-ui-<%= grunt.config.get("mode") %>.tar',
                    mode: 'tar'
                },
                files: [{
                    expand: true,
                    cwd: 'build/<%= grunt.config.get("mode") %>/',
                    src: [
                        './**'
                    ]
                }]
                /* src: [
                 './*',
                 'config/**',
                 // TODO: check if css is enough.
                 'dist/**',
                 'i18n/**',
                 'submodules/**',
                 'src/**'
                 ]
                 }]*/
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

    grunt.registerTask('build', 'Run all my build tasks.', function () {

        grunt.log.writeln('\n\n\n\n\n\n----------THINGS TO BE CHECKED--------\n');
        grunt.log.writeln('2) Did you check the appcache?');
        grunt.log.writeln('\n--------------------------------------\n\n\n\n\n\n');

        // defaults
        grunt.task.run('clean:dist');

        grunt.task.run('en');
        grunt.task.run('fr');
        grunt.task.run('es');
        grunt.task.run('ar');
        grunt.task.run('ru');
        grunt.task.run('zh');
        grunt.task.run('compress_dev');
        grunt.task.run('compress_dev_internal');
        grunt.task.run('compress_internal');
        grunt.task.run('compress_prod');
        grunt.task.run('compress_qa');

    });



    grunt.registerTask('en', 'Building English', function () {

        // dev
        grunt.config.set('locale', 'en');
        grunt.task.run('config:dev');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // dev-internal
        grunt.config.set('locale', 'en');
        grunt.task.run('config:dev_internal');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // internal
        grunt.task.run('config:internal');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // prod
        grunt.task.run('config:prod');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // qa
        grunt.task.run('config:qa');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

    });

    grunt.registerTask('fr', 'Building French', function () {

        // dev
        grunt.config.set('locale', 'fr');
        grunt.task.run('config:dev');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // dev-internal
        grunt.config.set('locale', 'fr');
        grunt.task.run('config:dev_internal');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // internal
        grunt.task.run('config:internal');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // prod
        grunt.task.run('config:prod');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // qa
        grunt.task.run('config:qa');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

    });

    grunt.registerTask('es', 'Building Spanish', function () {

        // dev
        grunt.config.set('locale', 'es');
        grunt.task.run('config:dev');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // dev-internal
        grunt.config.set('locale', 'es');
        grunt.task.run('config:dev_internal');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // internal
        grunt.task.run('config:internal');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // prod
        grunt.task.run('config:prod');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // qa
        grunt.task.run('config:qa');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

    });

    grunt.registerTask('ru', 'Building Russian', function () {

        // dev
        grunt.config.set('locale', 'ru');
        grunt.task.run('config:dev');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // dev-internal
        grunt.config.set('locale', 'ru');
        grunt.task.run('config:dev_internal');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // internal
        grunt.task.run('config:internal');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // prod
        grunt.task.run('config:prod');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // qa
        grunt.task.run('config:qa');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

    });

    grunt.registerTask('zh', 'Building Chinese', function () {

        // dev
        grunt.config.set('locale', 'zh');
        grunt.task.run('config:dev');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // dev-internal
        grunt.config.set('locale', 'zh');
        grunt.task.run('config:dev_internal');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // internal
        grunt.task.run('config:internal');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // prod
        grunt.task.run('config:prod');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

        // qa
        grunt.task.run('config:qa');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        grunt.task.run('replace:faostat-appcache');

    });

    grunt.registerTask('ar', 'Building Arabic', function () {

        // dev
        grunt.config.set('locale', 'ar');
        grunt.task.run('config:dev');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        //grunt.task.run('copy:faostat-arabic-language');
        grunt.task.run('replace:faostat-appcache');

        // dev-internal
        grunt.task.run('config:dev_internal');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        //grunt.task.run('copy:faostat-arabic-language');
        grunt.task.run('replace:faostat-appcache');

        // internal
        grunt.task.run('config:internal');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        //grunt.task.run('copy:faostat-arabic-language');
        grunt.task.run('replace:faostat-appcache');

        // prod
        grunt.task.run('config:prod');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        //grunt.task.run('copy:faostat-arabic-language');
        grunt.task.run('replace:faostat-appcache');

        // qa
        grunt.task.run('config:qa');
        grunt.task.run('copy:faostat');
        grunt.task.run('replace:dist');
        grunt.task.run('replace:faostat-config');
        grunt.task.run('replace:faostat-locale');
        //grunt.task.run('copy:faostat-arabic-language');
        grunt.task.run('replace:faostat-appcache');


    });

    grunt.registerTask('compress_dev', 'Compress all folders', function () {
        grunt.task.run('config:dev');
        grunt.task.run('copy:redirect');
        grunt.task.run('compress:faostat');
    });

    grunt.registerTask('compress_dev_internal', 'Compress all folders', function () {
        grunt.task.run('config:dev_internal');
        grunt.task.run('copy:redirect');
        grunt.task.run('compress:faostat');
    });

    grunt.registerTask('compress_internal', 'Compress all folders', function () {
        grunt.task.run('config:internal');
        grunt.task.run('copy:redirect');
        grunt.task.run('compress:faostat');
    });

    grunt.registerTask('compress_prod', 'Compress all folders', function () {
        grunt.task.run('config:prod');
        grunt.task.run('copy:redirect');
        grunt.task.run('compress:faostat');
    });

    grunt.registerTask('compress_qa', 'Compress all folders', function () {
        grunt.task.run('config:qa');
        grunt.task.run('copy:redirect');
        grunt.task.run('compress:faostat');
    });

};
