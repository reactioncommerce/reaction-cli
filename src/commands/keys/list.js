import { Config, GraphQL, Log } from '../../utils';

export default async function listKeys() {
  const gql = new GraphQL();

  const result = await gql.fetch(`
    query {
      sshKeys {
        _id
        title
        key
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
    Config.unset('global', 'launchdock.keys');
  } else {
    Config.set('global', 'launchdock.keys', result.data.sshKeys);
  }

  return result.data.sshKeys;
}
