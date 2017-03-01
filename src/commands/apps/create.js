import { exec } from 'shelljs';
import { GraphQL, Log } from '../../utils';
import listApps from './list';

export default async function createApp({ name, image }) {
  const gql = new GraphQL();

  const result = await gql.fetch(`
    mutation createApp($name: String! $image: String ) {
      createApp(name: $name, image: $image) {
        _id
        name
        image
        deploymentId
      }
    }
  `, { name, image });

  if (!!result.errors) {
    result.errors.forEach((err) => {
      Log.error(err.message);
    });
    process.exit(1);
  }

  Log.info(`Created new app: ${Log.magenta(result.data.createApp.name)}\n`);

  if (!image) {
    Log.info('Creating git remote for custom deployment...\n');

    const remote = `ssh://git@launchdock-builder.getreaction.io:2222/${result.data.createApp.deploymentId}.git`;

    if (exec(`git remote add launchdock-${name} ${remote}`).code !== 0) {
      Log.error('Failed to create git remote');
      process.exit(1);
    }

    Log.success('Done!');
  }

  return listApps();
}
