import fs from 'fs';
import { exec } from 'shelljs';

export default function () {
  let versions = {};

  // get Node version
  versions.node = process.version.substring(1);

  // get NPM version
  versions.npm = exec('npm -v', { silent: true }).stdout.replace(/\r?\n|\r/g, '');

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
