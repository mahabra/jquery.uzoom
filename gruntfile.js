module.exports = function(grunt) {
  grunt.initConfig({
    uglify: {
      my_target: {
        options: {
          mangle: false,
          sourceMap: true
        },
        files: {
          './dist/jquery.uzoom.min.js': ['./dist/jquery.uzoom.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.registerTask('default', ['uglify']);
};