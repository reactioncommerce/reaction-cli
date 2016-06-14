#!/usr/bin/env node

import program from 'commander';
import updateNotifier from 'update-notifier';
import { init, add, pull, reset, update } from './commands';
import { Log } from './utils';

// Notify about updates
const pkg = require('../package.json');
updateNotifier({ pkg }).notify();

program
  .version(pkg.version)
  .usage('<command>')
  .command('init')
  .description('Create a new Reaction app (will create a new folder)')
  .action(() => {
    init();
  });

program
  .command('pull')
  .description('Pull Reaction updates from Github and install NPM packages')
  .action(() => {
    pull();
  });

program
  .command('update')
  .description('Update Atmosphere and NPM packages')
  .action(() => {
    update();
  });

program
  .command('reset')
  .description('Reset the database and (optionally) delete build files')
  .action(() => {
    reset();
  });


program.parse(process.argv);

if(!program.args.length) {
  program.help();
}
