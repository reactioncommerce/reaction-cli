import { Config, Log } from '../utils';

const helpMessage = `
Usage:

  reaction logout
`;

export function logout(yargs) {
  Log.args(yargs.argv);

  const args = yargs.argv;

  if (args.help) {
    return Log.default(helpMessage);
  }

  Config.unset('global', 'launchdock');

  Log.success('Successfully logged out.');
}
