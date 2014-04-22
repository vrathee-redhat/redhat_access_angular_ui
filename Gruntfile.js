// Generated on 2014-02-17 using generator-angular 0.7.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
//var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks("grunt-image-embed");
  grunt.loadNpmTasks('grunt-ng-annotate');

  // Define the configuration for all the tasks
  grunt.initConfig({
    distdir: 'dist',

    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' + ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' + ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist',
      bowerDir: 'app/bower_components'
    },

    //Define our source files
    src: {
      js: ['app/common/**/*.js', 'app/security/**/*.js', 'app/search/**/*.js', 'app/cases/**/*.js', 'app/log_viewer/**/*.js'],
      jsTpl: ['.tmp/templates/**/*.js'],
      specs: ['test/**/*.spec.js'],
      scenarios: ['test/**/*.scenario.js'],
      html: ['app/index.html'],
      tpl: {
        app: ['app/common/**/*.html', 'app/security/**/*.html', 'app/search/**/*.html',
          'app/cases/**/*.html', 'app/log_viewer/**/*.html'
        ]
      },
      css: {
        app: ['app/common/**/*.css', 'app/security/**/*.css', 'app/search/**/*.css',
          'app/cases/**/*.css', 'app/log_viewer/**/*.css'
        ]
      },
      img: ['<%= yeoman.app %>/**/img/*'],

      thirdParty: {
        js: ['<%= yeoman.bowerDir %>/js-markdown-extra/js-markdown-extra.js',
          '<%= yeoman.bowerDir %>/jsUri/Uri.js',
          '<%= yeoman.bowerDir %>/stratajs/strata.js',
          '<%= yeoman.bowerDir %>/angular-resource/angular-resource.js',
          '<%= yeoman.bowerDir %>/angular-sanitize/angular-sanitize.js',
          '<%= yeoman.bowerDir %>/angular-route/angular-route.js',
          '<%= yeoman.bowerDir %>/angular-ui-router/release/angular-ui-router.js',
          '<%= yeoman.bowerDir %>/angular-bootstrap/ui-bootstrap-tpls.js',
          '<%= yeoman.bowerDir %>/angular-treeview/angular.treeview.js',
          '<%= yeoman.bowerDir %>/ng-table/ng-table.js'
        ],
        css: ['<%= yeoman.bowerDir %>/angular-treeview/css/angular.treeview.css',
          '<%= yeoman.bowerDir %>/ng-table/ng-table.css'
        ],
        img: ['<%= yeoman.bowerDir %>/angular-treeview/img/*']
      }

    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= yeoman.app %>/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      jade: {
        files: ['<%= yeoman.app %>/**/*.jade'],
        tasks: ['newer:jade']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= src.tpl.app %>',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ],
          middleware: function (connect) {
            return [
              mountFolder(connect, '<%= yeoman.app %>'),
              require('./rest-mock-server'),
              mountFolder(connect, 'app')
            ];
          }

        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    'bower-install': {
      app: {
        html: '<%= yeoman.app %>/index.html',
        ignorePath: '<%= yeoman.app %>/'
      }
    },



    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '.tmp/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '.tmp',
          src: ['{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    jade: {
      dist: {
        options: {
          pretty: false
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.app %>',
          src: '**/*.jade',
          ext: '.html'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          //expand: true,
          //cwd: '.tmp/concat/scripts',
          src: '.tmp/<%= pkg.name %>.js',
          dest: '<%= distdir %>/<%= pkg.name %>.js'
        }]
      },
      dist_no_deps: {
        files: [{
          //expand: true,
          //cwd: '.tmp/concat/scripts',
          src: '.tmp/<%= pkg.name %>-no-deps.js',
          dest: '<%= distdir %>/<%= pkg.name %>.no-deps.js'
        }]
      }
    },
    //ngmin does not work with chaining....
    ngAnnotate: {
      options: {
        // Task-specific options go here.
      },
      dist: {
        files: [{
          //expand: true,
          //cwd: '.tmp/concat/scripts',
          src: '.tmp/<%= pkg.name %>.js',
          dest: '<%= distdir %>/<%= pkg.name %>.js'
        }]
      },
      dist_no_deps: {
        files: [{
          //expand: true,
          //cwd: '.tmp/concat/scripts',
          src: '.tmp/<%= pkg.name %>-no-deps.js',
          dest: '<%= distdir %>/<%= pkg.name %>.no-deps.js'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'bower_components/**/*',
            'images/{,*/}*.{webp}',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        filter: 'isFile',
        flatten: true,
        dest: '.tmp/styles/',
        src: '<%= src.css.app %>'
      },
      images: {
        files: [{
          expand: true,
          flatten: true,
          nonull: true,
          src: '<%= src.img %>',
          dest: '<%= yeoman.dist %>/img/',
          filter: 'isFile'
        }, {
          expand: true,
          flatten: true,
          nonull: true,
          src: '<%= src.thirdParty.img %>',
          dest: '<%= yeoman.dist %>/img/',
          filter: 'isFile'
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    imageEmbed: {
      dist: {
        src: ['<%= yeoman.dist %>/styles/<%= pkg.name %>.css'],
        dest: "<%= yeoman.dist %>/styles/<%= pkg.name %>-embedded-images.css",
        options: {
          deleteAfterEncoding: false
        }
      },
      dist_no_deps: {
        src: ['<%= yeoman.dist %>/styles/<%= pkg.name %>-no-deps.css'],
        dest: "<%= yeoman.dist %>/styles/<%= pkg.name %>-no-deps-embedded-images.css",
        options: {
          deleteAfterEncoding: false
        }
      }
    },


    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/<%= pkg.name %>.css': [
            '<%= src.thirdParty.css %>', '<%= src.css.app %>'
          ]
        }
      },
      dist_no_deps: {
        files: {
          '<%= yeoman.dist %>/styles/<%= pkg.name %>-no-deps.css': [
            '<%= src.css.app %>'
          ]
        }
      }

    },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    concat: {
      dist: {
        options: {
          banner: '<%= banner %>'
        },
        src: ['<%= src.thirdParty.js %>', '<%= src.js %>', '<%= src.jsTpl %>'],
        dest: '.tmp/<%= pkg.name %>.js'
      },
      dist_no_deps: {
        options: {
          banner: '<%= banner %>'
        },
        src: ['<%= src.js %>', '<%= src.jsTpl %>'],
        dest: '.tmp/<%= pkg.name %>-no-deps.js'
      }
    },



    html2js: {
      app: {
        options: {
          base: 'app'
        },
        src: ['<%= src.tpl.app %>'],
        dest: '.tmp/templates/RedhatAccess.template.js',
        module: 'RedhatAccess.template'
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'bower-install',
      'newer:jade',
      'build',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'bower-install',
    'newer:jade',
    'useminPrepare',
    'html2js',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    //'ngmin', does not work with chaining
    'ngAnnotate',
    'copy:images',
    //'cdnify',
    'cssmin',
    'imageEmbed',
    //'uglify',
    //'rev',
    //'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};