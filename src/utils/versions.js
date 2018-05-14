import fs from 'fs-extra';
import os from 'os';
import { execSync as exec } from 'child_process';
import { sync as cmdExists } from 'command-exists';

export default function () {
  const versions = {};

  const osType = os.platform();

  if (osType === 'darwin') {
    const release = exec('sw_vers -productVersion').toString().replace(/\r?\n|\r/g, '');
    versions.os = 'macOS';
    versions.osVersion = release;
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
  versions.npm = exec('npm -v').toString().replace(/\r?\n|\r/g, '');

  if (cmdExists('meteor')) {
    // get Meteor's Node version
    versions.meteorNode = exec('meteor node -v').toString().replace(/\r?\n|\r|v/g, '');

    // get Meteor's NPM version
    versions.meteorNpm = exec('meteor npm -v').toString().replace(/\r?\n|\r/g, '');
  }

  // get Docker version
  if (cmdExists('docker')) {
    const dockerVer = exec('docker -v').toString().replace(/Docker version /g, '');
    versions.docker = dockerVer ? dockerVer.substring(0, dockerVer.indexOf(',')) : null;
  }

  // get reaction-cli version
  versions.cli = require('../../package.json').version;

  // get Reaction version (if in a Reaction directory)
  try {
    const packageFile = fs.readJSONSync('./package.json');

    if (packageFile.name === 'reaction') {
      versions.reaction = packageFile.version;

      // get Reaction git branch name
      const reactionBranch = exec('git rev-parse --abbrev-ref HEAD').toString().replace(/\r?\n|\r/g, '');
      versions.reactionBranch = reactionBranch.indexOf('fatal') === -1 ? reactionBranch : null;
    }
  } catch(e) {
    versions.reaction = null;
  }

  // get create-reaction-app version
  try {
    const packageFile = fs.readFileSync('./package.json', 'utf8');

    const f = JSON.parse(packageFile);

    if (f.name === 'create-reaction-app') {
      versions['create-reaction-app'] = f.version;
    }
  } catch(e) {
    versions['create-reaction-app'] = null;
  }


  return versions;
}
