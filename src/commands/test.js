import _ from 'lodash';
import chalk from 'chalk';
import { exec } from 'shelljs';
import { Log, loadPlugins } from '../utils';

export function test(options) {
  const args = _.omit(options.argv, ['_', '$0']);

  Log.info('Setting up plugin imports...\n');
  loadPlugins();

  let cmd = 'meteor test';

  const subCommands = options.argv._;
  const testArgs = _.pickBy(_.omit(args, '$0'), (val) => val !== false);
  const hasArgs = Object.keys(testArgs).length > 0;

  if (hasArgs) {
    _.forEach(testArgs, (val, key) => {
      const dash = key.length > 1 ? '--' : '-';
      cmd += ` ${dash + key} ${val}`;
    });
    Log.info('Running custom test command:');
  } else {
    cmd = 'SERVER_TEST_REPORTER="dot" ' + cmd;
    if (subCommands[1] === 'unit') {
      cmd += ' --once --headless --driver-package dispatch:mocha';
      Log.info('Running unit tests command:');
    } else {
      cmd += ' --once --full-app --headless --driver-package dispatch:mocha';
      Log.info('Running full-app test command:');
    }
  }

  Log.info(chalk.green(' ' + cmd + '\n'));

  exec(cmd);
}
