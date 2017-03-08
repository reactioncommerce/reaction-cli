import fs from 'fs-extra';
import _ from 'lodash';
import Table from 'cli-table2';
import { Config, Log, getStringFromFile } from '../../utils';
import appsList from './list';
import appCreate from './create';
import appDelete from './delete';

const helpMessage = `
Usage:

  reaction apps [command]

    Commands:
      list      List your app deployments
      create    Create a new app deployment on Launchdock
      delete    Remove an existing app deployment from Launchdock
`;

export async function apps(yargs) {
  Log.args(yargs.argv);

  const subCommands = yargs.argv._;
  const args = _.omit(yargs.argv, ['_', '$0']);
  const { name, image } = args;

  if (!subCommands[1]) {
    return Log.default(helpMessage);
  }

  // create
  if (subCommands[1] === 'create') {

    if (!name) {
      return Log.error('Error: App name required');
    }

    if (!image) {
      const notInReactionDir = () => {
        Log.error('\nNot in a Reaction app directory.\n');
        Log.info(`To create a new local project, run: ${Log.magenta('reaction init')}\n`);
        Log.info('Or to create a deployment with a prebuilt Docker image, use the --image flag\n');
        Log.info(`Example: ${Log.magenta(`reaction apps create --name ${name} --image myorg/myapp:latest`)}\n`);
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

      const keys = Config.get('global', 'launchdock.keys', []);

      if (!keys.length) {
        Log.error('\nAn SSH public key is required to do custom deployments\n');
        Log.info(`To add a key to your account: ${Log.magenta('reaction keys add /path/to/key.pub')}\n`);
        const keypairHelpUrl = 'https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/';
        Log.info(`More info about creating a key pair: ${Log.magenta(keypairHelpUrl)}\n`);
        process.exit(1);
      }
    }

    const env = {};

    if (args.settings) {
      env.METEOR_SETTINGS = getStringFromFile(args.settings);
    }

    if (args.registry) {
      env.REACTION_REGISTRY = getStringFromFile(args.registry);
    }

    return appCreate({ name, image, env });
  }

  // list
  if (subCommands[1] === 'list') {
    const allApps = await appsList();

    if (allApps.length !== 0) {
      const { blue, magenta } = Log;
      const table = new Table({ head: [blue('App ID'), blue('Name'), blue('Image'), blue('URL')] });

      Log.info('\nApps List\n');

      allApps.forEach((app) => {
        const row = [];
        _.forEach(_.omit(app, ['deploymentId']), (val) => row.push(magenta(val || '')));
        table.push(row);
      });

      Log.info(table.toString());
      Log.info('');
    }
  }

  // delete
  if (subCommands[1] === 'delete') {
    if (!name) {
      return Log.error('App name required');
    }

    return appDelete({ name });
  }
}
