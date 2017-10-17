import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import fetch from 'node-fetch';
import inquirer from 'inquirer';
import { exec } from 'shelljs';
import { Config, Log, getStringFromFile, ensureSSHKeysExist, setGitSSHKeyEnv, isEmptyOrMissing } from '../utils';

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
    process.exit(1);
  }

  const values = {};

  // convert any supplied env vars into an object
  if (Array.isArray(args.e)) {
    args.e.forEach((val) => {
      const conf = val.split('=');
      values[conf[0]] = conf[1];
    });
  } else if (typeof args.e === 'string') {
    const conf = args.e.split('=');
    values[conf[0]] = conf[1];
  }

  // read in a settings file if provided
  if (args.settings) {
    values.METEOR_SETTINGS = getStringFromFile(args.settings);
  }

  // read in a Reaction registry file if provided
  if (args.registry) {
    values.REACTION_REGISTRY = getStringFromFile(args.registry);
  }

  const options = { _id: appToDeploy._id };

  if (Object.keys(values).length > 0) {
    options.env = values;
  }


  if (image || appToDeploy.image) {
    // docker pull deployment
    Log.warn('Prebuilt Docker image deployment is currently unavailable.');
    Log.warn('Contact support for more info.');

    process.exit(1);

    // TODO: allow deployment of prebuilt images
    //
    // options.image = image || appToDeploy.image;
    //
    // const result = await gql.fetch(`
    //   mutation appPull($_id: ID!, $image: String! $env: JSON) {
    //     appPull(_id: $_id, image: $image, env: $env) {
    //       _id
    //       name
    //       image
    //       defaultUrl
    //     }
    //   }
    // `, options);
    //
    // if (!!result.errors) {
    //   result.errors.forEach((err) => {
    //     Log.error(err.message);
    //   });
    //   process.exit(1);
    // }
    //
    // const { defaultUrl } = result.data.appPull;
    //
    // Log.success('\nDone!\n');
    //
    // Log.info(`Updated ${Log.magenta(app)} with image ${Log.magenta(options.image)}\n`);
    // Log.info('You will receive a notification email as soon as the deployment finishes.\n');
    // Log.info(`App URL: ${Log.magenta(defaultUrl)}\n`);
  } else {
    // git push deployment

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

    // If we don't have a Reaction CI config file,
    // prompt the user to download it from Github
    // and commit it to their repo
    const configFilePath = '.reaction/ci/config.yml';

    if (isEmptyOrMissing(configFilePath)) {
      Log.warn(`\nRequired Reaction CI configuration file not found at: ${configFilePath}\n`);

      const { download } = await inquirer.prompt([{
        type: 'confirm',
        name: 'download',
        message: '\nWould you like to download the latest from Github and commit it to your repo?',
        default: true
      }]);

      if (download) {
        try {
          const res = await fetch(`https://api.github.com/repos/reactioncommerce/reaction/contents/${configFilePath}`);
          const json = await res.json();

          const configFile = new Buffer(json.content, 'base64').toString('utf8');

          fs.writeFileSync(path.resolve(configFilePath), configFile);
        } catch(e) {
          Log.debug(e);
          Log.error('Failed to create Reaction CI config file. Please contact support.');
          process.exit(1);
        }

        exec(`git add ${configFilePath} && git commit -m "Add Reaction CI config file"`);

        Log.success('\nReaction CI config file created!\n');
      } else {
        Log.error(`\nReaction CI configuration is required. Please add one at: ${configFilePath}\n`);
        process.exit(1);
      }
    }

    await ensureSSHKeysExist();

    Log.info('\nPushing updates to be built...\n');
    setGitSSHKeyEnv();
    const branch = exec('git rev-parse --abbrev-ref HEAD', { silent: true }).stdout.replace(/\r?\n|\r/g, '');
    const result = exec(`git push ${appToDeploy.group.namespace}-${app} ${branch}`);

    if (result.code !== 0) {
      Log.error('Deployment failed');
      process.exit(1);
    }

    if (result.stderr.includes('Everything up-to-date')) {
      Log.info('No committed changes to deploy.\n');
      process.exit(0);
    }

    Log.info('You will be notified as soon as your app finishes building and deploying.\n');
    Log.success('Done!\n');
  }
}
