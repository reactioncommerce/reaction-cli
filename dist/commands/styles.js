'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = styles;

var _utils = require('../utils');

function styles(yargs) {
  _utils.Log.args(yargs.argv);

  var commands = yargs.argv._;

  if (!commands[1]) {
    _utils.Log.error('\nOops! A subcommand is required.\n');
    _utils.Log.error('To load styles, try running:\n');
    _utils.Log.warn(_utils.Log.yellow(' reaction styles load\n'));
    process.exit(1);
  }

  if (commands[1] === 'load') {
    _utils.Log.info('\nSetting up style imports...\n');
    (0, _utils.loadStyles)();
    return _utils.Log.success('Done!\n');
  }
}