import { exec, which } from 'shelljs';
import { Log } from '../utils';

export function pull(yargs) {
  Log.args(yargs.argv);

  Log.info('\nPulling the latest updates from Github...');
  exec('git pull');

  Log.info('\nInstalling Node modules...');
  if (!!which('yarn')) {
    exec('yarn install');
  } else {
    exec('meteor npm install');
  }

  Log.success('Done!');
}
