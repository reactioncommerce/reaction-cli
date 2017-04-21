import inquirer from 'inquirer';
import { Config, GraphQL, Log } from '../utils';
import appsList from './apps/list';
import keysList from './keys/list';


function doLogin(user, pass) {
  const gql = new GraphQL();

  gql.login({ username: user, password: pass })
    .then(async (res) => {
      if (!!res.errors) {
        res.errors.forEach((err) => {
          Log.error(err.message);
        });
        process.exit(1);
      }

      const { user: { _id, email, org: { name } }, token, tokenExpires } = res.data.loginWithPassword;

      Config.set('global', 'launchdock', { _id, username: user, email, token, tokenExpires, org: name });

      await appsList();
      await keysList();

      Log.success(`\nLogged in as ${user}\n`);
    })
    .catch((e) => Log.error(e));
}


export function login(yargs) {
  Log.args(yargs.argv);

  const args = yargs.argv;

  if (args.user && args.pass) {
    return doLogin(args.user, args.pass);
  }

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
    doLogin(username, password);
  });
}
