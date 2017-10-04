import _ from 'lodash';
import appsList from '../apps/list';
import { Config, GraphQL, Log } from '../../utils';


export default async function domainSet({ name, domain }) {

  const apps = Config.get('global', 'launchdock.apps', []);
  const app = _.filter(apps, (a) => a.name === name)[0];

  if (!app) {
    return Log.error('\nApp deployment not found');
  }

  const gql = new GraphQL();

  const result = await gql.fetch(`
    mutation domainSet($appId: ID! $domain: String!) {
      domainSet(appId: $appId, domain: $domain) {
        name
        domain
      }
    }
  `, { appId: app._id, domain });

  if (!!result.errors) {
    result.errors.forEach((err) => {
      Log.error(err.message);
    });
    process.exit(1);
  }

  Log.info(`\nAdded new domain ${Log.magenta(domain)} to app ${Log.magenta(name)}\n`);

  await appsList();

  return result.data.domainSet;
}
