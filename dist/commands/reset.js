'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reset = reset;

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _shelljs = require('shelljs');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resetMeteor() {
  _utils.Log.info('\nResetting the database...');

  var _exec = (0, _shelljs.exec)('meteor reset'),
      code = _exec.code;

  if (code !== 0) {
    _utils.Log.error('Database reset failed');
    process.exit(1);
  }

  _utils.Log.success('Done!');
}

function resetNpm() {
  _utils.Log.info('\nDeleting node_modules...');
  (0, _shelljs.rm)('-rf', 'node_modules');
  _utils.Log.info('\nReinstalling node_modules...');
  (0, _utils.installModules)();
  _utils.Log.success('Done!\n');
}

function reset(yargs) {
  _utils.Log.args(yargs.argv);

  var args = yargs.argv;

  if (args.y) {
    resetMeteor();
    resetNpm();
  } else if (args.n) {
    resetMeteor();
  } else {
    _inquirer2.default.prompt([{
      type: 'confirm',
      name: 'reset',
      message: '\nResetting the database! Also delete node_modules?',
      default: false
    }]).then(function (answers) {
      resetMeteor();
      if (answers.reset) {
        resetNpm();
      }
    });
  }
}