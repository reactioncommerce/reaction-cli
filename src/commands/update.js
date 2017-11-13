import { execSync as exec } from 'child_process';
import { Log, upgradeModules } from '../utils';

export function update(yargs) {
  Log.args(yargs.argv);

  Log.info('\nUpdating Meteor and Atmosphere packages...');

  try {
    exec('meteor update', { stdio: 'inherit' });
  } catch (err) {
    Log.error('\nError: Meteor update failed');
    process.exit(1);
  }

  Log.info('\nUpdating Node modules...');
  upgradeModules();

  Log.success('Done!');
}
