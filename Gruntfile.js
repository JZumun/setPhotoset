module.exports = function (grunt) {
    grunt.initConfig({
        browserify: {
            development: {
                src: "./src/jzmn.setphotoset.js",
                dest: './dist/jzmn.setphotoset.js',
                options: {
                    browserifyOptions: { 
                        standalone: "jzmn"
                    },
                    transform: ["rollupify",["babelify",{
                        presets:["latest"]
                    }]]
                }
            }
        },
        uglify: {
            my_target: {
                files: {
                    'dist/jzmn.setphotoset.min.js': ['dist/jzmn.setphotoset.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ["./src/*.js"],
                tasks: ["browserify","uglify"]
            }
        }
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask("default", ["watch"]);
    grunt.registerTask("build", ["browserify","uglify"]);


};