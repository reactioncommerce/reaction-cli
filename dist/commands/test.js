'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _forEach2 = require('lodash/forEach');

var _forEach3 = _interopRequireDefault(_forEach2);

var _pickBy2 = require('lodash/pickBy');

var _pickBy3 = _interopRequireDefault(_pickBy2);

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

exports.test = test;

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _shelljs = require('shelljs');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function test(yargs) {
  _utils.Log.args(yargs.argv);

  var args = (0, _omit3.default)(yargs.argv, ['_', '$0']);

  _utils.Log.info('Setting up plugin imports...\n');
  (0, _utils.loadPlugins)();

  _utils.Log.info('Setting up style imports...\n');
  (0, _utils.loadStyles)();

  var cmd = 'meteor test';

  var subCommands = yargs.argv._;
  var testArgs = (0, _pickBy3.default)((0, _omit3.default)(args, '$0'), function (val) {
    return val !== false;
  });
  var hasArgs = Object.keys(testArgs).length > 0;
  var onlyHasPort = Object.keys(testArgs).length === 1 && !!testArgs.p || !!testArgs.port;

  if (hasArgs && !onlyHasPort) {
    (0, _forEach3.default)(testArgs, function (val, key) {
      var dash = key.length > 1 ? '--' : '-';
      cmd += ' ' + (dash + key) + ' ' + val;
    });
    _utils.Log.info('Running custom test command:');
  } else {
    if (_os2.default.platform() !== 'win32') {
      cmd = 'SERVER_TEST_REPORTER="dot" ' + cmd;
    }
    if (subCommands[1] === 'unit') {
      cmd += ' --once --headless --driver-package dispatch:mocha';
      _utils.Log.info('Running unit tests command:');
    } else {
      cmd += ' --once --full-app --headless --driver-package dispatch:mocha';
      _utils.Log.info('Running full-app test command:');
    }
    if (onlyHasPort) {
      var port = testArgs.port || testArgs.p;
      cmd += ' --port ' + port.toString();
    }
  }

  _utils.Log.info(_chalk2.default.green(' ' + cmd + '\n'));

  if ((0, _shelljs.exec)(cmd).code !== 0) {
    _utils.Log.error('Tests failed.');
    process.exit(1);
  }
}