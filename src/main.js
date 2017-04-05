#!/usr/bin/env node

import 'babel-polyfill';
import yargs from 'yargs';
import updateNotifier from 'update-notifier';
import { checkDeps, getVersions, initialize, Log } from './utils';
import {
  apps,
  build,
  config,
  deploy,
  env,
  init,
  keys,
  login,
  open,
  plugins,
  pull,
  register,
  reset,
  run,
  styles,
  test,
  update,
  whoami
} from './commands';

if (process.env.REACTION_CLI_DEBUG) {
  /* eslint-disable no-console */
  console.time('Reaction CLI runtime');
  process.on('exit', () => console.timeEnd('Reaction CLI runtime'));
  /* eslint-enable no-console */
}

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

        if (versions.reactionBranch) {
          Log.info(`Reaction Branch: ${Log.magenta(versions.reactionBranch)}`);
        }
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
    }, (argv) => checkDeps(['meteor'], () => init(argv)))

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

    .command('keys', 'Manage your SSH keys', (options) => keys(options))

    .command('apps', 'Manage your apps deployments', (options) => apps(options))

    .command('deploy', 'Deploy an app', (options) => deploy(options))

    .command('env', 'Manage environment variables for an app deployment', (options) => env(options))

    .command('open', 'Open an app deployment in your browser', (options) => open(options))

    .alias('a', 'app')
    .alias('e', 'env')
    .alias('n', 'name')
    .alias('i', 'image')
    .alias('s', 'settings')
    .alias('r', 'registry')

    .help('h')
    .alias('h', 'help')
    .showHelpOnFail(false)
    .argv;

  // Default to 'reaction run' if no subcommand is specified
  if (!args._.length && !args.h && !args.help) {
    checkDeps(['app', 'meteor'], () => run(yargs));
  }
});
