import inquirer from 'inquirer';
import { Config, GraphQL, Log } from '../utils';


export function register(yargs) {
  Log.args(yargs.argv);

  inquirer.prompt([{
    type: 'input',
    name: 'inviteToken',
    message: 'Invite Token:'
  }, {
    type: 'input',
    name: 'name',
    message: 'Full name:'
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
    const { inviteToken, username, password, name } = answers;

    const gql = new GraphQL();

    gql.register({ token: inviteToken, name, username, password })
      .then((res) => {
        if (!!res.errors) {
          res.errors.forEach((err) => {
            Log.error(err.message);
          });
          process.exit(1);
        }

        const { _id, email } = res.data.inviteAccept;

        gql.login({ username, password }).then((result) => {
          if (!!result.errors) {
            result.errors.forEach((err) => {
              Log.error(err.message);
            });
            process.exit(1);
          }

          const { token, tokenExpires } = result.data.loginWithPassword;
          const org = result.data.loginWithPassword.user.org.name;

          Config.set('global', 'launchdock', { _id, name, username, email, token, tokenExpires, org });

          Log.success(`\nLogged in as ${username}`);
        });
      })
      .catch((e) => Log.error(e));
  });
}
