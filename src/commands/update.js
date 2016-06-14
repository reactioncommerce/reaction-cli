import { exec } from 'shelljs';
import { Log } from '../utils';

export function update() {
  Log.info('Updating Atmosphere packages...');
  exec('meteor update');

  Log.info('Updating Node modules...');
  exec('meteor npm update');

  Log.success('Done!');
}
