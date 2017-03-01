import _ from 'lodash';
import { Config, GraphQL, Log } from '../../utils';

export default async function appDelete({ name }) {
  const apps = Config.get('global', 'launchdock.apps', []);
  const app = _.filter(apps, (a) => a.name === name)[0];

  if (!app) {
    return Log.error('\nApp deployment not found');
  }

  const gql = new GraphQL();

  const res = await gql.fetch(`
    mutation appDelete($_id: ID!) {
      appDelete(_id: $_id) {
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

  Config.set('global', 'launchdock.apps', _.reject(apps, (a) => a.name === name));
}
