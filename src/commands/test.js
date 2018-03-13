import os from 'os';
import { execSync as exec } from 'child_process';
import _ from 'lodash';
import chalk from 'chalk';
import { Log, loadPlugins, loadStyles, getJSONFromFile } from '../utils';

function runTestsManually(yargs) {
  let cmd = 'meteor test';

  const args = _.omit(yargs.argv, ['_', '$0']);
  const subCommands = yargs.argv._;
  const testArgs = _.pickBy(_.omit(args, '$0'), (val) => val !== false);
  const hasArgs = Object.keys(testArgs).length > 0;
  const onlyHasPort = Object.keys(testArgs).length === 1 && !!testArgs.port;

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

function runNpmTestCommand() {
  try {
    exec('npm test', { stdio: 'inherit' });
  } catch (err) {
    Log.error('\nTests failed.');
    process.exit(1);
  }
}

export function test(yargs) {
  Log.args(yargs.argv);

  Log.info('Setting up plugin imports...\n');
  loadPlugins();

  Log.info('Setting up style imports...\n');
  loadStyles();

  const { scripts } = getJSONFromFile('./package.json');

  // We want to run the "test" NPM script if it exists, but in versions of Reaction
  // prior to this change, "test" WAS present with the value "jest". So if it's present
  // with that exact value, then we'll keep the original behavior. After some time,
  // this logic can be removed and simply blindly pass through to `npm test` after
  // doing initial setup.
  if (scripts && scripts.test && scripts.test !== 'jest') {
    runNpmTestCommand();
  } else {
    // Backwards compatibility
    runTestsManually(yargs);
  }
}
