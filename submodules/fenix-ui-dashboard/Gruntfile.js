'use strict';

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-jsonlint');
	grunt.loadNpmTasks('grunt-jsdoc');

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
                src: ['dist/*']
            },
            lib: {
                src: ['src/lib/*']
            },
            docs: {
                src: ['docs/*']
            }
        },
        jshint: {
            options: {
                globals: {
                    console: true,
                    module: true
                },
                "-W099": true, //ignora tabs e space warning
                "-W033": true
            },
            files: ['src/*.js']//, '!src/file-excluded.js']
        },
        jsonlint: {
            i18n: {
                src: ['i18n/*.json']
            }
        },
        copy: {
            jquery: {
                nonull: true,
                src: 'node_modules/jquery/dist/jquery.min.js',
                dest: 'src/lib/jquery.js'
            },
            backbone: {
                nonull: true,
                src: 'node_modules/backbone/backbone-min.js',
                dest: 'src/lib/backbone.js'
            },
            "backbone.layoutmanager": {
                nonull: true,
                src: "node_modules/backbone.layoutmanager/backbone.layoutmanager.js",
                dest: "src/lib/backbone.layoutmanager.js"
            },
            bootstrap_js: {
                nonull: true,
                src: "node_modules/bootstrap/dist/js/bootstrap.min.js",
                dest: 'src/lib/bootstrap.js'
            },
            bootstrap_css: {
                nonull: true,
                src: "node_modules/bootstrap/dist/css/bootstrap.min.css",
                dest: "src/lib/bootstrap.css"
            },
            nprogress_js: {
                nonull: true,
                src: "node_modules/nprogress/nprogress.js",
                dest: "src/lib/nprogress.js"
            },
            nprogress_css: {
                nonull: true,
                src: "node_modules/nprogress/nprogress.css",
                dest: "src/lib/nprogress.css"
            },
            requirejs: {
                nonull: true,
                src: "node_modules/requirejs/require.js",
                dest: "src/lib/require.js"
            },
			domready: {
				nonull: true,
				src: "node_modules/domReady/domReady.js",
				dest: "src/lib/domready.js"
			},
			text: {
				nonull: true,
				src: "node_modules/text/text.js",
				dest: "src/lib/text.js"
			},
			i18n: {
				nonull: true,
				src: "node_modules/i18n/i18n.js",
				dest: "src/lib/i18n.js"
			},			
			underscore: {
				nonull: true,
				src: "node_modules/underscore/underscore-min.js",
				dest: "src/lib/underscore.js"
			},
			jqwidgets_js: {
				nonull: true,
				src: "node_modules/jqwidgets/jqx-all.js",
				dest: "src/lib/jqwidgets.js"
			},
			jqwidgets_css: {
				nonull: true,
				src: "node_modules/jqwidgets/styles/jqx.base.css",
				dest: "src/lib/jqwidegts.css"
			},
			handlebars: {
				nonull: true,
				src: "node_modules/handlebars/dist/handlebars.min.js",
				dest: "src/lib/handlebars.js"
			},
			jstree: {
				nonull: true,
				expand: true,
				//flatten: true,
				cwd: "node_modules/jstree/dist/",
				src: '**',
				dest: "src/lib/jstree/"
			}
        },
        jsdoc: {
            dist: {
                src: ["src/*.js"],
                options: {
                    destination: 'docs'
                }
            }
        }
    });

//TODO task for removing README.md from any subdirs

    grunt.registerTask('docs', [
        'clean:docs',
        'jsdoc'
    ]);

    grunt.registerTask('clen', [
        'clean'
    ]);

    grunt.registerTask('default', [
        'clean',
        'jsonlint',
        'jshint',
        'copy'
    ]);
};
