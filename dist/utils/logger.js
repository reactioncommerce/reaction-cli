'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */

var loggers = {
  info: function info(msg) {
    console.log(_chalk2.default.blue('' + msg));
  },
  success: function success(msg) {
    console.log(_chalk2.default.green('' + msg));
  },
  warn: function warn(msg) {
    console.log(_chalk2.default.yellow('' + msg));
  },
  error: function error(msg) {
    console.log(_chalk2.default.bold.red('' + msg));
  },
  debug: function debug(msg) {
    if (process.env.REACTION_CLI_DEBUG === 'true') {
      console.log(_chalk2.default.yellow('[DEBUG]:'), msg);
    }
  },
  args: function args(_args) {
    if (process.env.REACTION_CLI_DEBUG === 'true') {
      console.log(_chalk2.default.yellow('\n[Create-reaction-app CLI Debug]\n\n'), _args, '\n');
    }
  },
  default: function _default(msg) {
    console.log(msg);
  }
};

// extend chalk with custom log methods
exports.default = Object.assign(_chalk2.default, loggers);