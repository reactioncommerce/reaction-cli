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

        const config = Object.assign({}, res.data.loginWithPassword, { username });

        Config.set('global', 'launchdock', config);
      })
      .catch((e) => Log.error(e));
  });
}
