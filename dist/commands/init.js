'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;

var _shelljs = require('shelljs');

var _utils = require('../utils');

function init(argv) {
  _utils.Log.args(argv);

  var repoUrl = 'https://github.com/reactioncommerce/reaction';
  var dirName = argv._[1] || 'reaction';
  var branch = argv.branch;

  if ((0, _utils.exists)(dirName)) {
    _utils.Log.warn('\nDirectory \'' + dirName + '\' already exists.');
    _utils.Log.warn('Use \'reaction init somename\' to install in a different directory.\n');
    process.exit(1);
  }

  _utils.Log.info('\nCloning the ' + branch + ' branch of Reaction from Github...');

  if ((0, _shelljs.exec)('git clone -b ' + branch + ' ' + repoUrl + ' ' + dirName).code !== 0) {
    _utils.Log.error('\nError: Unable to clone from Github. Exiting.');
    process.exit(1);
  }

  _utils.Log.info('\nInstalling NPM packages...');
  (0, _utils.initInstallModules)(dirName);

  _utils.Log.success('\nReaction successfully installed!');

  var blue = _utils.Log.blue;


  _utils.Log.info('\nTo start your Reaction instance, just run: \n');
  _utils.Log.info(blue.bold(' cd ' + dirName));
  _utils.Log.info(blue.bold(' reaction\n'));
}