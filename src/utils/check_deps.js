import { sync as cmdExists } from 'command-exists';
import checkIfInReactionDir from './check_app';
import checkMeteor from './check_meteor';
import * as Config from './config';
import Log from './logger';


const gitWarning = `
Oops! It looks like you don\'t have Git installed yet!

Please see the Reaction requirements docs first,
then try running this command again once you have
installed all of the requirements for your operating system.

More info...
http://getrxn.io/2installRC
`;

const platformWarning = `
This command requires being logged into the managed platform.

If you have an account, please log in and try this command again.
If you you don't have an account, please see the link below to learn more.

${Log.magenta('http://getrxn.io/reaction-platform')}
`;

export default function (checks = [], callback) {
  if (checks.includes('git')) {
    if (!cmdExists('git')) {
      Log.warn(gitWarning);
      process.exit(1);
    }
    if (checks.length === 1) {
      callback();
    }
  }

  if (checks.includes('app')) {
    checkIfInReactionDir();
    if (checks.length === 1) {
      callback();
    }
  }

  if (checks.includes('meteor')) {
    checkMeteor(callback);
  }

  if (checks.includes('platform')) {
    if (!Config.get('global', 'launchdock.username')) {
      Log.info(platformWarning);
      process.exit(1);
    }
    callback();
  }
}
