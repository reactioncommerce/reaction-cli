import fs from 'fs';
import { Config, GraphQL, Log, exists } from '../../utils';


export default async function keyCreate({ publicKeyPath, publicKey, title }) {
  let keyFile;

  if (publicKeyPath) {
    if (!exists(publicKeyPath)) {
      Log.error(`Public key not found at ${publicKeyPath}`);
      process.exit(1);
    }

    try {
      keyFile = fs.readFileSync(publicKeyPath, 'utf8');
    } catch (e) {
      Log.error('Error reading public key');
      process.exit(1);
    }
  } else if (!publicKey) {
    Log.error('A public key is required');
    process.exit(1);
  }

  const key = keyFile || publicKey;

  const gql = new GraphQL();

  const result = await gql.fetch(`
    mutation keyCreate($title: String!, $key: String!) {
      keyCreate(title: $title, key: $key) {
        _id
        title
        key
      }
    }
  `, { title, key });

  if (!!result.errors) {
    result.errors.forEach((err) => {
      Log.error(err.message);
    });
    process.exit(1);
  }

  if (publicKeyPath) {
    Log.info(`\nAdded new SSH public key: ${Log.magenta(result.data.keyCreate.title)}\n`);
  }

  const updatedKeys = await gql.fetch(`
    query {
      sshKeys {
        _id
        title
        key
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

  return updatedKeys.data.sshKeys;
}
