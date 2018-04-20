'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pull = pull;

var _shelljs = require('shelljs');

var _utils = require('../utils');

function pull(yargs) {
  _utils.Log.args(yargs.argv);

  _utils.Log.info('\nPulling the latest updates from Github...');
  (0, _shelljs.exec)('git pull');

  _utils.Log.info('\nInstalling Node modules...');
  (0, _utils.installModules)();

  _utils.Log.success('Done!');
}