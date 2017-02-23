import { Config, GraphQL, Log } from '../../utils';

export default async function deleteKey(publicKeyId) {
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

  return updatedKeys.data.sshKeys;
}
