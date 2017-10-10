import _ from 'lodash';
import { exec } from 'shelljs';
import { Config, Log } from '../../utils';
import listApps from './list';

export default async function appClone({ name, path }) {
  await listApps();

  const apps = Config.get('global', 'launchdock.apps', []);
  const app = _.filter(apps, (a) => a.name === name)[0];

  if (!app) {
    Log.warn('\nApp deployment not found');
    process.exit(1);
  }

  exec(`git clone ${app.git.ssh_url_to_repo} ${path || ''}`);

  const namespace = app.group.namespace;
  const remoteName = `${namespace}-${name}`;
  const remoteAddCommand = `git remote add ${remoteName} ${app.git.ssh_url_to_repo}`;

  if (exec(`cd ${path || name} && ${remoteAddCommand}`, { silent: true }).code !== 0) {
    Log.error(`Failed to update git remote url. Try adding it manually with: ${Log.magenta(`${remoteAddCommand}`)}`);
    process.exit(1);
  } else {
    Log.info(`\nSuccess! App has been cloned into directory: ${Log.magenta(path || name)}\n`);
  }
}
