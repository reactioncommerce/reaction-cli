import inquirer from 'inquirer';
import { echo, exec, which } from 'shelljs';
import { Log, info } from './logger';

export default function () {
  const meteorInstalled = !!which('meteor');

  if (!meteorInstalled) {
    Log.warn('Oops! You don\'t have Meteor installed yet! \n');

    inquirer.prompt([{
      type: 'confirm',
      name: 'meteor',
      message: 'Would you like to install it now?',
      default: true
    }]).then((answers) => {
      if (answers.meteor) {
        Log.info('Installing Meteor...\n');
        exec('curl https://install.meteor.com/ | sh');
        Log.success('Meteor successfully installed!');
      } else {
        echo('\nOk, try running this command again once you have Meteor installed.');
        echo(`Learn more at: ${info.underline('http://www.meteor.com')}`);
        process.exit(1);
      }
    });
  }
}
