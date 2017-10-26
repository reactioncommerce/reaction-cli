import inquirer from 'inquirer';
import { sync as cmdExists } from 'command-exists';
import { exec } from 'shelljs';
import Log from './logger';

export default function (callback) {
  const { blue } = Log;

  if (!cmdExists('meteor')) {
    Log.warn('\nOops! You don\'t have Meteor installed yet! \n');

    if (process.platform === 'win32') {
      Log.warn('\nPlease download and install Meteor from: https://install.meteor.com/windows\n');
      process.exit(1);
    }

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
        callback();
      } else {
        Log.info('\nOk, try running this command again once you have Meteor installed.');
        Log.info(`Learn more at: ${blue.bold.underline('http://www.meteor.com')}\n`);
        process.exit(1);
      }
    });
  } else {
    callback();
  }
}
