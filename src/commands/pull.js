import { exec } from 'shelljs';
import { Log } from '../utils';

export function pull() {
  Log.info('\nPulling the latest updates from Github...');
  exec('git pull');

  Log.info('\nInstalling Node modules...');
  exec('meteor npm install');

  Log.success('Done!');
}
