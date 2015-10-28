'use strict';

module.exports = function(grunt) {

grunt.loadNpmTasks('grunt-contrib-uglify');	//compress javascript
grunt.loadNpmTasks('grunt-contrib-concat');	//concatenate files
grunt.loadNpmTasks('grunt-contrib-clean');	//delete files in dist
grunt.loadNpmTasks('grunt-contrib-jshint');	//VALID JAVASCRIPT
grunt.loadNpmTasks('grunt-contrib-copy');	//MOVE FILES

grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	clean: {
		js: {
			src: ['dist/*.js']
		}	
	},
	uglify: {
		fenixmap: {
			files: {
				'dist/pivot.min.js': ['js/pivot.js']
			}
		}
	}
});

grunt.registerTask('default', [
	//'jshint',
	'clean',
	//'concat:fenixmap',
	'uglify',
	//'jsonlint',	
	//'copy'
]);

};