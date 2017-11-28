import _ from 'lodash';
import { execSync as exec } from 'child_process';
import { Log, exists, loadPlugins, loadStyles, checkForReactionUpdate, setRegistryEnv } from '../utils';

export async function run(yargs) {
  Log.args(yargs.argv);

  await checkForReactionUpdate();

  const commands = yargs.argv._;
  const args = _.omit(yargs.argv, [
    '_',
    '$0',
    'debugPort',
    'mobileServer',
    'noLint',
    'noReleaseCheck',
    'allowIncompatibleUpdate',
    'allowSuperuser'
  ]);

  let cmd = 'meteor';

  if (!!commands.length && commands[0] === 'debug') {
    cmd += ' debug';
  }

  const devSettings = 'settings/dev.settings.json';
  const prodSettings = 'settings/settings.json';

  if (args.settings) {
    Log.info(`\nUsing settings file at ${Log.magenta(args.settings)}\n`);
    cmd += ` --settings ${args.settings}`;
  } else if (exists(prodSettings)) {
    Log.info(`\nUsing settings file at ${Log.magenta(prodSettings)}\n`);
    cmd += ` --settings ${prodSettings}`;
  } else if (exists(devSettings)) {
    Log.info(`\nUsing settings file at ${Log.magenta(devSettings)}\n`);
    cmd += ` --settings ${devSettings}`;
  }

  _.forEach(_.omit(args, ['settings', 's', 'registry', 'r', 'raw-logs', 'rawLogs']), (val, key) => {
    if (val) {
      const dash = key.length > 1 ? '--' : '-';
      if (val === true) {
        cmd += ` ${dash + key}`;
      } else {
        cmd += ` ${dash + key} ${val}`;
      }
    }
  });

  if (args.registry) {
    setRegistryEnv(args.registry);
  }

  cmd += ' --raw-logs';

  Log.debug(`Command: ${cmd}`);

  Log.info('Setting up plugin imports...\n');
  loadPlugins();

  Log.info('Setting up style imports...\n');
  loadStyles();

  try {
    exec(cmd, { stdio: 'inherit' });
  } catch (err) {
    Log.default(err);
    Log.error('\nError: App failed to start');
    process.exit(1);
  }
}
