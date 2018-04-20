'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var checks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var callback = arguments[1];

  if ((0, _includes2.default)(checks, 'git')) {
    var gitIsInstalled = !!(0, _shelljs.which)('git');

    if (!gitIsInstalled) {
      _logger2.default.warn(gitWarning);
      process.exit(1);
    }
    if (checks.length === 1) {
      callback();
    }
  }

  if ((0, _includes2.default)(checks, 'app')) {
    (0, _check_app2.default)();
    if (checks.length === 1) {
      callback();
    }
  }

  if ((0, _includes2.default)(checks, 'meteor')) {
    (0, _check_meteor2.default)(callback);
  }
};

var _shelljs = require('shelljs');

var _includes = require('lodash/includes');

var _includes2 = _interopRequireDefault(_includes);

var _check_app = require('./check_app');

var _check_app2 = _interopRequireDefault(_check_app);

var _check_meteor = require('./check_meteor');

var _check_meteor2 = _interopRequireDefault(_check_meteor);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gitWarning = '\nOops! It looks like you don\'t have Git installed yet!\n\nPlease see the Reaction requirements docs first,\nthen try running this command again once you have\ninstalled all of the requirements for your operating system.\n\nMore info...\nhttp://getrxn.io/2installRC\n';