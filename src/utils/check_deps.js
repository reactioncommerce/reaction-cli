import { which } from 'shelljs';
import includes from 'lodash/includes';
import checkIfInReactionDir from './check_app';
import checkMeteor from './check_meteor';
import Log from './logger';


const gitWarning = `
Oops! It looks like you don\'t have Git installed yet!

Please see the Reaction requirements docs first,
then try running this command again once you have
installed all of the requirements for your operating system.

More info...
http://getrxn.io/2installRC
`;


export default function (checks = [], callback) {
  if (includes(checks, 'git')) {
    const gitIsInstalled = !!which('git');

    if (!gitIsInstalled) {
      Log.warn(gitWarning);
      process.exit(1);
    }
    if (checks.length === 1) {
      callback();
    }
  }

  if (includes(checks, 'app')) {
    checkIfInReactionDir();
    if (checks.length === 1) {
      callback();
    }
  }

  if (includes(checks, 'meteor')) {
    checkMeteor(callback);
  }
}
