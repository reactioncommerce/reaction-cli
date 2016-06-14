import { exec } from 'shelljs';
import { Log } from '../utils';

export function pull() {
  Log.info('Pulling the latest updates from Github...');
  exec('git pull');

  Log.info('Installing Node modules...');
  exec('meteor npm install');

  Log.success('Done!');
}
