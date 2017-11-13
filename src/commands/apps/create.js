import { exec } from 'child-process-promise';
import { GraphQL, Log } from '../../utils';
import listApps from './list';

export default async function appCreate({ name, env, remote }) {

  if (!name.match('^[a-z0-9_-]*$')) {
    Log.error('\nApp names may only contain lower case letters, digits, "_", and "-"\n');
    process.exit(1);
  }

  const gql = new GraphQL();

  const result = await gql.fetch(`
    mutation appCreate($name: String!, $env: JSON) {
      appCreate(name: $name, env: $env) {
        _id
        name
        defaultUrl
        git {
          ssh_url_to_repo
        }
        group {
          namespace
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
    const namespace = result.data.appCreate.group.namespace;
    const remoteName = `${namespace}-${name}`;
    const remoteAddCommand = `git remote add ${remoteName} ${gitRemote}`;

    try {
      await exec(remoteAddCommand);
    } catch (error) {
      try {
        await exec(`git remote set-url ${remoteName} ${gitRemote}`);
      } catch (err) {
        Log.warn('Failed to add or update the git remote in your repo.');
        Log.warn(`Please try adding it manually with: ${Log.magenta(remoteAddCommand)}`);
        process.exit(1);
      }
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
