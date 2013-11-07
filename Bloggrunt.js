module.exports = function (grunt) {

	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// JSLint all the things!
	grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
		jshint: {
		    files: {
		        src: ['content/themes/asciidisco/**/*.js']
		    }
		}
	});
};