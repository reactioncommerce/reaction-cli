import { exec } from 'shelljs';
import { GraphQL, Log } from '../../utils';
import listApps from './list';

export default async function appCreate({ name, image }) {
  const gql = new GraphQL();

  const result = await gql.fetch(`
    mutation appCreate($name: String! $image: String ) {
      appCreate(name: $name, image: $image) {
        _id
        name
        image
        deploymentId
        defaultUrl
      }
    }
  `, { name, image });

  if (!!result.errors) {
    result.errors.forEach((err) => {
      Log.error(err.message);
    });
    process.exit(1);
  }

  if (!image) {
    Log.info('\nCreating git remote for custom deployment...\n');
    Log.info(`To deploy this repo, run: ${Log.magenta(`reaction deploy --name ${name}`)}`);

    const remote = `ssh://git@launchdock-builder.getreaction.io:2222/${result.data.appCreate.deploymentId}.git`;

    if (exec(`git remote add launchdock-${name} ${remote}`).code !== 0) {
      Log.error('Failed to create git remote');
      process.exit(1);
    }
  }

  Log.info(`\nCreated new app: ${Log.magenta(result.data.appCreate.name)}`);
  Log.info(`URL: ${Log.magenta(result.data.appCreate.defaultUrl)}\n`);

  Log.success('Done!');

  return listApps();
}
