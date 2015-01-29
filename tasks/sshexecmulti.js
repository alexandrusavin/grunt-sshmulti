/*
 * sshexecmulti
 *
 *
 * Copyright (c) 2015 Alexandru Savin
 * Licensed under the MIT license.
 */

'use strict';

var extend = require('extend');

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('sshexecmulti', 'Prepares sshexec to executes shell commands on multiple remote machines', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options();

    this.requiresConfig(['sshexec']);

    var sshexec = grunt.config.get('sshexec');

    var target = this.data;

    if (Array.isArray(target.hosts)) {
      var run = [];
      if(Array.isArray(target.commands)) {

        var newSshExec = {};

        for(var i = 0; i < target.hosts.length; i++) {
          for(var j = 0; j < target.commands.length; j++) {
            var setOptions = {};

            extend(setOptions, sshexec[target.commands[j]].options, options);

            setOptions.host = target.hosts[i];

            newSshExec[target.commands[j]+i] = {
              options: setOptions,
              command: sshexec[target.commands[j]].command
            };
          }
        }

        target.commands.forEach(function(command) {
          delete grunt.config.data.sshexec[command];
        });

        grunt.config.merge({sshexec: newSshExec});

        grunt.log.ok('New commands prepared in sshexec ['+Object.keys( grunt.config.get('sshexec') ).join(', ')+
        '] to be run on hosts ['+target.hosts.join(', ')+']');

        if (options.execute !== false) {
          grunt.log.ok('Will now run sshexec');
          grunt.task.run('sshexec');
        }
      }
    }
  });

};
