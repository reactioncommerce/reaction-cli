import fs from 'fs';
import uuid from 'uuid';
import { GraphQL, Log, exists } from '../utils';

const helpMessage = `
Usage:

  reaction keys [command]

    Commands:
      add       Add an SSH public key for deploying to Launchdock
      list      Show your existing SSH keys
`;

export function keys(yargs) {
  Log.args(yargs.argv);

  const subCommands = yargs.argv._;

  if (!subCommands[1]) {
    return Log.default(helpMessage);
  }

  if (subCommands[1] === 'add') {
    if (!subCommands[2]) {
      return Log.error('Public key path required');
    }

    if (!exists(subCommands[2])) {
      return Log.error(`Public key not found at ${subCommands[2]}`);
    }

    const publicKeyPath = subCommands[2];

    let publicKey;
    try {
      publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    } catch (e) {
      return Log.error('Error reading pucli key');
    }

    const gql = new GraphQL();

    return gql.fetch(`
      mutation createKey($id: ID! $publicKey: String! ) {
        createKey(id: $id, publicKey: $publicKey) {
          id
          fingerprint
          owner
          uuid
        }
      }
    `, { id: uuid.v1(), publicKey });
  }
}
