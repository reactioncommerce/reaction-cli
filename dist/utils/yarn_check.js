'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasYarn = hasYarn;
exports.hasNpm = hasNpm;
exports.yarnOrNpm = yarnOrNpm;
exports.checkYarn = checkYarn;

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _shelljs = require('shelljs');

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hasYarn() {
  return (/[0-9]+(\.[0-9]+)*/.test((0, _shelljs.exec)('meteor yarn version', { silent: true }).stdout.replace(/\r?\n|\r/g, ''))
  );
}

function hasNpm() {
  return !hasYarn();
}

function yarnOrNpm() {
  return _.Config.get('global', 'yarn') ? 'yarn' : 'npm';
}

function checkYarn(callback) {
  if (_.Config.get('global', 'yarn') === undefined && hasYarn()) {
    _inquirer2.default.prompt([{
      type: 'confirm',
      name: 'useYarn',
      message: '\nIt looks like you have Yarn installed.\nWould you like to use it instead of npm?',
      default: false
    }]).then(function (_ref) {
      var useYarn = _ref.useYarn;

      _.Config.set('global', 'yarn', useYarn);
      callback();
    });
  } else {
    callback();
  }
}