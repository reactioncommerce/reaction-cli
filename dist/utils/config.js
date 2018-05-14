'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaults = undefined;

var _unset2 = require('lodash/unset');

var _unset3 = _interopRequireDefault(_unset2);

var _set2 = require('lodash/set');

var _set3 = _interopRequireDefault(_set2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.initGlobalConfig = initGlobalConfig;
exports.initLocalConfig = initLocalConfig;
exports.getUserId = getUserId;
exports.get = get;
exports.set = set;
exports.unset = unset;
exports.reset = reset;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _fs = require('./fs');

var _check_app = require('./check_app');

var _check_app2 = _interopRequireDefault(_check_app);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Default Configs
 */
var userHome = (0, _fs.getUserHome)();
var globalConfigDir = _path2.default.resolve(userHome + '/.reaction');
var localConfigDir = _path2.default.resolve('.reaction/');
var idFile = _path2.default.resolve(userHome + '/.reaction/.id');
var globalConfigFile = _path2.default.resolve(userHome + '/.reaction/config.json');
var localConfigFile = _path2.default.resolve('.reaction/config.json');
var cliConfigFile = _path2.default.resolve(__dirname, '../../config.json');

var defaults = exports.defaults = {
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
function initGlobalConfig() {
  if (!(0, _fs.exists)(globalConfigDir)) {
    try {
      _fsExtra2.default.mkdirsSync(globalConfigDir);
    } catch (error) {
      _logger2.default.error('Error creating Reaction CLI config directory');
      process.exit(1);
    }
  }

  if ((0, _fs.isEmptyOrMissing)(idFile)) {
    try {
      _fsExtra2.default.writeJSONSync(idFile, { id: _uuid2.default.v1() });
    } catch (error) {
      _logger2.default.error('Error creating Reaction CLI configs');
      process.exit(1);
    }
  }

  if ((0, _fs.isEmptyOrMissing)(globalConfigFile)) {
    try {
      _fsExtra2.default.writeJSONSync(globalConfigFile, defaults.global);
    } catch (error) {
      _logger2.default.error('Error creating Reaction config file: ' + _logger2.default.magenta(globalConfigFile));
    }
  }

  return true;
}

/**
 * Create an app-level Reaction config if it doesn't exist
 * @return {Boolean} returns true if successful
 */
function initLocalConfig() {
  if (!(0, _fs.exists)(localConfigDir)) {
    try {
      _fsExtra2.default.mkdirsSync(localConfigDir);
    } catch (error) {
      _logger2.default.error('Error creating Reaction CLI config directory');
      process.exit(1);
    }
  }
  if ((0, _fs.isEmptyOrMissing)(localConfigFile)) {
    try {
      _fsExtra2.default.writeJSONSync(localConfigFile, defaults.local);
    } catch (error) {
      _logger2.default.error('Error creating Reaction config file: ' + _logger2.default.magenta(localConfigFile));
      process.exit(1);
    }
  }
  return true;
}

/**
 * Get a user ID
 * @return {String} user ID
 */
function getUserId() {
  if ((0, _fs.isEmptyOrMissing)(idFile)) {
    try {
      _fsExtra2.default.writeJSONSync(idFile, { id: _uuid2.default.v1() });
    } catch (error) {
      _logger2.default.error('Error creating Reaction CLI configs');
      process.exit(1);
    }
  }
  try {
    return _fsExtra2.default.readJSONSync(idFile).id;
  } catch (error) {
    _logger2.default.error('Error reading Reaction config file: ' + _logger2.default.magenta(config));
    process.exit(1);
  }
}

/**
 * Get a Reaction config
 * @param  {String} type - specify global or local config
 * @param  {String} setting - a '.' delimited string representing the settings obj path
 * @param  {Any} defaultValue - a value to return if one is not found in the config
 * @return {Any} returns the value if found, else undefined
 */
function get(type, setting, defaultValue) {

  if (type !== 'global' && type !== 'local' && type !== 'cli' && type !== 'id') {
    _logger2.default.error('\nMust specify "global", "local", "cli", or "id" config to retrieve');
    process.exit(1);
  }

  if (typeof setting !== 'string') {
    _logger2.default.error('\nMust specify a String value for the config setting to get');
    process.exit(1);
  }

  var config = void 0;

  if (type === 'local') {
    config = localConfigFile;
    (0, _check_app2.default)();
  } else if (type === 'global') {
    config = globalConfigFile;
  } else if (type === 'cli') {
    config = cliConfigFile;
  } else if (type === 'id') {
    config = idFile;
  }

  var value = void 0;
  try {
    value = (0, _get3.default)(_fsExtra2.default.readJSONSync(config), setting);
  } catch (error) {
    _logger2.default.error('Error reading Reaction config file: ' + _logger2.default.magenta(config));
    process.exit(1);
  }

  return value || defaultValue;
}

/**
 * Set a Reaction config
 * @param  {String} type - specify global or local config
 * @param  {String} setting - a '.' delimited string representing the settings obj path
 * @param  {Any}    value - the value to set
 * @return {Object} returns JSON content from the updated config
 */
function set(type, setting, value) {
  if (type !== 'global' && type !== 'local' && type !== 'id') {
    _logger2.default.error('Must specify "global", "local" config to retrieve');
    process.exit(1);
  }

  if (typeof value === 'undefined') {
    _logger2.default.error('Must provide a setting value to Config.set()');
    process.exit(1);
  }

  var config = void 0;

  if (type === 'local') {
    config = localConfigFile;
    (0, _check_app2.default)();
    initLocalConfig();
  } else if (type === 'global') {
    config = globalConfigFile;
  } else if (type === 'id') {
    config = idFile;
  }

  var currentVals = void 0;

  try {
    currentVals = _fsExtra2.default.readJSONSync(config);
  } catch (error) {
    _logger2.default.error('Error reading Reaction config file: ' + _logger2.default.magenta(config));
    process.exit(1);
  }

  if ((typeof currentVals === 'undefined' ? 'undefined' : _typeof(currentVals)) !== 'object') {
    currentVals = defaults[type];
  }

  var newVal = value;

  if (value === 'true') {
    newVal = true;
  } else if (value === 'false') {
    newVal = false;
  }

  var newVals = (0, _set3.default)(currentVals, setting, newVal);

  try {
    _fsExtra2.default.writeJSONSync(config, newVals);
  } catch (error) {
    _logger2.default.error('Error writing to config file: ' + _logger2.default.magenta(config));
    process.exit(1);
  }

  return newVals;
}

/**
 * Unset a Reaction config
 * @param  {String} type - specify global or local config
 * @param  {String} setting - a '.' delimited string representing the settings obj path
 * @return {Object} returns JSON content from the updated config
 */
function unset(type, setting) {
  if (type !== 'global' && type !== 'local') {
    _logger2.default.error('Must specify "global" or "local" config to retrieve');
    process.exit(1);
  }

  if (typeof setting === 'undefined') {
    _logger2.default.error('Must provide a setting value to Config.unset()');
    process.exit(1);
  }

  var config = void 0;

  if (type === 'local') {
    config = localConfigFile;
    (0, _check_app2.default)();
    initLocalConfig();
  } else {
    config = globalConfigFile;
  }

  var values = void 0;

  try {
    values = _fsExtra2.default.readJSONSync(config);
  } catch (error) {
    _logger2.default.error('Error reading Reaction config file: ' + _logger2.default.magenta(config));
    process.exit(1);
  }

  if ((typeof values === 'undefined' ? 'undefined' : _typeof(values)) !== 'object') {
    values = defaults[type];
  }

  (0, _unset3.default)(values, setting);

  try {
    _fsExtra2.default.writeJSONSync(config, values);
  } catch (error) {
    _logger2.default.error('Error writing to config file: ' + _logger2.default.magenta(config));
    process.exit(1);
  }

  return true;
}

/**
 * Reset a Reaction config
 * @param  {String} type - local or global [default]
 * @return {Boolean} returns true if successful
 */
function reset(type) {
  if (type !== 'global' && type !== 'local') {
    _logger2.default.error('Must specify "global" or "local" for config file reset');
    process.exit(1);
  }

  var config = void 0;
  var defaultsValues = void 0;

  if (type === 'local') {
    config = localConfigFile;
    defaultsValues = defaults.local;
    (0, _check_app2.default)();
  } else {
    config = globalConfigFile;
    defaultsValues = defaults.global;
  }

  try {
    _fsExtra2.default.writeJSONSync(config, defaultsValues);
  } catch (error) {
    _logger2.default.error('Error resetting Reaction config file at: ' + _logger2.default.magenta(config));
    process.exit(1);
  }

  return true;
}