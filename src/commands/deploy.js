import fs from 'fs-extra';
import _ from 'lodash';
import { exec } from 'shelljs';
import { Config, GraphQL, Log } from '../utils';

const helpMessage = `
Usage:

  reaction deploy [options]

    Options:
      --name    The name of the app to deploy
      --image   The Docker image to deploy (optional)
`;

export async function deploy(yargs) {
  Log.args(yargs.argv);

  const args = _.omit(yargs.argv, ['_', '$0']);
  const { name, image } = args;

  if (!name && !image) {
    return Log.default(helpMessage);
  }

  if (!name) {
    return Log.error('Error: App name required (--name myapp)');
  }

  const apps = Config.get('global', 'launchdock.apps', []);
  const app = _.filter(apps, (a) => a.name === name)[0];

  if (!app) {
    const msg = 'App not found. Run \'reaction apps list\' to see your active apps';
    logger.error(msg);
    throw new Error(msg);
  }

  if (image || app.image) {
    // docker pull deployment

    const options = {
      _id: app._id,
      image: image || app.image
    };

    const gql = new GraphQL();

    const result = await gql.fetch(`
      mutation appPull($_id: ID!, $image: String! ) {
        appPull(_id: $_id, image: $image) {
          _id
          name
          image
          deploymentId
          defaultUrl
        }
      }
    `, options);

    if (!!result.errors) {
      result.errors.forEach((err) => {
        Log.error(err.message);
      });
      process.exit(1);
    }

    const { defaultUrl } = result.data.appPull;

    Log.success('\nDone!\n');

    Log.info(`Updated ${Log.magenta(name)} with image ${Log.magenta(options.image)}\n`) ;
    Log.info('Your app will be ready as soon as the image finishes starting up.\n');
    Log.info(`App URL: ${Log.magenta(defaultUrl)}\n`);

  } else {
    // git push deployment

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
      Log.info(`To publish a new key: ${Log.magenta('reaction keys add /path/to/key.pub')}\n`);
      process.exit(1);
    }

    if (exec(`git push launchdock-${name}`).exit !== 0) {
      Log.error('Deployment failed');
      process.exit(1);
    }

    Log.success('\nDone!\n');

    Log.info('Your app will be ready as soon as it finishes starting up.\n');
    Log.info(`App URL: ${Log.magenta(defaultUrl)}\n`);

    Log.success('Done!');
  }
}
