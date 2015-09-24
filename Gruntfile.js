module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['client/app/**/*.js'],
        dest: 'client/dist/<%= pkg.name %>.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'index.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'client/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    jshint: {
      files: [
        'index.js',
        'client/**/*.js',
        'server/**/*.js'
      ],
      options: {
        force: false,
        jshintrc: '.jshintrc',
        ignores: [
          'client/lib/**/*.js',
          'client/dist/**/*.js'
        ]
      }
    },

    // cssmin: {
    //   dist: {
    //     files: {
    //       'public/dist/style.min.css': 'public/style.css'
    //     }
    //   }
    // },

    watch: {
      scripts: {
        files: [
          'client/app/**/*.js'
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      }
      // css: {
      //   files: 'client/*.css',
      //   tasks: ['cssmin']
      // }
    }

    // shell: {
    //   'git-add': {
    //     command: 'git --no-pager add .',
    //     options: {
    //       stdout: true,
    //       stderr: true,
    //       // execOptions: { cwd: '../deploy'}
    //     }
    //   },
    //   'git-commit':           {
    //     command: 'git --no-pager commit -m "update"',
    //     options: {
    //       stdout: true,
    //       stderr: true,
    //       // execOptions: { cwd: '../deploy'}
    //     }
    //   },
    //   'git-push':             {
    //     command: 'git --no-pager push heroku master',
    //     options: {
    //       failOnError: true,
    //       stdout: true,
    //       stderr: true,
    //       // execOptions: { cwd: '../deploy'}
    //     }
    //   }
    // }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'concat',
    'uglify'
    // 'cssmin'
  ]);

  // grunt.registerTask('server-prod', [
  //   'shell'
  // ]);

  // grunt.registerTask('upload', function(n) {
  //   if (grunt.option('prod')) {
  //     grunt.task.run([ 'server-prod' ]);
  //   } else {
  //     console.log('local server');
  //     grunt.task.run([ 'server-dev' ]);
  //   }
  // });

  // grunt.registerTask('deploy', function(){
  //   grunt.task.run([ 'test', 'build', 'upload' ]);
  // });

  grunt.registerTask('heroku:production', function(){
    grunt.task.run([ 'build' ]);
  });

  grunt.registerTask('heroku:development', function(){
    grunt.task.run([ 'build' ]);
  });

};
