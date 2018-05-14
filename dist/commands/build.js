'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;

var _shelljs = require('shelljs');

var _utils = require('../utils');

function build(yargs) {
  _utils.Log.args(yargs.argv);

  var commands = yargs.argv._;

  var dockerIsInstalled = !!(0, _shelljs.which)('docker');

  if (!dockerIsInstalled) {
    _utils.Log.warn('\nOops! You don\'t have Docker installed yet!\n\nPlease install Docker first, then try running this command again.\n\nFor more info about how to install on your operating system...\nhttps://docs.docker.com/engine/installation/\n    ');
    process.exit(1);
  }

  if (!commands[1]) {
    _utils.Log.error('\nOops! A Docker image name is required.\n');
    _utils.Log.error('Try running:\n');
    _utils.Log.warn(_utils.Log.yellow(' reaction build <imageName>\n'));
    process.exit(1);
  }

  _utils.Log.info('\nSetting up plugin imports...\n');
  (0, _utils.loadPlugins)();

  _utils.Log.info('\nSetting up style imports...\n');
  (0, _utils.loadStyles)();

  _utils.Log.info('Starting Docker build...\n');
  if ((0, _shelljs.exec)('docker build -t ' + commands[1] + ' .').code !== 0) {
    _utils.Log.error('\nError: Docker build failed. Exiting.');
    process.exit(1);
  }
}