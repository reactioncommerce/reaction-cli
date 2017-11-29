import { execSync } from 'child_process';
import _ from 'lodash';
import { Config, Log, installModules, ensureSSHKeysExist, setGitSSHKeyEnv } from '../utils';

export async function pull(yargs) {
  Log.args(yargs.argv);

  const { app } = yargs.argv;

  if (app) {
    const apps = Config.get('global', 'launchdock.apps', []);
    const appToDeploy = _.filter(apps, (a) => a.name === app)[0];

    if (!appToDeploy) {
      const msg = 'App not found. Run \'reaction apps list\' to see your active apps';
      Log.error(msg);
      process.exit(1);
    }

    let branch;
    try {
      branch = execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\r?\n|\r/g, '');
    } catch (err) {
      Log.error('\nFailed to get current branch. Exiting.');
      process.exit(1);
    }

    Log.info(`\nPulling the latest updates from the ${branch} brach of ${app}...\n`);

    await ensureSSHKeysExist();
    setGitSSHKeyEnv();

    try {
      execSync(`git pull ${appToDeploy.group.namespace}-${app} ${branch}`, { stdio: 'inherit' });
    } catch (err) {
      Log.error('\nError: Pull failed. Exiting.');
      process.exit(1);
    }
  } else {
    Log.info('\nPulling the latest updates from Github...\n');

    try {
      execSync('git pull', { stdio: 'inherit' });
    } catch (err) {
      Log.default(err);
      Log.error('\nError: Unable to pull from Github. Exiting.');
      process.exit(1);
    }
  }

  Log.info('\nInstalling Node modules...');
  installModules();

  Log.success('Done!');
}
