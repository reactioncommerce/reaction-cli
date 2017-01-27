import { exec } from 'shelljs';
import { Log, yarnOrNpm } from '../utils';

export function update(yargs) {
  Log.args(yargs.argv);

  Log.info('\nUpdating Meteor and Atmosphere packages...');
  exec('meteor update');

  Log.info('\nUpdating Node modules...');

  if (yarnOrNpm() === 'yarn') {
    if (exec('meteor yarn upgrade').code !== 0) {
      Log.error('\nError: Node modules were not successfully installed.');
      process.exit(1);
    }
  } else {
    if (exec('meteor npm update').code !== 0) {
      Log.error('\nError: Node modules were not successfully installed.');
      process.exit(1);
    }
  }

  Log.success('Done!');
}
