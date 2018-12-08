import _ from 'lodash';
import { execSync as exec } from 'child_process';
import { Log, exists, loadPlugins, loadStyles, checkForReactionUpdate, setRegistryEnv, provisionAssets } from '../utils';

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
  
  if (args.settings) {
    Log.info(`\nUsing settings file at ${Log.magenta(args.settings)}\n`);
    cmd += ` --settings ${args.settings}`;
  }

  _.forEach(_.omit(args, ['settings', 's', 'registry', 'r', 'raw-logs', 'rawLogs', 'inspect-brk', 'inspectBrk']), (val, key) => {
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

  if (typeof args['inspect-brk'] === 'string' || typeof args.inspectBrk === 'string') {
    cmd += ` --inspect-brk=${args['inspect-brk'] ? args['inspect-brk'] : args.inspectBrk}`;
  } else if (args['inspect-brk'] === true || args.inspectBrk === true) {
    cmd += ` --inspect-brk`;
  }

  cmd += ' --raw-logs';

  Log.debug(`Command: ${cmd}`);

  Log.info('Setting up plugin imports...\n');
  loadPlugins();

  Log.info('Setting up style imports...\n');
  loadStyles();

  Log.info('Provisioning assets...\n');
  provisionAssets();

  try {
    exec(cmd, { stdio: 'inherit' });
  } catch (err) {
    Log.default(err);
    Log.error('\nError: App failed to start');
    process.exit(1);
  }
}
