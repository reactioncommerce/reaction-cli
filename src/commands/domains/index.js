import { Log } from '../../utils';
import domainSet from './set';
import domainUnset from './unset';

const helpMessage = `
Usage:

  reaction domains [command] <options>

    Commands:
      set       Set the custom domain name for an app deployment
      unset     Remove the custom domain name for an app deployment

    Options:
      --app, -a      The name of the app to update [Required]
      --domain, -d   The domain name to add to your app (example.com) [Required]
`;

export async function domains(yargs) {
  Log.args(yargs.argv);

  const subCommands = yargs.argv._;

  if (!subCommands[1]) {
    return Log.default(helpMessage);
  }

  const { app, domain } = yargs.argv;

  if (!app) {
    Log.default(helpMessage);
    process.exit(1);
  }

  // add
  if (subCommands[1] === 'set') {
    if (!domain) {
      Log.default(helpMessage);
      process.exit(1);
    }
    return domainSet({ name: app, domain });
  }

  // delete
  if (subCommands[1] === 'unset') {
    return domainUnset({ name: app });
  }
}
