import { exec } from 'shelljs';
import { Log, yarnOrNpm } from '../utils';

export function pull(yargs) {
  Log.args(yargs.argv);

  Log.info('\nPulling the latest updates from Github...');
  exec('git pull');

  Log.info('\nInstalling Node modules...');

  if (exec(`meteor ${yarnOrNpm()} install`).code !== 0) {
    Log.error('\nError: Node modules were not successfully installed.');
    process.exit(1);
  }

  Log.success('Done!');
}
