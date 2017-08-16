import { Log } from '../../utils';
import listKeys from './list';
import keyCreate from './add';
import keyDelete from './delete';

const helpMessage = `
Usage:

  reaction keys [command]

    Commands:
      add       Add an SSH public key for deploying to Launchdock
      list      Show your existing SSH keys
      delete    Remove an existing SSH public key from Launchdock
`;

export async function keys(yargs) {
  Log.args(yargs.argv);

  const subCommands = yargs.argv._;

  if (!subCommands[1]) {
    return Log.default(helpMessage);
  }


  // add
  if (subCommands[1] === 'add') {
    if (!subCommands[2]) {
      return Log.error('Public key path required');
    }

    const publicKeyPath = subCommands[2];

    return keyCreate(publicKeyPath);
  }


  // list
  if (subCommands[1] === 'list') {
    const sshKeys = await listKeys();

    if (sshKeys.length === 0) {
      Log.info('\nNo SSH keys found.\n');
      Log.info(`Run ${Log.magenta('reaction keys add /path/to/key.pub')} to upload one.\n`);
      process.exit(0);
    }

    sshKeys.forEach((k) => Log.info(k.title));
  }


  // delete
  if (subCommands[1] === 'delete') {
    if (!subCommands[2]) {
      return Log.error('Public key name required');
    }

    const publicKeyTitle = subCommands[2];

    return keyDelete(publicKeyTitle);
  }
}
