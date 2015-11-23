(function () {

    'use strict';

    /*global module*/
    module.exports = function (grunt) {

        /* Project configuration. */
        grunt.initConfig({

            concat: {
                options: {
                    separator: ';'
                },
                dist: {
                    src: ['src/js/pivot.js', 'src/js/group_*.js', 'src/js/agregate_*.js', 'src/js/formatter_*.js'],
                    dest: 'src/js/tmp/concat.js'
                }
            },
            uglify: {
                dist: {
                    files: {
                        'dist/js/jbPivot.js': ['<%= concat.dist.dest %>']
                    }
                }
            }

        });

        /* Actually load this plugin's task(s). */
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-uglify');

        /* Test task. */
        grunt.registerTask('default', ['concat', 'uglify']);

    };

}());