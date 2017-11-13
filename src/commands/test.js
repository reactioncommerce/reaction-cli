import os from 'os';
import { execSync as exec } from 'child_process';
import _ from 'lodash';
import chalk from 'chalk';
import { Log, loadPlugins, loadStyles } from '../utils';

export function test(yargs) {
  Log.args(yargs.argv);

  const args = _.omit(yargs.argv, ['_', '$0']);

  Log.info('Setting up plugin imports...\n');
  loadPlugins();

  Log.info('Setting up style imports...\n');
  loadStyles();

  let cmd = 'meteor test';

  const subCommands = yargs.argv._;
  const testArgs = _.pickBy(_.omit(args, '$0'), (val) => val !== false);
  const hasArgs = Object.keys(testArgs).length > 0;
  const onlyHasPort = Object.keys(testArgs).length === 1 && !!testArgs.p || !!testArgs.port;

  if (hasArgs && !onlyHasPort) {
    _.forEach(testArgs, (val, key) => {
      const dash = key.length > 1 ? '--' : '-';
      cmd += ` ${dash + key} ${val}`;
    });
    Log.info('Running custom test command:');
  } else {
    if (os.platform() !== 'win32') {
      cmd = 'SERVER_TEST_REPORTER="dot" ' + cmd;
    }
    if (subCommands[1] === 'unit') {
      cmd += ' --once --headless --driver-package dispatch:mocha';
      Log.info('Running unit tests command:');
    } else {
      cmd += ' --once --full-app --headless --driver-package dispatch:mocha';
      Log.info('Running full-app test command:');
    }
    if (onlyHasPort) {
      const port = testArgs.port || testArgs.p;
      cmd += ' --port ' + port.toString();
    }
  }

  Log.info(chalk.green(' ' + cmd + '\n'));

  try {
    exec(cmd, { stdio: 'inherit' });
  } catch (err) {
    Log.error('\nTests failed.');
    process.exit(1);
  }
}
