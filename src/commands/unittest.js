import _ from 'lodash';
import chalk from 'chalk';
import { exec } from 'shelljs';
import { Log } from '../utils';

export function unittest(options) {
  const args = _.omit(options.argv, ['_', '$0']);

  let cmd = 'meteor test';

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
    cmd += ' --once --headless --driver-package dispatch:mocha';
    Log.info('Running unit tests command:');
  }

  Log.info(chalk.green(' ' + cmd + '\n'));

  exec(cmd);
}

