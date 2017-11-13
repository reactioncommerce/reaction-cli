import { execSync as exec } from 'child_process';
import _ from 'lodash';
import { Config, Log, setGitSSHKeyEnv } from '../../utils';
import listApps from './list';

export default async function appClone({ name, path }) {
  await listApps();

  const apps = Config.get('global', 'launchdock.apps', []);
  const app = _.filter(apps, (a) => a.name === name)[0];

  if (!app) {
    Log.warn('\nApp deployment not found');
    process.exit(1);
  }

  setGitSSHKeyEnv();

  Log.info('\nCloning app from the Reaction Platform...\n');

  try {
    exec(`git clone ${app.git.ssh_url_to_repo} ${path || ''}`, { stdio: 'inherit' });
  } catch (err) {
    Log.error('Failed to clone app');
    process.exit(1);
  }

  const namespace = app.group.namespace;
  const remoteName = `${namespace}-${name}`;
  const remoteAddCommand = `git remote add ${remoteName} ${app.git.ssh_url_to_repo}`;

  try {
    exec(`cd ${path || name} && ${remoteAddCommand}`, { stdio: 'ignore' });
  } catch (err) {
    Log.error(`Failed to update git remote url. Try adding it manually with: ${Log.magenta(`${remoteAddCommand}`)}`);
    process.exit(1);
  }

  Log.info(`\nSuccess! App has been cloned into directory: ${Log.magenta(path || name)}\n`);
}
