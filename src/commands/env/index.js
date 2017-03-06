import _ from 'lodash';
import { Config, Log, getStringFromFile } from '../../utils';
import envList from './list';
import envSet from './set';
import envUnset from './unset';

const helpMessage = `
Usage:

  reaction env [command] [options]

    Commands:
      list      List the environment variables for a deployment
      set       Set the environment variables for a deployment
      unset     Unset environment variables for a deployment

    Options:
      --app       The name of the app to reference [Required]
      --env-file  Load a specified env file
`;

export async function env(yargs) {
  Log.args(yargs.argv);

  const subCommands = yargs.argv._;
  const args = _.omit(yargs.argv, ['_', '$0']);
  const { app } = args;

  if (!subCommands[1]) {
    Log.default(helpMessage);
    process.exit(1);
  }

  if (!app) {
    Log.error('Error: App name required');
    process.exit(1);
  }

  const apps = Config.get('global', 'launchdock.apps', []);
  const currentApp = _.filter(apps, (a) => a.name === app)[0];

  if (!currentApp || !currentApp._id) {
    Log.error('Error: App not found');
    process.exit(1);
  }

  // list
  if (subCommands[1] === 'list') {
    const vals = await envList(currentApp._id);

    if (vals) {
      Log.default('');
      _.forEach(vals, (val, key) => {
        Log.default(`${key}: ${val}`);
      });
    } else {
      Log.info('\nNo environment variables found.\n');
    }

    return vals;
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

  // set
  if (subCommands[1] === 'set') {

    if (args.settings) {
      values.METEOR_SETTINGS = getStringFromFile(args.settings);
    }

    if (args.registry) {
      values.REACTION_REGISTRY = getStringFromFile(args.registry);
    }

    return envSet({ _id: currentApp._id, values });
  }

  // unset
  if (subCommands[1] === 'unset') {
    const varsToUnset = Array.isArray(args.e) ? args.e : [args.e];
    const vals = await envUnset({ _id: currentApp._id, values: varsToUnset });

    if (vals) {
      Log.info('\nRemaining Environment Variables:\n');
      _.forEach(vals, (val, key) => {
        Log.default(`${key}: ${val}`);
      });
    } else {
      Log.info('\nNo environment variables remaining.\n');
    }
  }
}
