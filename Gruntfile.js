'use strict';

module.exports = function (grunt) {

    var schema_dir = 'resources/json/';
    var output_dir = 'config/';

    /* Initiate Grunt configuration. */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    /* Create configuration file. */
    grunt.registerTask('default', 'Create JSON configuration file from JSON Schema.', function() {

        /* Load JSON Schema utilities. */
        var defaults = require('json-schema-defaults');

        /* Load JSON Schema. */
        var schema = grunt.file.readJSON(schema_dir + 'faostat_schema.json', [, {
            encoding: 'utf8'
        }]);

        /* Create JSON. */
        var json = defaults(schema);

        /* Write JSON. */
        grunt.file.write(output_dir + 'faostat.json', JSON.stringify(json), [, {encoding: 'utf8'}]);

    });

};