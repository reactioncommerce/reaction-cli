import _ from 'lodash';
import opn from 'opn';
import { Config, Log } from '../utils';


const helpMessage = `
Usage:

  reaction open <appname>
`;


export function open(yargs) {
  Log.args(yargs.argv);

  const name = yargs.argv._[1];

  const { help } = yargs.argv;

  if (!name || help) {
    Log.default(helpMessage);
    process.exit(1);
  }

  const apps = Config.get('global', 'launchdock.apps', []);
  const app = _.filter(apps, (a) => a.name === name)[0];

  if (!app) {
    Log.error('ERROR: App not found');
    process.exit(1);
  }

  opn(app.url || app.defaultUrl, { wait: false });
}
