import _ from 'lodash';
import { exec } from 'shelljs';
import { Log, exists } from '../utils';

export function run(options) {
  const commands = options._;
  const args = _.omit(options.argv, '_');

  const devSettings = 'settings/dev.settings.json';
  const prodSettings = 'settings/settings.json';

  let cmd = 'meteor';

  if (_.includes(commands, 'debug')) {
    cmd += ' debug';
  }

  if (args.settings) {
    Log.info(`Using settings file at ${args.settings}\n`);
    cmd += ` --settings ${args.settings}`;
  } else if (exists(prodSettings)) {
    Log.info(`Using settings file at ${prodSettings}\n`);
    cmd += ` --settings ${prodSettings}`;
  } else if (exists(devSettings)) {
    Log.info(`Using settings file at ${devSettings}\n`);
    cmd += ` --settings ${devSettings}`;
  }

  _.forEach(_.omit(args, ['settings', '$0']), (val, key) => {
    if (val) {
      const dash = key.length > 1 ? '--' : '-';
      cmd += ` ${dash + key} ${val}`;
    }
  });

  exec(cmd);
}
