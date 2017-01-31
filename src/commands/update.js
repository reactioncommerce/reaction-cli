import { exec } from 'shelljs';
import { Log, upgradeModules } from '../utils';

export function update(yargs) {
  Log.args(yargs.argv);

  Log.info('\nUpdating Meteor and Atmosphere packages...');
  exec('meteor update');

  Log.info('\nUpdating Node modules...');
  upgradeModules();

  Log.success('Done!');
}
