import { exec } from 'shelljs';
import { GraphQL, Log } from '../../utils';
import listApps from './list';

export default async function appCreate({ name, env, remote }) {
  const gql = new GraphQL();

  const result = await gql.fetch(`
    mutation appCreate($name: String!, $env: JSON ) {
      appCreate(name: $name, env: $env) {
        _id
        name
        defaultUrl
        git {
          ssh_url_to_repo
        }
      }
    }
  `, { name, env });

  if (!!result.errors) {
    result.errors.forEach((err) => {
      Log.error(err.message);
    });
    process.exit(1);
  }

  if (remote !== false) {
    Log.info('\nCreating git remote for custom deployment...\n');
    Log.info(`To deploy this repo, run: ${Log.magenta(`reaction deploy --app ${name}`)}\n`);

    const gitRemote = result.data.appCreate.git.ssh_url_to_repo;

    if (exec(`git remote add launchdock-${name} ${gitRemote}`).code !== 0) {
      Log.error('Failed to create git remote');
      process.exit(1);
    }
  } else {
    Log.error('Sorry, deploying a prebuilt image is not available right now. Please contact support for more info.');
    process.exit(1);
    // Log.info(`\nCreated new app: ${Log.magenta(result.data.appCreate.name)}`);
    // Log.info(`\nTo deploy, you can run:\n\n ${Log.magenta(`reaction deploy --app ${name} --image <your-image>`)}\n`);
  }

  Log.success('Done!');

  return listApps();
}
