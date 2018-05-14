'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugins = plugins;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _shelljs = require('shelljs');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helpMessage = '\nUsage:\n\n  reaction plugins [command]\n\n    Commands:\n      create   Create a new plugin in /imports/plugins/custom\n      load     Set up the imports of your internal Reaction plugins\n';

function plugins(yargs) {
  _utils.Log.args(yargs.argv);

  var commands = yargs.argv._;

  if (!commands[1]) {
    _utils.Log.error('\nOops! A subcommand is required.\n');
    _utils.Log.error('To load plugins, try running:\n');
    _utils.Log.warn(_utils.Log.yellow(' reaction plugins load\n'));
    process.exit(1);
  }

  if (commands[1] === 'load') {
    _utils.Log.info('\nSetting up plugin imports...');
    (0, _utils.loadPlugins)();
    _utils.Log.info('\nSetting up style imports...\n');
    (0, _utils.loadStyles)();
    return _utils.Log.success('Done!\n');
  }

  if (commands[1] === 'create') {
    var name = yargs.argv.name;


    if (!name) {
      _utils.Log.error('\nA name argument is required. Use the --name flag to choose your plugin name.\n');
      process.exit(1);
    }

    var pluginPath = './imports/plugins/custom/' + name;

    if ((0, _utils.exists)(pluginPath)) {
      _utils.Log.error('\nError: A plugin already exists at ' + _utils.Log.yellow('/imports/plugins/custom/' + name) + ' \n\nExiting.');
      process.exit(1);
    }

    var clientImport = _path2.default.resolve(pluginPath + '/client/index.js');
    var serverImport = _path2.default.resolve(pluginPath + '/server/index.js');
    var registryImport = _path2.default.resolve(pluginPath + '/register.js');
    var packageDotJson = _path2.default.resolve(pluginPath + '/package.json');

    try {
      _fsExtra2.default.ensureFileSync(clientImport, '');
      _fsExtra2.default.ensureFileSync(serverImport, '');
      _fsExtra2.default.ensureFileSync(registryImport, '');
    } catch (e) {
      _utils.Log.error('Failed to create plugin at ' + pluginPath);
      process.exit(1);
    }

    var _exec = (0, _shelljs.exec)('cd ' + pluginPath + ' && npm init -y', { silent: true }),
        code = _exec.code;

    if (code !== 0) {
      _utils.Log.error('Failed to create a package.json at ' + packageDotJson);
      process.exit(1);
    }

    _utils.Log.success('\nSuccess!\n');

    return _utils.Log.info('New plugin created at: ' + _utils.Log.magenta('/imports/plugins/custom/' + name) + '\n');
  }

  _utils.Log.error('\nInvalid subcommand');
  _utils.Log.default(helpMessage);
}