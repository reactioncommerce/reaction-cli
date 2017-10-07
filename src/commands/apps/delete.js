import _ from 'lodash';
import { exec } from 'shelljs';
import inquirer from 'inquirer';
import { Config, GraphQL, Log } from '../../utils';

export default function appDelete({ name }) {
  const apps = Config.get('global', 'launchdock.apps', []);
  const app = _.filter(apps, (a) => a.name === name)[0];

  if (!app) {
    Log.warn('\nApp deployment not found');
    process.exit(1);
  }

  exec(`git remote remove ${app.group.namespace}-${name}`, { silent: true });

  inquirer.prompt([{
    type: 'confirm',
    name: 'delete',
    message: '\nAre you sure? There\'s no going back!',
    default: false
  }]).then(async (answers) => {
    if (answers.delete) {
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
          Log.error(`Failure deleting app deployment: ${err.message}`);
        });
        process.exit(1);
      }

      Config.set('global', 'launchdock.apps', _.reject(apps, (a) => a.name === name));

      Log.success(`\nApp deployment '${name}' successfully deleted.\n`);
    }
  });

}
