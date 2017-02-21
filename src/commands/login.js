import inquirer from 'inquirer';
import { Config, GraphQL, Log } from '../utils';


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
      .then((res) => {
        if (!!res.errors) {
          res.errors.forEach((err) => {
            Log.error(err.message);
          });
          process.exit(1);
        }

        const { user: { _id, email }, token, tokenExpires } = res.data.loginWithPassword;

        Config.set('global', 'launchdock', { _id, username, email, token, tokenExpires });

        Log.success(`\nLogged in as ${username}`);
      })
      .catch((e) => Log.error(e));
  });
}
