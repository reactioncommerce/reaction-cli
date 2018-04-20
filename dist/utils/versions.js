'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var versions = {};

  var osType = _os2.default.platform();

  if (osType === 'darwin') {
    var release = (0, _shelljs.exec)('sw_vers -productVersion', { silent: true }).stdout;
    versions.os = 'macOS';
    versions.osVersion = release.replace(/\r?\n|\r/g, '');
  } else if (osType === 'win32') {
    versions.os = 'Windows';
    versions.osVersion = _os2.default.release();
  } else {
    versions.os = osType;
    versions.osVersion = _os2.default.release();
  }

  // get Node version
  versions.node = process.version.substring(1);

  // get NPM version
  versions.npm = (0, _shelljs.exec)('npm -v', { silent: true }).stdout.replace(/\r?\n|\r/g, '');

  // get Meteor's Node version
  versions.meteorNode = (0, _shelljs.exec)('meteor node -v', { silent: true }).stdout.replace(/\r?\n|\r|v/g, '');

  // get Meteor's NPM version
  versions.meteorNpm = (0, _shelljs.exec)('meteor npm -v', { silent: true }).stdout.replace(/\r?\n|\r/g, '');

  // get Docker version
  var dockerVer = (0, _shelljs.exec)('docker -v', { silent: true }).stdout.replace(/Docker version /g, '');
  versions.docker = dockerVer ? dockerVer.substring(0, dockerVer.indexOf(',')) : null;

  // get Reaction git branch name
  var reactionBranch = (0, _shelljs.exec)('git rev-parse --abbrev-ref HEAD', { silent: true }).stdout.replace(/\r?\n|\r/g, '');
  versions.reactionBranch = reactionBranch.indexOf('fatal') === -1 ? reactionBranch : null;

  // get reaction-cli version
  versions.cli = require('../../package.json').version;

  // get Reaction version (if in a Reaction directory)
  try {
    var packageFile = _fs2.default.readFileSync('./package.json', 'utf8');

    var f = JSON.parse(packageFile);

    if (f.name === 'reaction') {
      versions.reaction = f.version;
    }
  } catch (e) {
    versions.reaction = null;
  }

  return versions;
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _shelljs = require('shelljs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }