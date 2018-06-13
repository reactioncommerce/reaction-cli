import fs from 'fs-extra';
import _ from 'lodash';
import Table from 'cli-table3';
import { Config, Log, getStringFromFile, ensureSSHKeysExist } from '../../utils';
import appsList from './list';
import appCreate from './create';
import appDelete from './delete';
import appClone from './clone';

const helpMessage = `
Usage:

  reaction apps [command]

    Commands:
      list      List your app deployments
      create    Create a new app deployment on Launchdock
      delete    Remove an existing app deployment from Launchdock
      clone     Git clone an existing app deployment from Launchdock
`;

export async function apps(yargs) {
  Log.args(yargs.argv);

  const subCommands = yargs.argv._;
  const args = _.omit(yargs.argv, ['_', '$0']);
  const { name, remote, path } = args;

  if (!subCommands[1]) {
    return Log.default(helpMessage);
  }

  // create
  if (subCommands[1] === 'create') {

    if (!name) {
      return Log.error('Error: App name required');
    }

    if (remote !== false) {
      const notInReactionDir = () => {
        Log.error('\nNot in a Reaction app directory.\n');
        Log.info(`To create a new local project, run: ${Log.magenta('reaction init')}\n`);
      };

      let packageFile;
      try {
        packageFile = fs.readJSONSync('./package.json');
      } catch(e) {
        notInReactionDir();
        process.exit(1);
      }

      if (packageFile.name !== 'reaction') {
        notInReactionDir();
        process.exit(1);
      }
    }

    const env = {};

    // convert any supplied env vars into an object
    if (Array.isArray(args.e)) {
      args.e.forEach((val) => {
        const conf = val.split('=');
        env[conf[0]] = conf[1];
      });
    } else if (typeof args.e === 'string') {
      const conf = args.e.split('=');
      env[conf[0]] = conf[1];
    }

    if (args.settings) {
      env.METEOR_SETTINGS = getStringFromFile(args.settings);
    }

    if (args.registry) {
      env.REACTION_REGISTRY = getStringFromFile(args.registry);
    }

    return appCreate({ name: name.toLowerCase(), env, remote });
  }

  // list
  if (subCommands[1] === 'list') {
    const allApps = await appsList();

    if (allApps.length !== 0) {
      const { blue, magenta } = Log;

      const table = new Table({
        head: [
          blue('App ID'),
          blue('Name'),
          blue('Default URL'),
          blue('Custom Domain'),
          blue('Group'),
          blue('Created By')
        ]
      });

      Log.info('\nApps List\n');

      allApps.forEach((app) => {
        const row = [];
        _.forEach(_.omit(app, ['git']), (val, key) => {
          if (key === 'domains' && Array.isArray(val) && val.length > 1) {
            row.push(magenta(val.length > 1 ? val.join('\n') : val));
          } else if (key === 'domain') {
            row.push(magenta(val ? `https://${val}` : ''));
          } else if (key === 'group') {
            row.push(magenta(val.name));
          } else if (key === 'user') {
            row.push(magenta(val.username));
          } else {
            row.push(magenta(val || ''));
          }
        });
        table.push(row);
      });

      Log.info(table.toString());
      Log.info('');
    } else {
      Log.info('\nNo apps found.\n');
      Log.info(`Run ${Log.magenta('reaction apps create --name <appname>')} to create one.\n`);
    }
  }

  // delete
  if (subCommands[1] === 'delete') {
    if (!name) {
      return Log.error('App name required');
    }

    return appDelete({ name });
  }

  // clone
  if (subCommands[1] === 'clone') {
    if (!name) {
      return Log.error('App name required');
    }

    await ensureSSHKeysExist();

    return appClone({ name, path });
  }
}
