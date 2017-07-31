import inquirer from 'inquirer';
import { doLogin } from './login';
import { Config, GraphQL, Log } from '../utils';


export function register(yargs) {
  Log.args(yargs.argv);

  inquirer.prompt([{
    type: 'input',
    name: 'inviteToken',
    message: 'Invite Token:'
  }, {
    type: 'input',
    name: 'username',
    message: 'Username:'
  }, {
    type: 'input',
    name: 'name',
    message: 'Full Name:'
  }, {
    type: 'password',
    name: 'password',
    message: 'Password:'
  }, {
    type: 'password',
    name: 'passwordAgain',
    message: 'Password again:'
  }]).then((answers) => {
    const { inviteToken, name, username, password } = answers;

    const gql = new GraphQL();

    gql.register({ token: inviteToken, name, username, password })
      .then((res) => {
        if (!!res.errors) {
          res.errors.forEach((err) => {
            Log.error(err.message);
          });
          process.exit(1);
        }

        const { id, email, org } = res.data.inviteAccept;

        Config.set('global', 'launchdock', { id, username, email, org });

        doLogin(username, password);
      })
      .catch((e) => Log.error(e));
  });
}
