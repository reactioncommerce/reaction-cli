import _ from 'lodash';
import { exec } from 'shelljs';
import { Log, exists, loadPlugins } from '../utils';

export function run(options) {
  const commands = options.argv._;
  const args = _.omit(options.argv, [
    '_',
    '$0',
    'debugPort',
    'mobileServer',
    'noLint',
    'noReleaseCheck',
    'allowIncompatibleUpdate'
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

  _.forEach(_.omit(args, ['settings', 'raw-logs', 'rawLogs']), (val, key) => {
    if (val) {
      const dash = key.length > 1 ? '--' : '-';
      if (val === true) {
        cmd += ` ${dash + key}`;
      } else {
        cmd += ` ${dash + key} ${val}`;
      }
    }
  });

  cmd += ' --raw-logs';

  Log.info('Setting up plugin imports...\n');
  loadPlugins();

  exec(cmd, { maxBuffer: 1024 * 1000 });
}
