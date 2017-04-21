import { Config, GraphQL, Log } from '../../utils';

export default async function appsList() {
  const gql = new GraphQL();

  const result = await gql.fetch(`
    query {
      apps {
        _id
        deploymentId
        name
        image
        defaultUrl
        domains
        user {
          username
        }
      }
    }
  `);

  if (!!result.errors) {
    result.errors.forEach((err) => {
      Log.error(err.message);
    });
    process.exit(1);
  }

  if (result.data.apps.length === 0) {
    Config.unset('global', 'launchdock.apps');
  } else {
    Config.set('global', 'launchdock.apps', result.data.apps);
  }

  return result.data.apps;
}
