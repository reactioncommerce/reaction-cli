import inquirer from 'inquirer';
import { Config, GraphQL, Log } from '../utils';


export function register(yargs) {
  Log.args(yargs.argv);

  inquirer.prompt([{
    type: 'input',
    name: 'email',
    message: 'Email:'
  }, {
    type: 'password',
    name: 'password',
    message: 'Password:'
  }, {
    type: 'password',
    name: 'passwordAgain',
    message: 'Password again:'
  }]).then((answers) => {
    const gql = new GraphQL();

    gql.register(answers.email, answers.password)
      .then((res) => {
        if (!!res.errors) {
          res.errors.forEach((err) => {
            Log.error(err.message);
          });
          process.exit(1);
        }
        Config.set('global', 'launchdock', res.data.createUser);
      })
      .catch((e) => Log.error(e));
  });
}
