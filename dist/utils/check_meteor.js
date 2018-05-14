'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (callback) {
  var meteorInstalled = !!(0, _shelljs.which)('meteor');
  var blue = _logger2.default.blue;


  if (!meteorInstalled) {
    _logger2.default.warn('\nOops! You don\'t have Meteor installed yet! \n');

    if (process.platform === 'win32') {
      _logger2.default.warn('\nPlease download and install Meteor from: https://install.meteor.com/windows\n');
      process.exit(1);
    }

    _inquirer2.default.prompt([{
      type: 'confirm',
      name: 'meteor',
      message: 'Would you like to install it now?',
      default: true
    }]).then(function (answers) {
      if (answers.meteor) {
        _logger2.default.info('Installing Meteor...\n');
        (0, _shelljs.exec)('curl https://install.meteor.com/ | sh');
        _logger2.default.success('Meteor successfully installed!');
        callback();
      } else {
        _logger2.default.info('\nOk, try running this command again once you have Meteor installed.');
        _logger2.default.info('Learn more at: ' + blue.bold.underline('http://www.meteor.com') + '\n');
        process.exit(1);
      }
    });
  } else {
    callback();
  }
};

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _shelljs = require('shelljs');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }