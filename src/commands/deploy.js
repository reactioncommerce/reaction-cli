import fs from 'fs-extra';
import _ from 'lodash';
import { exec } from 'shelljs';
import { Config, GraphQL, Log } from '../utils';

const helpMessage = `
Usage:

  reaction deploy [options]

    Options:
      --app, -a    The name of the app to deploy (required)
      --env, -e    Set/update an environment varible before deployment
      --image, -i  The Docker image to deploy
`;

export async function deploy(yargs) {
  Log.args(yargs.argv);

  const args = _.omit(yargs.argv, ['_', '$0']);
  const { app, image } = args;

  if (!app && !image) {
    return Log.default(helpMessage);
  }

  if (!app) {
    return Log.error('Error: App name required (--app myapp)');
  }

  const apps = Config.get('global', 'launchdock.apps', []);
  const appToDeploy = _.filter(apps, (a) => a.name === app)[0];

  if (!appToDeploy) {
    const msg = 'App not found. Run \'reaction apps list\' to see your active apps';
    Log.error(msg);
    throw new Error(msg);
  }

  if (image || appToDeploy.image) {
    // docker pull deployment

    const options = {
      _id: appToDeploy._id,
      image: image || appToDeploy.image
    };

    const gql = new GraphQL();

    const result = await gql.fetch(`
      mutation appPull($_id: ID!, $image: String! ) {
        appPull(_id: $_id, image: $image) {
          _id
          name
          image
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

    Log.info(`Updated ${Log.magenta(app)} with image ${Log.magenta(options.image)}\n`);
    Log.info('You will receive a notification email as soon as the deployment finishes.\n');
    Log.info(`App URL: ${Log.magenta(defaultUrl)}\n`);

  } else {
    // git push deployment

    const notInReactionDir = () => {
      Log.error('\nNot in a Reaction app directory.\n');
      Log.info(`To create a new local project, run: ${Log.magenta('reaction init')}\n`);
      Log.info('Or to create a deployment with a prebuilt Docker image, use the --image flag\n');
      Log.info(`Example: ${Log.magenta(`reaction apps create --name ${app} --image myorg/myapp:latest`)}\n`);
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

    if (exec(`git push launchdock-${app}`).code !== 0) {
      Log.error('Deployment failed');
      process.exit(1);
    }

    Log.info('Your app will be ready as soon as it finishes starting up.\n');
    Log.info(`App URL: ${Log.magenta(appToDeploy.defaultUrl)}\n`);

    Log.success('Done!\n');
  }
}
