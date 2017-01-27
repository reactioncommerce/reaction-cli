import { exec } from 'shelljs';
import { Log, yarnOrNpm } from '../utils';

export function update(yargs) {
  Log.args(yargs.argv);

  Log.info('\nUpdating Meteor and Atmosphere packages...');
  exec('meteor update');

  Log.info('\nUpdating Node modules...');

  if (yarnOrNpm() === 'yarn') {
    exec('yarn upgrade');
  } else {
    exec('meteor npm update');
  }

  Log.success('Done!');
}
