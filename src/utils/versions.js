import fs from 'fs';
import os from 'os';
import { exec } from 'shelljs';


export default function () {
  const versions = {};

  const osType = os.platform();

  if (osType === 'darwin') {
    const release = exec('sw_vers -productVersion', { silent: true }).stdout;
    versions.os = 'macOS';
    versions.osVersion = release.replace(/\r?\n|\r/g, '');
  } else if (osType === 'win32') {
    versions.os = 'Windows';
    versions.osVersion = os.release();
  } else {
    versions.os = osType;
    versions.osVersion = os.release();
  }

  // get Node version
  versions.node = process.version.substring(1);

  // get NPM version
  versions.npm = exec('npm -v', { silent: true }).stdout.replace(/\r?\n|\r/g, '');

  // get Meteor's Node version
  versions.meteorNode = exec('meteor node -v', { silent: true }).stdout.replace(/\r?\n|\r|v/g, '');

  // get Meteor's NPM version
  versions.meteorNpm = exec('meteor npm -v', { silent: true }).stdout.replace(/\r?\n|\r/g, '');

  // get Docker version
  const dockerVer = exec('docker -v', { silent: true }).stdout.replace(/Docker version /g, '');
  versions.docker = dockerVer ? dockerVer.substring(0, dockerVer.indexOf(',')) : null;

  // get Reaction git branch name
  const reactionBranch = exec('git rev-parse --abbrev-ref HEAD', { silent: true }).stdout.replace(/\r?\n|\r/g, '');
  versions.reactionBranch = reactionBranch.indexOf('fatal') === -1 ? reactionBranch : null;

  // get reaction-cli version
  versions.cli = require('../../package.json').version;

  // get Reaction version (if in a Reaction directory)
  try {
    const packageFile = fs.readFileSync('./package.json', 'utf8');

    const f = JSON.parse(packageFile);

    if (f.name === 'reaction') {
      versions.reaction = f.version;
    }
  } catch(e) {
    versions.reaction = null;
  }

  return versions;
}
