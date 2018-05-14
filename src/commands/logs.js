import fetch from 'node-fetch';
import _ from 'lodash';
import { Config, Log } from '../utils';

const helpMessage = `
Usage:

  reaction logs --app <appName>
  reaction logs -a <appName>
`;

export async function logs(yargs) {
  Log.args(yargs.argv);

  const args = _.omit(yargs.argv, ['_', '$0']);

  if (!args.app) {
    return Log.default(helpMessage);
  }

  const apps = Config.get('global', 'launchdock.apps', []);
  const app = _.filter(apps, (a) => a.name === args.app)[0];

  if (!app) {
    Log.warn('\nApp deployment not found');
    process.exit(1);
  }

  const baseUrl = process.env.LAUNCHDOCK_URL || Config.get('cli', 'launchdock.url');
  const token = Config.get('global', 'launchdock.token');
  const url = `${baseUrl}/logs/${app._id}`;

  Log.debug(`[Launchdock API]: GET ${url}`);

  try {
    const res = await fetch(url, { headers: { 'meteor-login-token': token } });
    process.stdout.write(await res.text());
  } catch (err) {
    Log.error(err);
    process.exit(1);
  }
}
