import { execSync as exec } from 'child_process';
import { Log, installModules } from '../utils';

export function pull(yargs) {
  Log.args(yargs.argv);

  Log.info('\nPulling the latest updates from Github...\n');

  try {
    exec('git pull', { stdio: 'inherit' });
  } catch (err) {
    Log.error('\nError: Unable to pull from Github. Exiting.');
    process.exit(1);
  }

  Log.info('\nInstalling Node modules...');
  installModules();

  Log.success('Done!');
}
