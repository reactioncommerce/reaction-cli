import dns from 'dns';
import _ from 'lodash';
import Promise from 'bluebird';
import appsList from '../apps/list';
import { Config, GraphQL, Log } from '../../utils';

const resolveCname = Promise.promisify(dns.resolveCname);

export default async function domainSet({ name, domain }) {
  const apps = Config.get('global', 'launchdock.apps', []);
  const app = _.filter(apps, (a) => a.name === name)[0];

  if (!app) {
    return Log.error('\nApp deployment not found');
  }

  const ingress = Config.get('cli', 'launchdock.ingress');

  let cNames;
  try {
    cNames = await resolveCname(domain);
  } catch(err) {
    Log.error('\n' + err.toString());
    Log.warn(`\nFailed to verify domain: ${Log.blue(domain)}`);
    if (err.toString().includes('queryCname ENOTFOUND')) {
      Log.warn(`Please ensure it is spelled correctly and that its DNS is pointed at: ${Log.blue(ingress)}`);
      process.exit(1);
    }
    Log.warn(`\nPlease ensure that its DNS is pointed at: ${Log.blue(ingress)}`);
    process.exit(1);
  }

  if (cNames.includes(ingress)) {
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

  Log.error(`\nERROR: It looks like '${domain}' is not yet pointed at '${ingress}'.`);
  Log.error('This is required for app routing and automatic SSL certificates. Please try again once your DNS is updated.\n');
  process.exit(1);
}
