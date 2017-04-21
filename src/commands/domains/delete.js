import _ from 'lodash';
import appsList from '../apps/list';
import { Config, GraphQL, Log } from '../../utils';


export default async function domainRemove({ name, domain }) {

  const apps = Config.get('global', 'launchdock.apps', []);
  const app = _.filter(apps, (a) => a.name === name)[0];

  if (!app) {
    return Log.error('\nApp deployment not found');
  }

  const gql = new GraphQL();

  const result = await gql.fetch(`
    mutation domainRemove($appId: ID! $domain: String!) {
      domainRemove(appId: $appId, domain: $domain) {
        _id
        name
        image
        domains
        deploymentId
        defaultUrl
      }
    }
  `, { appId: app._id, domain });

  if (!!result.errors) {
    result.errors.forEach((err) => {
      Log.error(err.message);
    });
    process.exit(1);
  }

  Log.info(`\nRemoved domain ${Log.magenta(domain)} from app ${Log.magenta(result.data.domainRemove.name)}\n`);

  await appsList();

  return result.data.domainRemove;
}
