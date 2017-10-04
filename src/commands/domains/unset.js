import _ from 'lodash';
import appsList from '../apps/list';
import { Config, GraphQL, Log } from '../../utils';


export default async function domainUnset({ name }) {

  const apps = Config.get('global', 'launchdock.apps', []);
  const app = _.filter(apps, (a) => a.name === name)[0];

  if (!app) {
    return Log.error('\nApp deployment not found');
  }

  const gql = new GraphQL();

  const result = await gql.fetch(`
    mutation domainUnset($appId: ID!) {
      domainUnset(appId: $appId) {
        name
      }
    }
  `, { appId: app._id });

  if (!!result.errors) {
    result.errors.forEach((err) => {
      Log.error(err.message);
    });
    process.exit(1);
  }

  Log.info(`\nRemoved the custom domain name from app ${Log.magenta(result.data.domainUnset.name)}\n`);

  await appsList();

  return result.data.domainUnset;
}
