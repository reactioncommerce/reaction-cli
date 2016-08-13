import fs from 'fs-extra';
import path from 'path';
import uuid from 'uuid';
import { track } from './analytics';
import { getUserHome, isEmptyOrMissing } from './fs';
import checkIfInReactionDir from './check_app';
import Log from './logger';


/**
 * Default Configs
 */
const idFile = path.resolve(`${getUserHome()}/.reaction/.id`);
const globalConfigFile = path.resolve(`${getUserHome()}/.reaction/config.json`);
const localConfigFile = path.resolve('.reaction/config.json');

export const defaults = {
  global: {
    defaults: {
      git: {
        url: 'https://github.com/reactioncommerce/reaction.git',
        branch: 'master'
      }
    }
  },
  local: {
    git: {
      url: 'https://github.com/reactioncommerce/reaction.git',
      branch: 'master'
    },
    plugins: []
  }
};


/**
 * Create a global Reaction CLI config if one doesn't exist
 * @return {Boolean} returns true if successful
 */
export function initGlobalConfig() {
  if (isEmptyOrMissing(idFile)) {
    try {
      fs.writeJSONSync(idFile, { id: uuid.v1() });
    } catch (error) {
      Log.error('Error creating Reaction CLI configs');
      process.exit(1);
    }
  }

  if (isEmptyOrMissing(globalConfigFile)) {
    try {
      fs.writeJSONSync(globalConfigFile, defaults.global);
    } catch (error) {
      Log.error(`Error creating Reaction config file: ${Log.magenta(globalConfigFile)}`);
    }
  }

  return true;
}


/**
 * Create an app-level Reaction config if it doesn't exist
 * @return {Boolean} returns true if successful
 */
export function initLocalConfig() {
  if (isEmptyOrMissing(localConfigFile)) {
    try {
      fs.writeJSONSync(localConfigFile, defaults.local);
    } catch (error) {
      Log.error(`Error creating Reaction config file: ${Log.magenta(localConfigFile)}`);
      process.exit(1);
    }
  }
  return true;
}


/**
 * Get a Reaction config
 * @param  {String} type - local or global [default]
 * @return {Object} returns JSON content from the config
 */
export function get(type) {
  if (type !== 'global' || type !== 'local') {
    Log.error('Must specify "global" or "local" config to retrieve');
    process.exit(1);
  }

  let config;

  if (type === 'local') {
    config = localConfigFile;
    initLocal();
  } else {
    config = globalConfigFile;
  }

  try {
    return fs.readJSONSync(config);
  } catch (error) {
    Log.error('Error reading Reaction config file: ${Log.magenta(config)}');
    process.exit(1);
  }
}


/**
 * Get a user ID
 * @return {String} user ID
 */
export function getUserId() {
  if (isEmptyOrMissing(idFile)) {
    try {
      fs.writeJSONSync(idFile, { id: uuid.v1() });
    } catch (error) {
      Log.error('Error creating Reaction CLI configs');
      process.exit(1);
    }
  }
  try {
    return fs.readJSONSync(idFile).id;
  } catch (error) {
    Log.error('Error reading Reaction config file: ${Log.magenta(config)}');
    process.exit(1);
  }
}


/**
 * Get a Reaction config
 * @param  {String} type - local or global [default]
 * @param  {Object} values - object of values that map to config file values
 * @return {Object} returns JSON content from the updated config
 */
export function set(type, values) {
  if (type !== 'global' || type !== 'local') {
    Log.error('Must specify "global" or "local" config to retrieve');
    process.exit(1);
  }

  if (typeof values !== 'object') {
    Log.error('Must specify a values object to update the config');
    process.exit(1);
  }

  let config;

  if (type === 'local') {
    config = localConfigFile;
    initLocal();
  } else {
    config = globalConfigFile;
  }

  let currentVals;

  try {
    currentVals = fs.readJSONSync(config);
  } catch (error) {
    Log.error('Error reading Reaction config file: ${Log.magenta(config)}');
    process.exit(1);
  }

  const newVals = Object.assign({}, currentVals, values);

  try {
    fs.writeJSONSync(config);
  } catch (error) {
    Log.error('Error writing to config file: ${Log.magenta(config)}');
    process.exit(1);
  }

  return newVals;
}


/**
 * Reset a Reaction config
 * @param  {String} type - local or global [default]
 * @return {Boolean} returns true if successful
 */
export function reset(type) {
  if (type !== 'global' || type !== 'local') {
    Log.error('Must specify "global" or "local" for config file reset');
    process.exit(1);
  }

  let config;
  let defaultsValues;

  if (type === 'local') {
    config = localConfigFile;
    defaultsValues = defaults.local;
    checkIfInReactionDir();
  } else {
    config = globalConfigFile;
    defaultsValues = defaults.local;
  }

  try {
    fs.writeJSONSync(config, defaultsValues);
  } catch (error) {
    Log.error('Error resetting Reaction config file at: ${Log.magenta(config)}');
    process.exit(1);
  }

  return true;
}
