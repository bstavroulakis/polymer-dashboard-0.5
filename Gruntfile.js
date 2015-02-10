module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        vulcanize: {
            default: {
                options: {
                    csp: true
                },
                files: {
                    'index.html': 'dev.html',
                    'pages/auth/auth.html': 'pages/auth/auth-dev.html'
                }
            }
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
                        'elements/ma-data-context/jaydata/jaydataproviders/IndexedDbProvider.js',
                        'elements/ma-data-context/jaydata/jaydataproviders/InMemoryProvider.js',
                        'elements/ma-data-context/jaydata/jaydatamodules/deferred.js',
                        'elements/ma-data-context/jaydata/jaydatamodules/qDeferred.js'
                    ],
                    'elements/ma-data-context/Models.js': [
                        'elements/ma-data-context/models/Config.js', 'elements/ma-data-context/models/Mail.js', 'elements/ma-data-context/models/Page.js',
                        'elements/ma-data-context/models/User.js', 'elements/ma-data-context/models/Task.js',
                        'elements/ma-data-context/models/MailUser.js', 'elements/ma-data-context/models/Notification.js', 'elements/ma-data-context/models/NotificationType.js',
                        'elements/ma-data-context/seed/Config.js', 'elements/ma-data-context/seed/Mail.js', 'elements/ma-data-context/seed/Page.js',
                        'elements/ma-data-context/seed/User.js', 'elements/ma-data-context/seed/Task.js',
                        'elements/ma-data-context/seed/MailUser.js', 'elements/ma-data-context/seed/Notification.js', 'elements/ma-data-context/seed/NotificationType.js'
                    ],
                    'bower_components/web-animations-next/web-animations.min.js':[
                        'bower_components/web-animations-next/src/dev.js',
                        'bower_components/web-animations-next/src/scope.js',
                        'bower_components/web-animations-next/src/timing-utilities.js',
                        'bower_components/web-animations-next/src/normalize-keyframes.js',
                        'bower_components/web-animations-next/src/animation-node.js',
                        'bower_components/web-animations-next/src/effect.js',
                        'bower_components/web-animations-next/src/property-interpolation.js',
                        'bower_components/web-animations-next/src/animation.js',
                        'bower_components/web-animations-next/src/apply-preserving-inline-style.js',
                        'bower_components/web-animations-next/src/element-animatable.js',
                        'bower_components/web-animations-next/src/interpolation.js',
                        'bower_components/web-animations-next/src/matrix-interpolation.js',
                        'bower_components/web-animations-next/src/player.js',
                        'bower_components/web-animations-next/src/tick.js',
                        'bower_components/web-animations-next/src/matrix-decomposition.js',
                        'bower_components/web-animations-next/src/handler-utils.js',
                        'bower_components/web-animations-next/src/shadow-handler.js',
                        'bower_components/web-animations-next/src/number-handler.js',
                        'bower_components/web-animations-next/src/visibility-handler.js',
                        'bower_components/web-animations-next/src/color-handler.js',
                        'bower_components/web-animations-next/src/dimension-handler.js',
                        'bower_components/web-animations-next/src/box-handler.js',
                        'bower_components/web-animations-next/src/transform-handler.js',
                        'bower_components/web-animations-next/src/font-weight-handler.js',
                        'bower_components/web-animations-next/src/position-handler.js',
                        'bower_components/web-animations-next/src/shape-handler.js',
                        'bower_components/web-animations-next/src/property-names.js',
                        'bower_components/web-animations-next/src/timeline.js',
                        'bower_components/web-animations-next/src/maxifill-player.js',
                        'bower_components/web-animations-next/src/animation-constructor.js',
                        'bower_components/web-animations-next/src/effect-callback.js',
                        'bower_components/web-animations-next/src/group-constructors.js'
                    ]
                }
            },
            build: {}
        }
    })

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-vulcanize');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['vulcanize', 'uglify']);

};