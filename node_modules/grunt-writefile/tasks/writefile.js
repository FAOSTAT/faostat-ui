/*
 * grunt-writefile
 * https://github.com/lunsdorf/grunt-writefile
 *
 * Copyright (c) 2014 Sören Lünsdorf
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {
    'use strict';

    var chalk = require('chalk');
    var fs = require('fs');
    var handlebars = require('handlebars');
    var path = require('path');

    function provide_template_parser (options) {
        var parser = handlebars.create(); // each task has its own instance
        var p;

        if (options.helpers) {
            for (p in options.helpers) {
                if (options.helpers.hasOwnProperty(p)) {
                    parser.registerHelper(p, options.helpers[p]);
                }
            }
        }

        return parser;
    }

    function provide_template_data (options) {
        var data = {};
        var path, p;

        if ('string' === typeof options.data) {
            data = grunt.file.readJSON(options.data);
        } else {
            data = options.data ? grunt.util._.clone(options.data) : {};
        }

        if (options.paths) {
            data.paths = {};

            for (p in options.paths) {
                if (options.paths.hasOwnProperty(p)) {
                    path = options.paths[p];

                    data.paths[p] = grunt.file.expand.apply(grunt.file, 'string' === typeof path ? [path] : [path, path.src]);
                }
            }
        }

        return data;
    }

    grunt.registerMultiTask('writefile', 'Writes static files using handlebars templates.', function () {
        var options = this.options({
            preserveExtension: false, // ignored if path is expanded
            encoding: grunt.file.defaultEncoding,
            mode: false
        });

        var parser = provide_template_parser(options);
        var data = provide_template_data(options);
        var processed = 0;

        this.files.forEach(function (file) {
            var expandedPath = file.orig.expand || false;

            if (!expandedPath && 1 < file.src.length) {
                grunt.warn('writing multiple sources to single destination: ' + file.dest + '!');
            }

            file.src.forEach(function (src) {
                var encoding = options.encoding;
                var dest, tpl, i;

                if (grunt.file.isFile(src)) {
                    grunt.verbose.writeln('Compiling template file: ' + chalk.cyan(src));

                    tpl = parser.compile(grunt.file.read(src));
                    dest = (options.preserveExtension || !expandedPath) ? file.dest : file.dest.slice(0, (path.extname(file.dest).length * -1));

                    grunt.file.write(dest, tpl(data), {
                        encoding: options.encoding
                    });

                    if (options.mode !== false) {
                        fs.chmodSync(dest, (options.mode === true) ? fs.lstatSync(src).mode : options.mode);
                    }

                    processed = (processed + 1);
                }
            });
        });

        grunt.log.writeln(chalk.cyan(processed) + (1 < processed ? ' files' : ' file') + ' written.');
    });
};
