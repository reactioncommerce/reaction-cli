import _ from 'lodash';
import chalk from 'chalk';
import { exec } from 'shelljs';
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
    cmd = 'SERVER_TEST_REPORTER="dot" ' + cmd;
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

  if (exec(cmd).code !== 0) {
    Log.error('Tests failed.');
    process.exit(1);
  }
}
