module.exports = function(grunt) {

    grunt.initConfig({

      pkg: grunt.file.readJSON('package.json'),

        bower: {
            install: {
            	/*
              options: {
            	targetDir: "public/scripts/lib",
                layout: 'byType',
                copy: true,
                install: true,
                verbose: false,
                cleanTargetDir: false,
                cleanBowerDir: false,
                bowerOptions: {}
              }*/

            }
        },
        copy: {
        	main: {
        	expand: true,
        	cwd: 'bower_components',
        	src: '**',
        	dest: 'client/scripts/vendor'
        	}
        },
        requirejs: {
          // Need some work in Compile task.  Currently its not it use
            compile: {
                options: {
                    baseUrl: 'client/scripts/src',
                    mainConfigFile: 'client/scripts/src/main.js',
                    preserveLicenseComments: false, //comment in production
                    out: 'client/scripts/webapp.min.js',
                  //  optimize: 'uglify2',
                    include: ['/main.js']
                }
            }
        },
        nodemon: {
            dev: {
                script: 'server.js'
            }
        }

    });

//    grunt.loadNpmTasks('grunt-npm-install');
    grunt.loadNpmTasks('grunt-bower-installer');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('init', ['bower:install', 'copy:main']);
    grunt.registerTask('compile', ['requirejs:compile']);

    grunt.registerTask('start', ['nodemon']);

    grunt.registerTask('default', ['init']);
};
