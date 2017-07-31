import inquirer from 'inquirer';
import { Gitlab, Config, Log } from '../utils';

const helpMessage = `
Usage:

  reaction login [options]

    Options:
      --user    Your Reaction username
      --pass    Your Reaction password
`;


export function doLogin(username, password) {
  const gitlab = new Gitlab();

  gitlab.login(username, password)
    .then((res) => {
      if (res.error) {
        Log.error(res.error);
        process.exit(1);
      }

      Config.set('global', 'launchdock', {
        id: res.id,
        username: res.username,
        email: res.email,
        token: res.private_token,
        profile: res.web_url
      });

      Log.success(`\nLogged in as ${username}\n`);
    }).catch((e) => Log.error(e));
}


export function login(yargs) {
  Log.args(yargs.argv);

  const args = yargs.argv;

  if (args.help) {
    return Log.default(helpMessage);
  }

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
