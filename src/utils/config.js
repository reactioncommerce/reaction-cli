import fs from 'fs-extra';
import path from 'path';
import uuid from 'uuid';
import _ from 'lodash';
import { getUserHome, exists, isEmptyOrMissing } from './fs';
import checkIfInReactionDir from './check_app';
import Log from './logger';


/**
 * Default Configs
 */
const userHome = getUserHome();
const globalConfigDir = path.resolve(`${userHome}/.reaction`);
const localConfigDir = path.resolve('.reaction/');
const idFile = path.resolve(`${userHome}/.reaction/.id`);
const globalConfigFile = path.resolve(`${userHome}/.reaction/config.json`);
const localConfigFile = path.resolve('.reaction/config.json');

export const defaults = {
  global: {
    git: {
      url: 'https://github.com/reactioncommerce/reaction.git',
      branch: 'master'
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
  if (!exists(globalConfigDir)) {
    try {
      fs.mkdirsSync(globalConfigDir);
    } catch (error) {
      Log.error('Error creating Reaction CLI config directory');
      process.exit(1);
    }
  }

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
  if (!exists(localConfigDir)) {
    try {
      fs.mkdirsSync(localConfigDir);
    } catch (error) {
      Log.error('Error creating Reaction CLI config directory');
      process.exit(1);
    }
  }
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
    Log.error(`Error reading Reaction config file: ${Log.magenta(config)}`);
    process.exit(1);
  }
}


/**
 * Get a Reaction config
 * @param  {String} type - specify global or local config
 * @param  {String} setting - a '.' delimited string representing the settings obj path
 * @return {Any} returns the value if found, else undefined
 */
export function get(type, setting) {

  if (type !== 'global' && type !== 'local') {
    Log.error('\nMust specify "global" or "local" config to retrieve');
    process.exit(1);
  }

  if (typeof setting !== 'string') {
    Log.error('\nMust specify a String value for the config setting to get');
    process.exit(1);
  }

  let config;

  if (type === 'local') {
    config = localConfigFile;
    checkIfInReactionDir();
    initLocalConfig();
  } else {
    config = globalConfigFile;
  }

  try {
    return _.get(fs.readJSONSync(config), setting);
  } catch (error) {
    Log.error(`Error reading Reaction config file: ${Log.magenta(config)}`);
    process.exit(1);
  }
}


/**
 * Get a Reaction config
 * @param  {String} type - specify global or local config
 * @param  {String} setting - a '.' delimited string representing the settings obj path
 * @param  {Any}    value - the value to set
 * @return {Object} returns JSON content from the updated config
 */
export function set(type, setting, value) {
  if (type !== 'global' && type !== 'local') {
    Log.error('Must specify "global" or "local" config to retrieve');
    process.exit(1);
  }

  if (typeof value === 'undefined') {
    Log.error('Must provide a setting value to Config.set()');
    process.exit(1);
  }

  let config;

  if (type === 'local') {
    config = localConfigFile;
    checkIfInReactionDir();
    initLocalConfig();
  } else {
    config = globalConfigFile;
  }

  let currentVals;

  try {
    currentVals = fs.readJSONSync(config);
  } catch (error) {
    Log.error(`Error reading Reaction config file: ${Log.magenta(config)}`);
    process.exit(1);
  }

  if (typeof currentVals !== 'object') {
    currentVals = defaults[type];
  }

  const newVals = _.set(currentVals, setting, value);

  try {
    fs.writeJSONSync(config, newVals);
  } catch (error) {
    Log.error(`Error writing to config file: ${Log.magenta(config)}`);
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
  if (type !== 'global' && type !== 'local') {
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
    defaultsValues = defaults.global;
  }

  try {
    fs.writeJSONSync(config, defaultsValues);
  } catch (error) {
    Log.error(`Error resetting Reaction config file at: ${Log.magenta(config)}`);
    process.exit(1);
  }

  return true;
}
