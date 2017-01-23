import { Log, loadPlugins, loadStyles } from '../utils';

export function plugins(yargs) {
  Log.args(yargs.argv);

  const commands = yargs.argv._;

  if (!commands[1]) {
    Log.error('\nOops! A subcommand is required.\n');
    Log.error('To load plugins, try running:\n');
    Log.warn(Log.yellow(' reaction plugins load\n'));
    process.exit(1);
  }

  if (commands[1] === 'load') {
    Log.info('\nSetting up plugin imports...');
    loadPlugins();
    Log.info('\nSetting up style imports...\n');
    loadStyles();
    return Log.success('Done!\n');
  }
}
