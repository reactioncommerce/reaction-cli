import { Log } from '../../utils';
import domainAdd from './add';
import domainDelete from './delete';

const helpMessage = `
Usage:

  reaction domains [command] <options>

    Commands:
      add       Add a new custom domain for an app deployment
      delete    Remove a custom domain for an app deployment

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

  if (!app || !domain) {
    return Log.default(helpMessage);
  }

  // add
  if (subCommands[1] === 'add') {
    return domainAdd({ name: app, domain });
  }

  // delete
  if (subCommands[1] === 'delete') {
    return domainDelete({ name: app, domain });
  }
}
