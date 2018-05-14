// import _ from 'lodash';
import { Log } from '../../utils';
import forgotPassword from './forgot-password';
import resetPassword from './reset-password';

const helpMessage = `
Usage:

  reaction account [command]

    Commands:
      forgot-password    Request a password reset email to get a password reset token
      reset-password     Reset your password with a password reset token
`;

export function account(yargs) {
  Log.args(yargs.argv);

  const subCommands = yargs.argv._;
  // const args = _.omit(yargs.argv, ['_', '$0']);

  if (!subCommands[1]) {
    return Log.default(helpMessage);
  }

  // forgot-password
  if (subCommands[1] === 'forgot-password') {
    const email = subCommands[2];

    if (!email) {
      Log.error('Error: email required');
      process.exit(1);
    }

    return forgotPassword({ email });
  }

  // reset-password
  if (subCommands[1] === 'reset-password') {
    return resetPassword();
  }
}
