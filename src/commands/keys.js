import fs from 'fs';
import { Config, GraphQL, Log, exists } from '../utils';

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

    if (!exists(subCommands[2])) {
      return Log.error(`Public key not found at ${subCommands[2]}`);
    }

    const publicKeyPath = subCommands[2];

    let publicKey;
    try {
      publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    } catch (e) {
      return Log.error('Error reading public key');
    }

    const gql = new GraphQL();

    const res = await gql.fetch(`
      mutation createKey($id: ID! $publicKey: String! ) {
        createKey(id: $id, publicKey: $publicKey) {
          id
        }
      }
    `, { id: publicKeyPath.replace(/^.*?([^\\\/]*)$/, '$1'), publicKey });

    if (!!res.errors) {
      res.errors.forEach((err) => {
        Log.error(err.message);
      });
      process.exit(1);
    }

    const updatedKeys = await gql.fetch(`
      query {
        sshKeys {
          id
          publicKey
      		fingerprint
        }
      }
    `);

    if (!!updatedKeys.errors) {
      updatedKeys.errors.forEach((err) => {
        Log.error(err.message);
      });
      process.exit(1);
    }

    if (updatedKeys.data.sshKeys.length === 0) {
      Log.info('\nNo SSH keys found.\n');
      Log.info(`Run ${Log.magenta('reaction keys add /path/to/key.pub')} to upload one.\n`);
      return Config.unset('global', 'launchdock.keys');
    }

    Config.set('global', 'launchdock.keys', updatedKeys.data.sshKeys);
  }


  // list
  if (subCommands[1] === 'list') {

    const gql = new GraphQL();

    const result = await gql.fetch(`
      query {
        sshKeys {
          id
          publicKey
      		fingerprint
        }
      }
    `);

    if (!!result.errors) {
      result.errors.forEach((err) => {
        Log.error(err.message);
      });
      process.exit(1);
    }

    if (result.data.sshKeys.length === 0) {
      Log.info('\nNo SSH keys found.\n');
      Log.info(`Run ${Log.magenta('reaction keys add /path/to/key.pub')} to upload one.\n`);
      return Config.unset('global', 'launchdock.keys');
    }

    result.data.sshKeys.forEach((k) => Log.info(k.id));

    Config.set('global', 'launchdock.keys', result.data.sshKeys);
  }


  // delete
  if (subCommands[1] === 'delete') {
    if (!subCommands[2]) {
      return Log.error('Public key name required');
    }

    const publicKeyId = subCommands[2];

    const gql = new GraphQL();

    const res = await gql.fetch(`
      mutation deleteKey($id: ID!) {
        deleteKey(id: $id) {
          success
        }
      }
    `, { id: publicKeyId });

    if (!!res.errors) {
      res.errors.forEach((err) => {
        Log.error(err.message);
      });
      process.exit(1);
    }

    const updatedKeys = await gql.fetch(`
      query {
        sshKeys {
          id
          publicKey
          fingerprint
        }
      }
    `);

    if (!!updatedKeys.errors) {
      updatedKeys.errors.forEach((err) => {
        Log.error(err.message);
      });
      process.exit(1);
    }

    if (updatedKeys.data.sshKeys.length === 0) {
      return Config.unset('global', 'launchdock.keys');
    }

    Config.set('global', 'launchdock.keys', updatedKeys.data.sshKeys);
  }
}
