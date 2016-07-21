#!/usr/bin/env node

import yargs from 'yargs';
import updateNotifier from 'update-notifier';
import { init, add, pull, reset, run, test, update } from './commands';
import { checkDeps, checkVersion, Log } from './utils';

// Notify about updates
const pkg = require('../package.json');
updateNotifier({ pkg }).notify();

const args = yargs.usage('$0 <command> [options]')
  .version(() => {
    const reactionVer = checkVersion();
    if (reactionVer) {
      Log.info(`Reaction: ${Log.magenta(reactionVer)}`);
    }
    Log.info(`Reaction CLI: ${Log.magenta(pkg.version)}`);
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
  .command('run', 'Start Reaction in development mode', (options) => {
    checkDeps(['app', 'meteor'], () => run(options));
  })
  .command('debug', 'Start Reaction in debug mode', (options) => {
    checkDeps(['app', 'meteor'], () => run(options));
  })
  .command('test', 'Run integration or unit tests', (options) => {
    checkDeps(['app', 'meteor'], () => test(options));
  })
  .command('pull', 'Pull Reaction updates from Github and install NPM packages', () => {
    checkDeps(['app', 'meteor'], () => pull());
  })
  .command('update', 'Update Atmosphere and NPM packages', () => {
    checkDeps(['app', 'meteor'], () => update());
  })
  .command('up', 'Update Atmosphere and NPM packages', () => {
    checkDeps(['app', 'meteor'], () => update());
  })
  .command('reset', 'Reset the database and (optionally) delete build files', () => {
    checkDeps(['app', 'meteor'], () => reset());
  })

  .help('h')
  .alias('h', 'help')
  .showHelpOnFail(false)
  .argv;

// Default to 'reaction run' if no subcommand is specified
if (!args._.length && !args.h && !args.help) {
  checkDeps(['app', 'meteor'], () => run(yargs));
}
