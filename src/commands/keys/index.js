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
    return listKeys();
  }


  // delete
  if (subCommands[1] === 'delete') {
    if (!subCommands[2]) {
      return Log.error('Public key name required');
    }

    const publicKeyId = subCommands[2];

    return keyDelete(publicKeyId);
  }
}
