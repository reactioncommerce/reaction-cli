import { Config, GraphQL, Log } from '../../utils';

export default async function listKeys() {
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

  return result.data.sshKeys;
}
