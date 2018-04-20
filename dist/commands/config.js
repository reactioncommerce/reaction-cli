'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

exports.config = config;

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helpMessage = '\nUsage:\n\n  reaction config [command] [options]\n\n    Commands:\n      set       Set a local or global reaction-cli config file value\n      reset     Reset a local or global reaction-cli config file to default values\n\n    Options:\n      --local   Local reaction-cli config if in an app directory [Default]\n      --global  Global reaction-cli config\n';

function showHelp() {
  _utils.Log.default(helpMessage);
}

function config(yargs) {
  _utils.Log.args(yargs.argv);

  var subCommands = yargs.argv._;
  var args = (0, _omit3.default)(yargs.argv, ['_', '$0']);
  var type = args.global ? 'global' : 'local';

  if (subCommands[1] === 'set' && !!subCommands[2] && !!subCommands[3]) {
    _utils.Config.set(type, subCommands[2], subCommands[3]);
    _utils.Log.success('Success!\n');
  } else if (subCommands[1] === 'get' && !!subCommands[2]) {
    _utils.Log.info('Getting ' + type + ' config...\n');
    var conf = _utils.Config.get(type, subCommands[2]);
    _utils.Log.default(conf);
  } else if (subCommands[1] === 'unset' && !!subCommands[2]) {
    _utils.Log.info('Unsetting ' + type + ' config...\n');
    _utils.Config.unset(type, subCommands[2]);
    _utils.Log.success('Success!\n');
  } else if (subCommands[1] === 'reset') {
    _utils.Log.info('Resetting ' + type + ' Reaction CLI config...');
    _utils.Config.reset(type);
    _utils.Log.success('Success!\n');
  } else {
    showHelp();
  }
}