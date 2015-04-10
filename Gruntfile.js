'use strict';

module.exports = function (grunt) {

    /* Load JSON Schema utilities. */
    var defaults = require('json-schema-defaults');

    /* Initiate Grunt configuration. */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    /* Load JSON Schema. */
    var schema = grunt.file.readJSON('config/faostat_schema.json', [, {
        encoding: 'utf8'
    }]);

    /* Create JSON. */
    var json = defaults(schema);

    /* Write JSON. */
    grunt.file.write('config/faostat.json', JSON.stringify(json), [, {encoding: 'utf8'}]);

    /* Register default task. */
    grunt.registerTask('default', []);

};