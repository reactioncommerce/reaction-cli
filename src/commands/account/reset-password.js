import inquirer from 'inquirer';
import { GraphQL, Log } from '../../utils';

export default async function resetPassword() {

  const { token, password } = await inquirer.prompt([{
    type: 'input',
    name: 'token',
    message: 'Please provide the token from the password reset email you received:',
    validate(val) {
      return !!val.length || 'A reset token is required!';
    }
  }, {
    type: 'password',
    name: 'password',
    message: 'New password:',
    validate(val) {
      return val.length > 7 || 'Password must be at least 8 characters!';
    }
  }, {
    type: 'password',
    name: 'passwordAgain',
    message: 'New password again:',
    validate(val, previousAnswers) {
      return val === previousAnswers.password || 'Password does not match!';
    }
  }]);

  const gql = new GraphQL();

  const result = await gql.resetPassword({ token, password });

  if (!!result.errors) {
    result.errors.forEach((err) => {
      Log.error(err.message);
    });
    process.exit(1);
  }

  Log.success('\nPassword has successfully been reset!\n');

  return result;
}
