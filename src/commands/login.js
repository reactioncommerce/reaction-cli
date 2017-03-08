import inquirer from 'inquirer';
import { Config, GraphQL, Log } from '../utils';
import appsList from './apps/list';
import keysList from './keys/list';


export function login(yargs) {
  Log.args(yargs.argv);

  inquirer.prompt([{
    type: 'input',
    name: 'username',
    message: 'Username:'
  }, {
    type: 'password',
    name: 'password',
    message: 'Password:'
  }]).then((answers) => {
    const { username, password } = answers;

    const gql = new GraphQL();

    gql.login({ username, password })
      .then(async (res) => {
        if (!!res.errors) {
          res.errors.forEach((err) => {
            Log.error(err.message);
          });
          process.exit(1);
        }

        const { user: { _id, email }, token, tokenExpires } = res.data.loginWithPassword;

        Config.set('global', 'launchdock', { _id, username, email, token, tokenExpires });

        await appsList();
        await keysList();

        Log.success(`\nLogged in as ${username}`);
      })
      .catch((e) => Log.error(e));
  });
}
