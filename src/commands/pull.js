import { exec } from 'shelljs';
import { Log, installModules } from '../utils';

export function pull(yargs) {
  Log.args(yargs.argv);

  Log.info('\nPulling the latest updates from Github...');
  exec('git pull');

  Log.info('\nInstalling Node modules...');
  installModules();

  Log.success('Done!');
}
