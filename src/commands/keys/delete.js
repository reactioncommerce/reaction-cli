import _ from 'lodash';
import { Config, GraphQL, Log } from '../../utils';

export default async function keyDelete(publicKeyTitle) {
  const keys = Config.get('global', 'launchdock.keys', []);
  const key = _.filter(keys, (k) => k.title === publicKeyTitle)[0];

  if (!key) {
    return Log.error('\nKey not found');
  }

  const gql = new GraphQL();

  const res = await gql.fetch(`
    mutation keyDelete($_id: ID!) {
      keyDelete(_id: $_id) {
        success
      }
    }
  `, { _id: key._id });

  if (!!res.errors) {
    res.errors.forEach((err) => {
      Log.error(err.message);
    });
    process.exit(1);
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
    return Config.unset('global', 'launchdock.keys');
  }

  Config.set('global', 'launchdock.keys', updatedKeys.data.sshKeys);

  Log.success('Success!');

  return updatedKeys.data.sshKeys;
}
