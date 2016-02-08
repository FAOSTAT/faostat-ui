'use strict';

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    //grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-rename');


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
        clean: {
            dist: {
                src: ['dist/war/*']
            }
        },

        war: {
            target: {
                options: {
                    //war_dist_folder: 'dist/war/',    /* Folder where to generate the WAR. */
                    war_dist_folder: '/home/vortex/Desktop/',
                    war_name: 'faostat-ui'                    /* The name fo the WAR file (.war will be the extension) */
                },
                files: [
                    {
                        expand: true,
                        cwd: './',
                        src: ['**'],
                        dest: ''
                    }
                ]
            }
        },

        compress: {
            faostat: {
                options: {
                    archive: 'dist/war/faostat-ui.war.zip',
                    mode: 'zip'
                },
                files: [
                    {
                        src: [
                            './*',
                            'config/**',
                            'dist/**',
                            'i18n/**',
                            'submodules/**',
                            'src/**'
                        ]
                    }
                ]
            }
        },

        rename: {
            war: {
                files: [
                    {src: ['dist/war/faostat-ui.war.zip'], dest: 'dist/war/faostat-ui.war'}
                ]
            }
        }

    });

    grunt.registerTask('war', [
        'clean:dist',
        'compress:faostat',
        'rename:war'
    ]);

};


//TODO: Task to get domains for browse and download