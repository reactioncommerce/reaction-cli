import { exec } from 'shelljs';
import { Log, yarnOrNpm } from '../utils';

export function pull(yargs) {
  Log.args(yargs.argv);

  Log.info('\nPulling the latest updates from Github...');
  exec('git pull');

  Log.info('\nInstalling Node modules...');
  exec(`meteor ${yarnOrNpm()} install`);

  Log.success('Done!');
}
