#!/usr/bin/env node

import 'babel-polyfill';
import yargs from 'yargs';
import updateNotifier from 'update-notifier';
import { checkDeps, getVersions, initialize, track, Log } from './utils';
import {
  account,
  apps,
  build,
  config,
  deploy,
  domains,
  env,
  init,
  keys,
  login,
  logout,
  logs,
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

// do something with any unhandled rejections
// from async/await functions without a try/catch
process.on('unhandledRejection', (err) => {
  Log.error(err);
  process.exit(1);
});

if (process.env.REACTION_CLI_DEBUG === 'true') {
  /* eslint-disable no-console */
  console.time('create-reaction-app CLI runtime');
  process.on('exit', () => console.timeEnd('create-reaction-app CLI runtime'));
  /* eslint-enable no-console */
}

// Notify about reaction-cli updates
const pkg = require('../package.json');
updateNotifier({ pkg }).notify({ isGlobal: true });

initialize();

const args = yargs.usage('$0 <command> [options]')

      if (versions['create-reaction-app']) {
        Log.info(`\ncreate-reaction-app: ${Log.magenta(versions['create-reaction-app'])}`);

        if (versions.reactionBranch) {
          Log.info(`create-reaction-app branch: ${Log.magenta(versions.reactionBranch)}`);
        }
      }

      Log.info(`Node: ${Log.magenta(versions.node)}`);
      Log.info(`NPM: ${Log.magenta(versions.npm)}`);


    Log.info(`\nNode: ${Log.magenta(versions.node)}`);
    Log.info(`NPM: ${Log.magenta(versions.npm)}`);

    if (versions.meteorNode) {
      Log.info(`Meteor Node: ${Log.magenta(versions.meteorNode)}`);
    }

    if (versions.meteorNode) {
      Log.info(`Meteor NPM: ${Log.magenta(versions.meteorNpm)}`);
    }

      Log.info(`Create-reaction-app CLI: ${Log.magenta(pkg.version)}`);

    if (versions.yarn) {
      Log.info(`Yarn: ${Log.magenta(versions.yarn)}`);
    }
    Log.info(`Reaction CLI: ${Log.magenta(pkg.version)}`);

    if (versions.reaction) {
      Log.info(`Reaction: ${Log.magenta(versions.reaction)}`);

      if (versions.reactionBranch) {
        Log.info(`Reaction branch: ${Log.magenta(versions.reactionBranch)}`);
      }
    }

      return '';
    })
    .alias('v', 'version')
    .describe('v', 'Show the current version of Create-reaction-app CLI')

    if (versions.docker) {
      Log.info(`Docker: ${Log.magenta(versions.docker)}`);
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
  }, (argv) => checkDeps(['git', 'meteor'], () => init(argv)))

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

  .command('logout', 'Logout of Reaction', (options) => logout(options))

  .command('whoami', 'Check which account you are logged in as', (options) => {
    checkDeps(['platform'], () => whoami(options));
  })

  .command('account', 'Manage your Reaction Platform account', (options) => account(options))

  .command('keys', 'Manage your SSH keys', (options) => {
    checkDeps(['platform'], () => keys(options));
  })

  .command('apps', 'Manage your apps deployments', (options) => {
    checkDeps(['platform'], () => apps(options));
  })

  .command('deploy', 'Deploy an app', (options) => {
    checkDeps(['platform'], () => deploy(options));
  })

  .command('env', 'Manage environment variables for an app deployment', (options) => {
    checkDeps(['platform'], () => env(options));
  })

  .command('domain', 'Set/unset a custom domain name for an app', (options) => {
    checkDeps(['platform'], () => domains(options));
  })

  .command('logs', 'Get container logs for an app', (options) => {
    checkDeps(['platform'], () => logs(options));
  })

  .command('open', 'Open an app deployment in your browser', (options) => {
    checkDeps(['platform'], () => open(options));
  })

  .alias('a', 'app')
  .alias('d', 'domain')
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

track();
