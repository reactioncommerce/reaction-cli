import _ from 'lodash';
import { Config, GraphQL, Log } from '../../utils';
import listApps from './list';

export default async function deleteKey({ appName }) {
  const apps = Config.get('global', 'launchdock.apps');

  if (!apps) {
    return Log.error('\nApp deployment not found');
  }

  const app = _.find(apps, (a) => a.name === appName);

  if (!app) {
    return Log.error('\nApp deployment not found');
  }

  const gql = new GraphQL();

  const res = await gql.fetch(`
    mutation deleteApp($_id: ID!) {
      deleteKey(_id: $_id) {
        success
      }
    }
  `, { _id: app._id });

  if (!!res.errors) {
    res.errors.forEach((err) => {
      Log.error(err.message);
    });
    process.exit(1);
  }

  return listApps();
}
