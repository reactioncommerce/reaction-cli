#!/usr/bin/env node

import 'babel-polyfill';
import yargs from 'yargs';
import updateNotifier from 'update-notifier';
import { init, config, pull, reset, run, test, update, plugins, styles, build, login, register, whoami } from './commands';
import { checkDeps, getVersions, initialize, Log } from './utils';

// Notify about reaction-cli updates
const pkg = require('../package.json');
updateNotifier({ pkg }).notify();

initialize(() => {
  const args = yargs.usage('$0 <command> [options]')

    .version(() => {
      const versions = getVersions();

      Log.info(`\nNode: ${Log.magenta(versions.node)}`);
      Log.info(`NPM: ${Log.magenta(versions.npm)}`);

      if (versions.yarn) {
        Log.info(`Yarn: ${Log.magenta(versions.yarn)}`);
      }

      if (versions.docker) {
        Log.info(`Docker: ${Log.magenta(versions.docker)}`);
      }

      Log.info(`Reaction CLI: ${Log.magenta(pkg.version)}`);

      if (versions.reaction) {
        Log.info(`Reaction: ${Log.magenta(versions.reaction)}`);
      }

      return '';
    })
    .alias('v', 'version')
    .describe('v', 'Show the current version of Reaction CLI')

    .command('init', 'Create a new Reaction app (will create a new folder)', () => {
      return yargs.option('b', {
        alias: 'branch',
        describe: 'The branch to clone from Github [default: master]',
        default: 'master'
      });
    }, (argv) => init(argv))

    .command('config', 'Get/set config values', (options) => {
      config(options);
    })

    .command('run', 'Start Reaction in development mode', (options) => {
      checkDeps(['app', 'meteor'], () => run(options));
    })

    .command('debug', 'Start Reaction in debug mode', (options) => {
      checkDeps(['app', 'meteor'], () => run(options));
    })

    .command('test', 'Run integration or unit tests', (options) => {
      checkDeps(['app', 'meteor'], () => test(options));
    })

    .command('pull', 'Pull Reaction updates from Github and install NPM packages', (options) => {
      checkDeps(['app', 'meteor'], () => pull(options));
    })

    .command('update', 'Update Atmosphere and NPM packages', (options) => {
      checkDeps(['app', 'meteor'], () => update(options));
    })

    .command('up', 'Update Atmosphere and NPM packages', (options) => {
      checkDeps(['app', 'meteor'], () => update(options));
    })

    .command('reset', 'Reset the database and (optionally) delete build files', (options) => {
      checkDeps(['app', 'meteor'], () => reset(options));
    })

    .command('plugins', 'Manage your Reaction plugins', (options) => {
      checkDeps(['app'], () => plugins(options));
    })

    .command('styles', 'Manage your Reaction styles (css, less, stylus, scss)', (options) => {
      checkDeps(['app'], () => styles(options));
    })

    .command('build', 'Build a production Docker image', (options) => {
      checkDeps(['app'], () => build(options));
    })

    .command('register', 'Register an account with Reaction', (options) => register(options))

    .command('login', 'Login to Reaction', (options) => login(options))

    .command('whoami', 'Check which account you are logged in as', (options) => whoami(options))

    .help('h')
    .alias('h', 'help')
    .showHelpOnFail(false)
    .argv;

  // Default to 'reaction run' if no subcommand is specified
  if (!args._.length && !args.h && !args.help) {
    checkDeps(['app', 'meteor'], () => run(yargs));
  }
});
