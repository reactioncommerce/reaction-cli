import inquirer from 'inquirer';
import { Config, GraphQL, Log } from '../utils';


export function register(yargs) {
  Log.args(yargs.argv);

  inquirer.prompt([{
    type: 'input',
    name: 'token',
    message: 'Invite Token:'
  }, {
    type: 'input',
    name: 'username',
    message: 'Username:'
  }, {
    type: 'password',
    name: 'password',
    message: 'Password:'
  }, {
    type: 'password',
    name: 'passwordAgain',
    message: 'Password again:'
  }]).then((answers) => {
    const { token, username, password } = answers;

    const gql = new GraphQL();

    gql.register({ token, username, password })
      .then((res) => {
        if (!!res.errors) {
          res.errors.forEach((err) => {
            Log.error(err.message);
          });
          process.exit(1);
        }

        const config = Object.assign({}, res.data.acceptInvite, { username });

        Config.set('global', 'launchdock', config);
      })
      .catch((e) => Log.error(e));
  });
}
