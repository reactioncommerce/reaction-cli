#!/usr/bin/env node
'use strict';

require('babel-polyfill');

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _updateNotifier = require('update-notifier');

var _updateNotifier2 = _interopRequireDefault(_updateNotifier);

var _utils = require('./utils');

var _commands = require('./commands');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// do something with any unhandled rejections
// from async/await functions without a try/catch
process.on('unhandledRejection', function (err) {
  _utils.Log.error(err);
  process.exit(1);
});

if (process.env.REACTION_CLI_DEBUG === 'true') {
  /* eslint-disable no-console */
  console.time('Reaction CLI runtime');
  process.on('exit', function () {
    return console.timeEnd('Reaction CLI runtime');
  });
  /* eslint-enable no-console */
}

// Notify about reaction-cli updates
var pkg = require('../package.json');
(0, _updateNotifier2.default)({ pkg: pkg }).notify();

(0, _utils.initialize)(function () {
  var args = _yargs2.default.usage('$0 <command> [options]').version(function () {
    var versions = (0, _utils.getVersions)();

    if (versions['create-reaction-app']) {
      _utils.Log.info('\ncreate-reaction-app: ' + _utils.Log.magenta(versions['create-reaction-app']));

      if (versions.reactionBranch) {
        _utils.Log.info('create-reaction-app branch: ' + _utils.Log.magenta(versions.reactionBranch));
      }
    }

    _utils.Log.info('Node: ' + _utils.Log.magenta(versions.node));
    _utils.Log.info('NPM: ' + _utils.Log.magenta(versions.npm));

    if (versions.meteorNode) {
      _utils.Log.info('Meteor Node: ' + _utils.Log.magenta(versions.meteorNode));
    }

    if (versions.meteorNode) {
      _utils.Log.info('Meteor NPM: ' + _utils.Log.magenta(versions.meteorNpm));
    }

    if (versions.yarn) {
      _utils.Log.info('Yarn: ' + _utils.Log.magenta(versions.yarn));
    }

    _utils.Log.info('Reaction CLI: ' + _utils.Log.magenta(pkg.version));

    if (versions.reaction) {
      _utils.Log.info('Reaction: ' + _utils.Log.magenta(versions.reaction));

      if (versions.reactionBranch) {
        _utils.Log.info('Reaction branch: ' + _utils.Log.magenta(versions.reactionBranch));
      }
    }

    if (versions.docker) {
      _utils.Log.info('Docker: ' + _utils.Log.magenta(versions.docker));
    }

    return '';
  }).alias('v', 'version').describe('v', 'Show the current version of Reaction CLI').command('init', 'Create a new Reaction app (will create a new folder)', function () {
    return _yargs2.default.option('b', {
      alias: 'branch',
      describe: 'The branch to clone from Github [default: master]',
      default: 'master'
    });
  }, function (argv) {
    return (0, _utils.checkDeps)(['git', 'meteor'], function () {
      return (0, _commands.init)(argv);
    });
  }).command('config', 'Get/set config values', function (options) {
    (0, _commands.config)(options);
  }).command('run', 'Start Reaction in development mode', function (options) {
    (0, _utils.checkDeps)(['app', 'meteor'], function () {
      return (0, _commands.run)(options);
    });
  }).command('debug', 'Start Reaction in debug mode', function (options) {
    (0, _utils.checkDeps)(['app', 'meteor'], function () {
      return (0, _commands.run)(options);
    });
  }).command('test', 'Run integration or unit tests', function (options) {
    (0, _utils.checkDeps)(['app', 'meteor'], function () {
      return (0, _commands.test)(options);
    });
  }).command('pull', 'Pull Reaction updates from Github and install NPM packages', function (options) {
    (0, _utils.checkDeps)(['app', 'meteor'], function () {
      return (0, _commands.pull)(options);
    });
  }).command('update', 'Update Atmosphere and NPM packages', function (options) {
    (0, _utils.checkDeps)(['app', 'meteor'], function () {
      return (0, _commands.update)(options);
    });
  }).command('up', 'Update Atmosphere and NPM packages', function (options) {
    (0, _utils.checkDeps)(['app', 'meteor'], function () {
      return (0, _commands.update)(options);
    });
  }).command('reset', 'Reset the database and (optionally) delete build files', function (options) {
    (0, _utils.checkDeps)(['app', 'meteor'], function () {
      return (0, _commands.reset)(options);
    });
  }).command('plugins', 'Manage your Reaction plugins', function (options) {
    (0, _utils.checkDeps)(['app'], function () {
      return (0, _commands.plugins)(options);
    });
  }).command('styles', 'Manage your Reaction styles (css, less, stylus, scss)', function (options) {
    (0, _utils.checkDeps)(['app'], function () {
      return (0, _commands.styles)(options);
    });
  }).command('build', 'Build a production Docker image', function (options) {
    (0, _utils.checkDeps)(['app'], function () {
      return (0, _commands.build)(options);
    });
  }).command('register', 'Register an account with Reaction', function (options) {
    return (0, _commands.register)(options);
  }).command('login', 'Login to Reaction', function (options) {
    return (0, _commands.login)(options);
  }).command('whoami', 'Check which account you are logged in as', function (options) {
    return (0, _commands.whoami)(options);
  }).command('keys', 'Manage your SSH keys', function (options) {
    return (0, _commands.keys)(options);
  }).command('apps', 'Manage your apps deployments', function (options) {
    return (0, _commands.apps)(options);
  }).command('deploy', 'Deploy an app', function (options) {
    return (0, _commands.deploy)(options);
  }).command('env', 'Manage environment variables for an app deployment', function (options) {
    return (0, _commands.env)(options);
  }).command('domains', 'Add a custom domain name to a deployment', function (options) {
    return (0, _commands.domains)(options);
  }).command('open', 'Open an app deployment in your browser', function (options) {
    return (0, _commands.open)(options);
  }).alias('a', 'app').alias('d', 'domain').alias('e', 'env').alias('n', 'name').alias('i', 'image').alias('s', 'settings').alias('r', 'registry').help('h').alias('h', 'help').showHelpOnFail(false).argv;

  // Default to 'reaction run' if no subcommand is specified
  if (!args._.length && !args.h && !args.help) {
    (0, _utils.checkDeps)(['app', 'meteor'], function () {
      return (0, _commands.run)(_yargs2.default);
    });
  }
});