#!/usr/bin/env node

import yargs from 'yargs';
import updateNotifier from 'update-notifier';
import { init, add, pull, reset, run, test, update } from './commands';
import { checkApp, checkMeteor, Log } from './utils';

// Notify about updates
const pkg = require('../package.json');
updateNotifier({ pkg }).notify();

const args = yargs.usage('$0 <command> [options]')
  .version(() => pkg.version)
  .alias('v', 'version')
  .describe('v', 'Show the current version of Reaction CLI')

  .command('init', 'Create a new Reaction app (will create a new folder)', (options) => {
    checkMeteor();
    init(options);
  })
  .command('run', 'Start Reaction in development mode', (options) => {
    checkApp();
    checkMeteor();
    run(options);
  })
  .command('debug', 'Start Reaction in debug mode', (options) => {
    checkApp();
    checkMeteor();
    run(options);
  })
  .command('test', 'Run all app tests', (options) => {
    checkApp();
    checkMeteor();
    test(options);
  })
  .command('pull', 'Pull Reaction updates from Github and install NPM packages', () => {
    checkApp();
    checkMeteor();
    pull();
  })
  .command('update', 'Update Atmosphere and NPM packages', () => {
    checkApp();
    checkMeteor();
    update();
  })
  .command('up', 'Update Atmosphere and NPM packages', () => {
    checkApp();
    checkMeteor();
    update();
  })
  .command('reset', 'Reset the database and (optionally) delete build files', () => {
    checkApp();
    checkMeteor();
    reset();
  })

  .help('h')
  .alias('h', 'help')
  .argv;

// Default to 'reaction run' if no subcommand is specified
if (!args._.length && !args.h && !args.help) {
  checkApp();
  checkMeteor();
  run(yargs);
}
