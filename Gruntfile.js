module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        vulcanize: {
            default: {
                options: {
                    csp: true,
                    strip: true
                },
                files: {
                    'index.html': 'dev.html',
                    'pages/auth/auth.html': 'pages/auth/auth-dev.html'
                },
            },
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            my_target: {
                files: {
                    'elements/ma-data-context/jaydata/jaydata.min.js': [
                        'elements/ma-data-context/jaydata/jaydatamodules/q.js',
                        'elements/ma-data-context/jaydata/jaydata.js',
                        'elements/ma-data-context/jaydata/jaydatamodules/deferred.js',
                        'elements/ma-data-context/jaydata/jaydatamodules/qDeferred.js'
                    ],
                    'elements/ma-data-context/Models.js':[
                        'elements/ma-data-context/models/Config.js','elements/ma-data-context/models/Mail.js','elements/ma-data-context/models/Page.js','elements/ma-data-context/models/User.js','elements/ma-data-context/models/UserAddress.js','elements/ma-data-context/models/Task.js',
                        'elements/ma-data-context/seed/Config.js','elements/ma-data-context/seed/Mail.js','elements/ma-data-context/seed/Page.js','elements/ma-data-context/seed/User.js','elements/ma-data-context/seed/UserAddress.js','elements/ma-data-context/seed/Task.js'
                    ]
                }
            },
            build: {

            }
        }
    })

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-vulcanize');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['vulcanize', 'uglify']);

};