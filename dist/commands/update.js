'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = update;

var _shelljs = require('shelljs');

var _utils = require('../utils');

function update(yargs) {
  _utils.Log.args(yargs.argv);

  _utils.Log.info('\nUpdating Meteor and Atmosphere packages...');
  (0, _shelljs.exec)('meteor update');

  _utils.Log.info('\nUpdating Node modules...');
  (0, _utils.upgradeModules)();

  _utils.Log.success('Done!');
}