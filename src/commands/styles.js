import { Log, loadPlugins } from '../utils';

export function styles(yargs) {
  Log.args(yargs.argv);

  const commands = yargs.argv._;

  if (!commands[1]) {
    Log.error('\nOops! A subcommand is required.\n');
    Log.error('To load styles, try running:\n');
    Log.warn(Log.yellow(' reaction styles load\n'));
    process.exit(1);
  }

  if (commands[1] === 'load') {
    Log.info('\nSetting up style imports...\n');
    loadPlugins();
    return Log.success('Done!\n');
  }
}
