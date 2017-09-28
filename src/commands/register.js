import inquirer from 'inquirer';
import { Config, GraphQL, Log } from '../utils';


export function register(yargs) {
  Log.args(yargs.argv);

  inquirer.prompt([{
    type: 'input',
    name: 'inviteToken',
    message: 'Invite Token:',
    validate(val) {
      return !!val.length || 'An invite token is required!';
    }
  }, {
    type: 'input',
    name: 'name',
    message: 'Full name:',
    validate(val) {
      return !!val.length || 'Full name is required!';
    }
  }, {
    type: 'input',
    name: 'username',
    message: 'Username:',
    validate(val) {
      if (!val) {
        return 'Username is required!';
      }
      if (!val.match('^[a-zA-Z0-9_.-]*$')) {
        return 'Username may only contain letters, digits, "_", "-" and "."\n>> It also cannot start with "-" or end in "."';
      }
      return true;
    }
  }, {
    type: 'password',
    name: 'password',
    message: 'Password:',
    validate(val) {
      return val.length > 7 || 'Password must be at least 8 characters!';
    }
  }, {
    type: 'password',
    name: 'passwordAgain',
    message: 'Password again:',
    validate(val, previousAnswers) {
      return val === previousAnswers.password || 'Password does not match!';
    }
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

          Config.set('global', 'launchdock', { _id, name, username, email, token, tokenExpires });

          Log.success(`\nLogged in as ${username}`);
        });
      })
      .catch((e) => Log.error(e));
  });
}
